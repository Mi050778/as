'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Clock, Star } from 'lucide-react'
import Link from 'next/link'

const boloesDestaque = [
  {
    id: 1,
    nome: 'Mega-Sena Premium',
    loteria: 'Mega-Sena',
    concurso: '2680',
    totalJogos: 20,
    dezenas: 8,
    valorCota: 47.50,
    cotasDisponiveis: 18,
    totalCotas: 50,
    premio: 'R$ 45.000.000',
    dataLimite: '2024-01-06T18:00:00',
    cor: 'from-green-500 to-green-600',
    destaque: true,
    garantia: '4 acertos se sortear 6 dezenas'
  },
  {
    id: 2,
    nome: 'Lotofácil Certeiro',
    loteria: 'Lotofácil',
    concurso: '2950',
    totalJogos: 15,
    dezenas: 17,
    valorCota: 32.00,
    cotasDisponiveis: 8,
    totalCotas: 30,
    premio: 'R$ 1.700.000',
    dataLimite: '2024-01-05T18:00:00',
    cor: 'from-purple-500 to-purple-600',
    destaque: false,
    garantia: '14 acertos garantidos'
  },
  {
    id: 3,
    nome: 'Quina Estratégica',
    loteria: 'Quina',
    concurso: '6350',
    totalJogos: 25,
    dezenas: 7,
    valorCota: 28.50,
    cotasDisponiveis: 12,
    totalCotas: 40,
    premio: 'R$ 8.500.000',
    dataLimite: '2024-01-05T18:00:00',
    cor: 'from-blue-500 to-blue-600',
    destaque: false,
    garantia: '3 acertos se sortear 5 dezenas'
  }
]

function formatTimeRemaining(dataLimite: string) {
  const now = new Date()
  const limite = new Date(dataLimite)
  const diff = limite.getTime() - now.getTime()
  
  if (diff <= 0) return 'Encerrado'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

export default function BoloesDestaque() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Bolões em Destaque
          </h2>
          <p className="text-gray-600 text-lg">
            Participe dos nossos bolões e aumente suas chances de ganhar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {boloesDestaque.map((bolao, index) => (
            <motion.div
              key={bolao.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                bolao.destaque ? 'ring-2 ring-yellow-400 scale-105' : ''
              }`}
            >
              {bolao.destaque && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm font-bold">MAIS POPULAR</span>
                  </div>
                </div>
              )}

              <div className={`bg-gradient-to-r ${bolao.cor} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{bolao.nome}</h3>
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-sm opacity-90">{bolao.loteria} • Concurso {bolao.concurso}</p>
                <div className="mt-3">
                  <div className="text-2xl font-bold">{bolao.premio}</div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{bolao.totalJogos}</div>
                    <div className="text-sm text-gray-600">Jogos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{bolao.dezenas}</div>
                    <div className="text-sm text-gray-600">Dezenas</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Valor da cota:</span>
                    <span className="font-bold text-xl text-green-600">
                      R$ {bolao.valorCota.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cotas disponíveis:</span>
                    <span className="font-bold">
                      {bolao.cotasDisponiveis}/{bolao.totalCotas}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Tempo restante:
                    </span>
                    <span className="font-bold text-red-600">
                      {formatTimeRemaining(bolao.dataLimite)}
                    </span>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(((bolao.totalCotas - bolao.cotasDisponiveis) / bolao.totalCotas) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${bolao.cor} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${((bolao.totalCotas - bolao.cotasDisponiveis) / bolao.totalCotas) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 font-medium">
                    🎯 {bolao.garantia}
                  </p>
                </div>

                <Link
                  href={`/boloes/${bolao.id}`}
                  className={`w-full bg-gradient-to-r ${bolao.cor} text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Participar do Bolão
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/boloes"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Ver Todos os Bolões
          </Link>
        </motion.div>
      </div>
    </section>
  )
}