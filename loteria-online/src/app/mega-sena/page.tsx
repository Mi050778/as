import LoteriaPage from '@/components/LoteriaPage'

const megaSenaData = {
  nome: 'Mega-Sena',
  descricao: 'A maior loteria do Brasil! Escolha de 6 a 15 números entre 1 e 60.',
  concurso: '2680',
  premio: 'R$ 45.000.000',
  dataProximo: '2024-01-06',
  horario: '20:00',
  cor: 'from-green-500 to-green-600',
  corSecundaria: 'green',
  acumulou: true,
  ultimosNumeros: [8, 15, 23, 31, 42, 55],
  regras: {
    numerosMinimos: 6,
    numerosMaximos: 15,
    numerosTotais: 60,
    valorMinimo: 5.00,
    diasSorteio: ['Quarta-feira', 'Sábado'],
    probabilidades: {
      sena: '1 em 50.063.860',
      quina: '1 em 154.518',
      quadra: '1 em 2.332'
    }
  },
  premiacoes: [
    { acertos: 6, descricao: 'Sena', valor: 'R$ 45.000.000' },
    { acertos: 5, descricao: 'Quina', valor: 'R$ 52.158' },
    { acertos: 4, descricao: 'Quadra', valor: 'R$ 1.037' }
  ],
  dicas: [
    'Evite apostar em sequências numéricas (1, 2, 3, 4, 5, 6)',
    'Misture números pares e ímpares na sua aposta',
    'Considere usar fechamentos para aumentar suas chances',
    'Participe de bolões para jogar com mais números'
  ],
  estatisticas: {
    numerosMaisSorteados: [10, 5, 23, 42, 33, 4, 37, 20, 2, 27],
    numerosMenosSorteados: [26, 21, 60, 7, 35, 12, 29, 41, 9, 18]
  }
}

export default function MegaSenaPage() {
  return <LoteriaPage loteria={megaSenaData} />
}