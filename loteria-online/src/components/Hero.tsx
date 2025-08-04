'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlayCircle, Star, Shield, CreditCard } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Aposte nas <span className="text-yellow-400">Melhores Loterias</span> do Brasil
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Mega-Sena, Lotofácil, Quina e muito mais. Participe de bolões, 
              confira resultados e concorra a prêmios milionários com total segurança.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/mega-sena"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Apostar Agora
              </Link>
              <Link 
                href="/boloes"
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Ver Bolões
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-yellow-400 mb-2" />
                <span className="text-sm">100% Seguro</span>
              </div>
              <div className="flex flex-col items-center">
                <CreditCard className="h-8 w-8 text-yellow-400 mb-2" />
                <span className="text-sm">Pagamento Fácil</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 text-yellow-400 mb-2" />
                <span className="text-sm">Premiação Rápida</span>
              </div>
            </div>
          </motion.div>

          {/* Imagem/Animação */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎰</div>
              <h3 className="text-2xl font-bold mb-4">Prêmio Acumulado</h3>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                R$ 45.000.000
              </div>
              <p className="text-blue-200">Mega-Sena • Sábado</p>
              
              <div className="mt-6 grid grid-cols-6 gap-2">
                {[8, 15, 23, 31, 42, 55].map((numero, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm"
                  >
                    {numero}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-blue-200 mt-2">Números mais sorteados</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}