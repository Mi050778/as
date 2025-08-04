'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, TrendingUp, Users, DollarSign, Target, Info, Sparkles } from 'lucide-react'
import Link from 'next/link'
import LoteriaForm from './LoteriaForm'

interface LoteriaData {
  nome: string
  descricao: string
  concurso: string
  premio: string
  dataProximo: string
  horario: string
  cor: string
  corSecundaria: string
  acumulou: boolean
  ultimosNumeros: number[]
  regras: {
    numerosMinimos: number
    numerosMaximos: number
    numerosTotais: number
    valorMinimo: number
    diasSorteio: string[]
    probabilidades: {
      [key: string]: string
    }
  }
  premiacoes: Array<{
    acertos: number
    descricao: string
    valor: string
  }>
  dicas: string[]
  estatisticas: {
    numerosMaisSorteados: number[]
    numerosMenosSorteados: number[]
  }
}

interface LoteriaPageProps {
  loteria: LoteriaData
}

export default function LoteriaPage({ loteria }: LoteriaPageProps) {
  const [activeTab, setActiveTab] = useState('apostar')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${loteria.cor} text-white py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{loteria.nome}</h1>
              <p className="text-xl mb-6 text-white/90">{loteria.descricao}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{loteria.premio}</div>
                  <div className="text-sm opacity-90">Prêmio estimado</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{loteria.concurso}</div>
                  <div className="text-sm opacity-90">Próximo concurso</div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(loteria.dataProximo).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {loteria.horario}
                </div>
                {loteria.acumulou && (
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold">
                    ACUMULOU!
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-4">Último resultado</h3>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {loteria.ultimosNumeros.map((numero, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold"
                  >
                    {numero.toString().padStart(2, '0')}
                  </motion.div>
                ))}
              </div>
              <Link
                href={`/${loteria.nome.toLowerCase().replace('-', '')}/resultados`}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                Ver histórico completo →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'apostar', label: 'Fazer Aposta', icon: Target },
              { id: 'boloes', label: 'Bolões', icon: Users },
              { id: 'premiacoes', label: 'Premiações', icon: DollarSign },
              { id: 'estatisticas', label: 'Estatísticas', icon: TrendingUp },
              { id: 'dicas', label: 'Dicas', icon: Info }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? `text-${loteria.corSecundaria}-600 border-b-2 border-${loteria.corSecundaria}-600 bg-${loteria.corSecundaria}-50`
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'apostar' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Faça sua aposta</h2>
                <LoteriaForm loteria={loteria} />
              </div>
            )}

            {activeTab === 'boloes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Bolões Disponíveis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Placeholder para bolões */}
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Bolões em breve...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'premiacoes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Premiações</h2>
                <div className="space-y-4">
                  {loteria.premiacoes.map((premiacao, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg">{premiacao.acertos} acertos</span>
                        <span className="text-gray-600 ml-2">({premiacao.descricao})</span>
                      </div>
                      <span className="font-bold text-green-600">{premiacao.valor}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Probabilidades</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(loteria.regras.probabilidades).map(([tipo, prob]) => (
                      <div key={tipo} className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="font-bold text-blue-600 capitalize">{tipo}</div>
                        <div className="text-sm text-gray-600">{prob}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'estatisticas' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Estatísticas</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      <Sparkles className="inline h-5 w-5 mr-2 text-yellow-500" />
                      Números mais sorteados
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {loteria.estatisticas.numerosMaisSorteados.map((numero, index) => (
                        <div
                          key={index}
                          className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm"
                        >
                          {numero.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Números menos sorteados
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {loteria.estatisticas.numerosMenosSorteados.map((numero, index) => (
                        <div
                          key={index}
                          className="bg-red-100 text-red-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm"
                        >
                          {numero.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Informações gerais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Dias de sorteio:</span>
                      <div>{loteria.regras.diasSorteio.join(', ')}</div>
                    </div>
                    <div>
                      <span className="font-medium">Aposta mínima:</span>
                      <div>{loteria.regras.numerosMinimos} números</div>
                    </div>
                    <div>
                      <span className="font-medium">Valor mínimo:</span>
                      <div>R$ {loteria.regras.valorMinimo.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dicas' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dicas para apostar</h2>
                <div className="space-y-4">
                  {loteria.dicas.map((dica, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
                    >
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                        <p className="text-gray-700">{dica}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}