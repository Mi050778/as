'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Award, Users, DollarSign, Mail } from 'lucide-react'
import { useState } from 'react'

const estatisticas = [
  {
    titulo: 'Total Apostado',
    valor: 'R$ 50.2M',
    descricao: 'Volume total de apostas',
    icone: DollarSign,
    cor: 'from-green-500 to-green-600',
    crescimento: '+15%'
  },
  {
    titulo: 'Prêmios Pagos',
    valor: 'R$ 25.8M',
    descricao: 'Distribuídos aos ganhadores',
    icone: Award,
    cor: 'from-yellow-500 to-orange-500',
    crescimento: '+23%'
  },
  {
    titulo: 'Apostadores',
    valor: '150.3K',
    descricao: 'Usuários cadastrados',
    icone: Users,
    cor: 'from-blue-500 to-blue-600',
    crescimento: '+8%'
  },
  {
    titulo: 'Taxa de Sucesso',
    valor: '94.7%',
    descricao: 'Bolões com premiação',
    icone: TrendingUp,
    cor: 'from-purple-500 to-purple-600',
    crescimento: '+2%'
  }
]

export default function Estatisticas() {
  const [email, setEmail] = useState('')
  const [inscrito, setInscrito] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setInscrito(true)
      setEmail('')
      setTimeout(() => setInscrito(false), 3000)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Resultados que Impressionam
          </h2>
          <p className="text-gray-300 text-lg">
            Confira os números que comprovam nossa excelência
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {estatisticas.map((stat, index) => (
            <motion.div
              key={stat.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.cor} rounded-full flex items-center justify-center`}>
                <stat.icone className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.valor}</div>
              <div className="text-gray-300 text-sm mb-3">{stat.descricao}</div>
              <div className="inline-flex items-center text-green-400 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.crescimento} este mês
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">📧</div>
            <h3 className="text-3xl font-bold mb-4">
              Receba Dicas Exclusivas
            </h3>
            <p className="text-blue-100 text-lg mb-8">
              Cadastre-se na nossa newsletter e receba dicas de apostas, resultados em primeira mão 
              e ofertas especiais diretamente no seu e-mail.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                disabled={inscrito}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {inscrito ? (
                  <>✓ Inscrito!</>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Inscrever-se
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-blue-100">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Sem spam
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Cancele quando quiser
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Dicas semanais
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testemunhos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            O que nossos usuários dizem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                nome: "Maria Santos",
                cidade: "São Paulo - SP",
                depoimento: "Ganhei R$ 50.000 no bolão da Lotofácil! Plataforma confiável e pagamento rápido.",
                rating: 5
              },
              {
                nome: "João Silva",
                cidade: "Rio de Janeiro - RJ", 
                depoimento: "Participei de vários bolões e sempre fui bem atendido. Recomendo!",
                rating: 5
              },
              {
                nome: "Ana Costa",
                cidade: "Belo Horizonte - MG",
                depoimento: "Interface muito fácil de usar. Já apostei várias vezes e nunca tive problemas.",
                rating: 5
              }
            ].map((depoimento, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex mb-4">
                  {[...Array(depoimento.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{depoimento.depoimento}"</p>
                <div className="font-semibold">{depoimento.nome}</div>
                <div className="text-sm text-gray-400">{depoimento.cidade}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}