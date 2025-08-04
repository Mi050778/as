'use client'

import { motion } from 'framer-motion'
import { UserPlus, CreditCard, Trophy, Shield } from 'lucide-react'

const passos = [
  {
    numero: 1,
    titulo: 'Cadastre-se',
    descricao: 'Crie sua conta em menos de 2 minutos. É rápido, fácil e totalmente seguro.',
    icone: UserPlus,
    cor: 'from-blue-500 to-blue-600'
  },
  {
    numero: 2,
    titulo: 'Escolha sua Aposta',
    descricao: 'Selecione a loteria, números da sorte ou participe de um bolão estratégico.',
    icone: Trophy,
    cor: 'from-green-500 to-green-600'
  },
  {
    numero: 3,
    titulo: 'Pague com Segurança',
    descricao: 'Utilize PIX, cartão de crédito ou débito. Seus dados estão 100% protegidos.',
    icone: CreditCard,
    cor: 'from-purple-500 to-purple-600'
  },
  {
    numero: 4,
    titulo: 'Torça e Ganhe',
    descricao: 'Receba automaticamente seus prêmios em até 5 dias úteis na sua conta.',
    icone: Shield,
    cor: 'from-yellow-500 to-orange-500'
  }
]

const vantagens = [
  '✅ Apostas 100% online e seguras',
  '✅ Pagamento automático de prêmios',
  '✅ Bolões com estratégias exclusivas',
  '✅ Resultados em tempo real',
  '✅ Suporte especializado',
  '✅ Interface moderna e intuitiva'
]

export default function ComoFunciona() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Como Funciona
          </h2>
          <p className="text-gray-600 text-lg">
            Em 4 passos simples você já está participando das melhores loterias do Brasil
          </p>
        </motion.div>

        {/* Passos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {passos.map((passo, index) => (
            <motion.div
              key={passo.numero}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${passo.cor} rounded-full flex items-center justify-center shadow-lg`}>
                  <passo.icone className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {passo.numero}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{passo.titulo}</h3>
              <p className="text-gray-600">{passo.descricao}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Vantagens */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Por que escolher a Loteria Online?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vantagens.map((vantagem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center text-gray-700"
                >
                  <span className="text-green-500 mr-2">{vantagem.split(' ')[0]}</span>
                  <span>{vantagem.split(' ').slice(1).join(' ')}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Nossos Números
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">150K+</div>
                <div className="text-gray-600 text-sm">Apostadores ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">R$ 25M</div>
                <div className="text-gray-600 text-sm">Em prêmios pagos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm">Bolões criados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-600 text-sm">Confiabilidade</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}