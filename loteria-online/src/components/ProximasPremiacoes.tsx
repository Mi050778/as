'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const proximasPremiacoes = [
  {
    nome: 'Mega-Sena',
    concurso: '2680',
    premio: 'R$ 45.000.000',
    dataProximo: '2024-01-06',
    horario: '20:00',
    cor: 'from-green-500 to-green-600',
    acumulou: true,
    ultimosNumeros: [8, 15, 23, 31, 42, 55]
  },
  {
    nome: 'Lotofácil',
    concurso: '2950',
    premio: 'R$ 1.700.000',
    dataProximo: '2024-01-05',
    horario: '20:00',
    cor: 'from-purple-500 to-purple-600',
    acumulou: false,
    ultimosNumeros: [2, 4, 5, 7, 9, 11, 13, 14, 15, 17, 18, 19, 21, 23, 25]
  },
  {
    nome: 'Quina',
    concurso: '6350',
    premio: 'R$ 8.500.000',
    dataProximo: '2024-01-05',
    horario: '20:00',
    cor: 'from-blue-500 to-blue-600',
    acumulou: true,
    ultimosNumeros: [12, 25, 38, 52, 67]
  },
  {
    nome: 'Lotomania',
    concurso: '2580',
    premio: 'R$ 3.200.000',
    dataProximo: '2024-01-06',
    horario: '20:00',
    cor: 'from-orange-500 to-orange-600',
    acumulou: false,
    ultimosNumeros: [5, 12, 18, 23, 29, 34, 41, 47, 55, 63, 68, 71, 77, 82, 88, 91, 95, 98, 00, 00]
  },
  {
    nome: 'Dupla Sena',
    concurso: '2500',
    premio: 'R$ 2.800.000',
    dataProximo: '2024-01-06',
    horario: '20:00',
    cor: 'from-red-500 to-red-600',
    acumulou: true,
    ultimosNumeros: [8, 15, 23, 31, 42, 55]
  },
  {
    nome: 'Timemania',
    concurso: '2050',
    premio: 'R$ 4.100.000',
    dataProximo: '2024-01-06',
    horario: '20:00',
    cor: 'from-teal-500 to-teal-600',
    acumulou: false,
    ultimosNumeros: [12, 25, 33, 45, 52, 68, 71]
  }
]

export default function ProximasPremiacoes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Próximas Premiações
          </h2>
          <p className="text-gray-600 text-lg">
            Confira os próximos sorteios e não perca a chance de ganhar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proximasPremiacoes.map((loteria, index) => (
            <motion.div
              key={loteria.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-r ${loteria.cor} text-white p-4`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{loteria.nome}</h3>
                  {loteria.acumulou && (
                    <span className="bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full font-bold">
                      ACUMULOU!
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-90">Concurso {loteria.concurso}</p>
              </div>

              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {loteria.premio}
                  </div>
                  <div className="flex items-center justify-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(loteria.dataProximo).toLocaleDateString('pt-BR')}
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    {loteria.horario}
                  </div>
                </div>

                {/* Últimos números sorteados */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Último resultado:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {loteria.ultimosNumeros.slice(0, loteria.nome === 'Lotofácil' ? 15 : 6).map((numero, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium"
                      >
                        {numero.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/${loteria.nome.toLowerCase().replace('-', '')}`}
                  className={`w-full bg-gradient-to-r ${loteria.cor} text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Apostar Agora
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/resultados"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Ver Todos os Resultados
          </Link>
        </motion.div>
      </div>
    </section>
  )
}