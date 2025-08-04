import LoteriaPage from '@/components/LoteriaPage'

const lotofacilData = {
  nome: 'Lotofácil',
  descricao: 'A loteria mais fácil de ganhar! Escolha de 15 a 20 números entre 1 e 25.',
  concurso: '2950',
  premio: 'R$ 1.700.000',
  dataProximo: '2024-01-05',
  horario: '20:00',
  cor: 'from-purple-500 to-purple-600',
  corSecundaria: 'purple',
  acumulou: false,
  ultimosNumeros: [2, 4, 5, 7, 9, 11, 13, 14, 15, 17, 18, 19, 21, 23, 25],
  regras: {
    numerosMinimos: 15,
    numerosMaximos: 20,
    numerosTotais: 25,
    valorMinimo: 3.00,
    diasSorteio: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    probabilidades: {
      '15 pontos': '1 em 3.268.760',
      '14 pontos': '1 em 21.792',
      '13 pontos': '1 em 691',
      '12 pontos': '1 em 60',
      '11 pontos': '1 em 11'
    }
  },
  premiacoes: [
    { acertos: 15, descricao: '15 pontos', valor: 'R$ 1.700.000' },
    { acertos: 14, descricao: '14 pontos', valor: 'R$ 1.581' },
    { acertos: 13, descricao: '13 pontos', valor: 'R$ 30' },
    { acertos: 12, descricao: '12 pontos', valor: 'R$ 12' },
    { acertos: 11, descricao: '11 pontos', valor: 'R$ 6' }
  ],
  dicas: [
    'A Lotofácil tem sorteios de segunda a sexta-feira',
    'Evite apostar apenas em números baixos (1-12)',
    'Misture números pares e ímpares em sua aposta',
    'Considere usar estratégias de fechamentos',
    'A probabilidade de ganhar algum prêmio é de 1 em 11'
  ],
  estatisticas: {
    numerosMaisSorteados: [20, 2, 25, 4, 13, 23, 11, 3, 14, 1],
    numerosMenosSorteados: [26, 21, 19, 7, 12, 24, 8, 16, 6, 22]
  }
}

export default function LotofacilPage() {
  return <LoteriaPage loteria={lotofacilData} />
}