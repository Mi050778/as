'use client'

import { motion } from 'framer-motion'
import { Trophy, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const ultimosResultados = [
  {
    nome: 'Mega-Sena',
    concurso: '2679',
    data: '2024-01-03',
    numeros: [8, 15, 23, 31, 42, 55],
    acumulou: true,
    proximoPremio: 'R$ 45.000.000',
    ganhadores: 0,
    cor: 'from-green-500 to-green-600'
  },
  {
    nome: 'Lotofácil',
    concurso: '2949',
    data: '2024-01-03',
    numeros: [2, 4, 5, 7, 9, 11, 13, 14, 15, 17, 18, 19, 21, 23, 25],
    acumulou: false,
    proximoPremio: 'R$ 1.700.000',
    ganhadores: 3,
    cor: 'from-purple-500 to-purple-600'
  },
  {
    nome: 'Quina',
    concurso: '6349',
    data: '2024-01-03',
    numeros: [12, 25, 38, 52, 67],
    acumulou: true,
    proximoPremio: 'R$ 8.500.000',
    ganhadores: 0,
    cor: 'from-blue-500 to-blue-600'
  }
]

export default function UltimosResultados() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Últimos Resultados
          </h2>
          <p className="text-gray-600 text-lg">
            Confira os números sorteados mais recentes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ultimosResultados.map((resultado, index) => (
            <motion.div
              key={resultado.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-r ${resultado.cor} text-white p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{resultado.nome}</h3>
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="text-sm opacity-90">
                  Concurso {resultado.concurso} • {new Date(resultado.data).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Números sorteados:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {resultado.numeros.map((numero, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className={`bg-gradient-to-r ${resultado.cor} text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md`}
                      >
                        {numero.toString().padStart(2, '0')}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center">
                      {resultado.acumulou ? (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Acumulou
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {resultado.ganhadores} ganhador{resultado.ganhadores !== 1 ? 'es' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Próximo prêmio:</span>
                    <span className="font-bold text-gray-800">{resultado.proximoPremio}</span>
                  </div>
                </div>

                <Link
                  href={`/${resultado.nome.toLowerCase().replace('-', '')}/resultados`}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  Ver Histórico Completo
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