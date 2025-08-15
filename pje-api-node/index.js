require('dotenv').config();
const express = require('express');
const axios = require('axios');
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const qs = require('qs');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { parseStringPromise } = require('xml2js');

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;
const PJE_BASE_URL = process.env.PJE_BASE_URL || 'https://pje1g.trf1.jus.br';
const PJE_LIST_PATH = process.env.PJE_LIST_PATH || '/pje/Processo/ConsultaProcesso/listView.seam';
const SSO_BASE_URL = process.env.SSO_BASE_URL || 'https://sso.cloud.pje.jus.br';
const REALM = process.env.REALM || 'pje';
const CLIENT_ID = process.env.CLIENT_ID || 'pje-trf1-1g';

function createHttpClient() {
	const jar = new tough.CookieJar();
	const client = wrapper(axios.create({
		jar,
		withCredentials: true,
		maxRedirects: 0,
		validateStatus: (s) => s >= 200 && s < 400,
		responseType: 'arraybuffer'
	}));
	return { client, jar };
}

function toUtf8(buffer, contentType) {
	// Site serves ISO-8859-1 in many pages
	const isIso = contentType && /charset=\s*ISO-8859-1/i.test(contentType);
	return isIso ? iconv.decode(buffer, 'ISO-8859-1') : buffer.toString('utf8');
}

async function followRedirect(client, location) {
	if (!location) throw new Error('Missing redirect location');
	return client.get(location, { headers: { 'User-Agent': defaultUA } });
}

const defaultUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';

async function keycloakLogin({ username, password }) {
	const { client, jar } = createHttpClient();
	// Step 1: open system login page to trigger SSO
	const entryUrl = `${PJE_BASE_URL}/pje/login.seam?loginComCertificado=false&cid=162574`;
	const r1 = await client.get(entryUrl, { headers: { 'User-Agent': defaultUA } });
	let next = r1.headers.location;
	if (r1.status === 302 && next) {
		await followRedirect(client, next);
	}
	// Step 2: open Keycloak login page to fetch params
	const kcAuthUrl = `${SSO_BASE_URL}/auth/realms/${REALM}/protocol/openid-connect/auth`;
	const authParams = {
		client_id: CLIENT_ID,
		response_type: 'code',
		scope: 'openid',
		redirect_uri: `${PJE_BASE_URL}/pje/authenticateSSO.seam`,
	};
	const rAuth = await client.get(`${kcAuthUrl}?${qs.stringify(authParams)}`, { headers: { 'User-Agent': defaultUA } });
	// Parse login form to get action with session_code, execution, tab_id
	const html = toUtf8(rAuth.data, rAuth.headers['content-type']);
	const $ = cheerio.load(html);
	const form = $('form');
	const action = form.attr('action');
	if (!action) throw new Error('Keycloak form action not found');
	const formInputs = {};
	form.find('input').each((_, el) => {
		const name = $(el).attr('name');
		if (!name) return;
		formInputs[name] = $(el).attr('value') || '';
	});
	// Step 3: submit credentials
	const postUrl = action.startsWith('http') ? action : `${SSO_BASE_URL}${action}`;
	const body = qs.stringify({
		...formInputs,
		username,
		password,
		'pjeoffice-code': '',
		phrase: ''
	});
	const rLogin = await client.post(postUrl, body, {
		headers: {
			'User-Agent': defaultUA,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Origin': 'null',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
		},
	});
	if (rLogin.status !== 302) {
		const page = toUtf8(rLogin.data, rLogin.headers['content-type']);
		throw new Error(`Login falhou, status ${rLogin.status}. Conteudo: ${page.substring(0, 500)}`);
	}
	const authCodeLocation = rLogin.headers.location;
	if (!authCodeLocation) throw new Error('Sem redirect com code');
	// Step 4: redirect back to PJe authenticateSSO
	const rBack = await client.get(authCodeLocation, { headers: { 'User-Agent': defaultUA } });
	// Some instances redirect once more to plain authenticateSSO.seam
	if (rBack.status === 302 && rBack.headers.location) {
		await followRedirect(client, rBack.headers.location);
	}
	return { client, jar };
}

async function fetchConsultaViewState(client) {
	// Open the list page to get javax.faces.ViewState
	const url = `${PJE_BASE_URL}${PJE_LIST_PATH}`;
	const r = await client.get(url, { headers: { 'User-Agent': defaultUA, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } });
	const html = toUtf8(r.data, r.headers['content-type']);
	const $ = cheerio.load(html);
	const viewState = $('input[name="javax.faces.ViewState"]').attr('value') || 'j_id4';
	return { viewState };
}

async function postAjaxConsulta(client, payload) {
	const url = `${PJE_BASE_URL}${PJE_LIST_PATH}`;
	const body = qs.stringify(payload);
	const r = await client.post(url, body, {
		headers: {
			'User-Agent': defaultUA,
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Accept': '*/*',
			'Faces-Request': 'partial/ajax',
			'X-Requested-With': 'XMLHttpRequest',
			'Origin': PJE_BASE_URL,
			'Referer': `${PJE_BASE_URL}${PJE_LIST_PATH}`
		}
	});
	const xml = toUtf8(r.data, r.headers['content-type']);
	return xml;
}

function buildSearchPayload({ viewState, params }) {
	// Map minimal fields for your example
	const payload = {
		AJAXREQUEST: '_viewRoot',
		'fPP:j_id149:nomeParte': params.nomeParte || '',
		'fPP:j_id158:outrosNomesAlcunha': '',
		'fPP:j_id167:nomeAdvogado': '',
		tipoMascaraDocumento: 'on',
		'fPP:dpDec:documentoParte': '',
		'fPP:numeroProcesso:numeroSequencial': '',
		'fPP:numeroProcesso:numeroDigitoVerificador': '',
		'fPP:numeroProcesso:Ano': '',
		'fPP:numeroProcesso:ramoJustica': params.ramoJustica || '4',
		'fPP:numeroProcesso:respectivoTribunal': params.respectivoTribunal || '01',
		'fPP:numeroProcesso:NumeroOrgaoJustica': '',
		'fPP:processoReferenciaDecoration:habilitarMascaraProcessoReferencia': 'true',
		'fPP:processoReferenciaDecoration:IdProcessoReferenciaComMascaraDecoration:IdProcessoReferenciaComMascara': '',
		'fPP:j_id247:assunto': '',
		'fPP:j_id256:classeJudicial': '',
		'fPP:j_id265:numeroDocumento': '',
		'fPP:decorationDados:numeroOAB': params.numeroOAB || '',
		'fPP:decorationDados:letraOAB': params.letraOAB || '',
		'fPP:decorationDados:UfOABCombo': params.ufOABCombo || 'org.jboss.seam.ui.NoSelectionConverter.noSelectionValue',
		'fPP:jurisdicaoComboDecoration:jurisdicaoCombo': 'org.jboss.seam.ui.NoSelectionConverter.noSelectionValue',
		'fPP:orgaoJulgadorComboDecoration:orgaoJulgadorCombo': 'org.jboss.seam.ui.NoSelectionConverter.noSelectionValue',
		'fPP:dataAutuacaoDecoration:dataAutuacaoInicioInputDate': params.autuacaoInicio || '',
		'fPP:dataAutuacaoDecoration:dataAutuacaoInicioInputCurrentDate': params.autuacaoInicioCurrent || '08/2025',
		'fPP:dataAutuacaoDecoration:dataAutuacaoFimInputDate': params.autuacaoFim || '',
		'fPP:dataAutuacaoDecoration:dataAutuacaoFimInputCurrentDate': params.autuacaoFimCurrent || '08/2025',
		'fPP:valorDaCausaDecoration:valorCausaInicial': params.valorCausaInicial || '',
		'fPP:valorDaCausaDecoration:valorCausaFinal': params.valorCausaFinal || '',
		'fPP:j_id406:movimentacaoProcessualSuggest': '',
		'fPP:j_id406:j_id417_selection': '',
		'fPP:j_id423:j_id428': '',
		'fPP:j_id423:j_id430:orgaoOrigemCriminal': 'org.jboss.seam.ui.NoSelectionConverter.noSelectionValue',
		'fPP:j_id423:numeroProcedCriminal:numeroProcedCriminal': '',
		'fPP:j_id423:numeroProcedCriminal:anoProcedCriminal': '',
		'fPP:j_id423:numeroProtocoloPolicia:numeroProtocoloPolicia': '',
		fPP: 'fPP',
		autoScroll: '',
		'javax.faces.ViewState': viewState || 'j_id4',
		'fPP:j_id465': 'fPP:j_id465',
		'AJAX:EVENTS_COUNT': '1'
	};
	return payload;
}

function buildPaginatePayload({ viewState, totalCount, action }) {
	return {
		AJAXREQUEST: '_viewRoot',
		fPP: 'fPP',
		autoScroll: '',
		'javax.faces.ViewState': viewState || 'j_id4',
		'fPP:processosTable:scTabela': action, // fastforward, fastrewind, next, previous
		processosGridCount: String(totalCount),
		ajaxSingle: 'fPP:processosTable:scTabela',
		'AJAX:EVENTS_COUNT': '1'
	};
}

async function parsePartialResponseXml(xml) {
	// JSF partial-response; extract updates with HTML fragments
	const parsed = await parseStringPromise(xml, { explicitArray: false, trim: true });
	return parsed; // caller can inspect partial-response > changes
}

app.post('/login', async (req, res) => {
	try {
		const username = req.body.username || process.env.PJE_USERNAME;
		const password = req.body.password || process.env.PJE_PASSWORD;
		if (!username || !password) return res.status(400).json({ error: 'Informe username e password' });
		const { client, jar } = await keycloakLogin({ username, password });
		const { viewState } = await fetchConsultaViewState(client);
		// Return a session token representation (serialize cookie jar)
		const serializedJar = await jar.serializeAsync();
		res.json({ ok: true, viewState, jar: serializedJar });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

function reviveClientFromJar(serializedJar) {
	const { client, jar } = createHttpClient();
	if (serializedJar) {
		const revived = tough.CookieJar.fromJSON(serializedJar);
		jar.store = revived.store;
	}
	return { client, jar };
}

app.post('/search', async (req, res) => {
	try {
		const { jar: serializedJar, viewState, params } = req.body;
		if (!serializedJar || !viewState) return res.status(400).json({ error: 'jar e viewState são obrigatórios' });
		const { client } = reviveClientFromJar(serializedJar);
		const payload = buildSearchPayload({ viewState, params: params || {} });
		const xml = await postAjaxConsulta(client, payload);
		const parsed = await parsePartialResponseXml(xml);
		res.json({ ok: true, xml, parsed });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/paginate', async (req, res) => {
	try {
		const { jar: serializedJar, viewState, totalCount, action } = req.body;
		if (!serializedJar || !viewState || !action) return res.status(400).json({ error: 'jar, viewState e action são obrigatórios' });
		const { client } = reviveClientFromJar(serializedJar);
		const payload = buildPaginatePayload({ viewState, totalCount: totalCount || 0, action });
		const xml = await postAjaxConsulta(client, payload);
		const parsed = await parsePartialResponseXml(xml);
		res.json({ ok: true, xml, parsed });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`PJE API rodando na porta ${PORT}`);
});