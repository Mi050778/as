'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, RefreshCw, Zap, Calculator } from 'lucide-react'

interface LoteriaData {
  nome: string
  regras: {
    numerosMinimos: number
    numerosMaximos: number
    numerosTotais: number
    valorMinimo: number
  }
  corSecundaria: string
}

interface LoteriaFormProps {
  loteria: LoteriaData
}

export default function LoteriaForm({ loteria }: LoteriaFormProps) {
  const [numerosSelecionados, setNumerosSelecionados] = useState<number[]>([])
  const [quantidadeJogos, setQuantidadeJogos] = useState(1)
  const [tipoAposta, setTipoAposta] = useState<'individual' | 'surpresinha'>('individual')

  // Calcular valor da aposta
  const calcularValor = () => {
    const numerosEscolhidos = numerosSelecionados.length || loteria.regras.numerosMinimos
    
    // Fórmula simplificada para calcular combinações (pode ser ajustada para cada loteria)
    let multiplicador = 1
    if (numerosEscolhidos > loteria.regras.numerosMinimos) {
      multiplicador = Math.pow(numerosEscolhidos - loteria.regras.numerosMinimos + 1, 1.5)
    }
    
    return loteria.regras.valorMinimo * multiplicador * quantidadeJogos
  }

  const toggleNumero = (numero: number) => {
    if (numerosSelecionados.includes(numero)) {
      setNumerosSelecionados(numerosSelecionados.filter(n => n !== numero))
    } else if (numerosSelecionados.length < loteria.regras.numerosMaximos) {
      setNumerosSelecionados([...numerosSelecionados, numero].sort((a, b) => a - b))
    }
  }

  const gerarSurpresinha = () => {
    const numeros: number[] = []
    while (numeros.length < loteria.regras.numerosMinimos) {
      const numero = Math.floor(Math.random() * loteria.regras.numerosTotais) + 1
      if (!numeros.includes(numero)) {
        numeros.push(numero)
      }
    }
    setNumerosSelecionados(numeros.sort((a, b) => a - b))
  }

  const limparSelecao = () => {
    setNumerosSelecionados([])
  }

  const adicionarAoCarrinho = () => {
    // Lógica para adicionar ao carrinho
    console.log('Adicionado ao carrinho:', {
      loteria: loteria.nome,
      numeros: numerosSelecionados,
      quantidade: quantidadeJogos,
      valor: calcularValor()
    })
    alert('Aposta adicionada ao carrinho!')
  }

  const podeApostar = () => {
    if (tipoAposta === 'surpresinha') return true
    return numerosSelecionados.length >= loteria.regras.numerosMinimos
  }

  return (
    <div className="space-y-8">
      {/* Tipo de Aposta */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Aposta</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setTipoAposta('individual')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              tipoAposta === 'individual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Escolher Números
          </button>
          <button
            onClick={() => setTipoAposta('surpresinha')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
              tipoAposta === 'surpresinha'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Surpresinha
          </button>
        </div>
      </div>

      {tipoAposta === 'individual' && (
        <>
          {/* Seleção de Números */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Escolha seus números ({numerosSelecionados.length}/{loteria.regras.numerosMaximos})
              </h3>
              <div className="space-x-2">
                <button
                  onClick={gerarSurpresinha}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Surpresinha
                </button>
                <button
                  onClick={limparSelecao}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: loteria.regras.numerosTotais }, (_, i) => i + 1).map((numero) => (
                <motion.button
                  key={numero}
                  onClick={() => toggleNumero(numero)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full font-bold text-sm transition-all duration-200 ${
                    numerosSelecionados.includes(numero)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={
                    !numerosSelecionados.includes(numero) && 
                    numerosSelecionados.length >= loteria.regras.numerosMaximos
                  }
                >
                  {numero.toString().padStart(2, '0')}
                </motion.button>
              ))}
            </div>

            {numerosSelecionados.length > 0 && numerosSelecionados.length < loteria.regras.numerosMinimos && (
              <p className="text-red-600 text-sm mt-2">
                Selecione pelo menos {loteria.regras.numerosMinimos} números para apostar
              </p>
            )}
          </div>

          {/* Números Selecionados */}
          {numerosSelecionados.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-2">Números selecionados:</h4>
              <div className="flex flex-wrap gap-2">
                {numerosSelecionados.map((numero) => (
                  <span
                    key={numero}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold"
                  >
                    {numero.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tipoAposta === 'surpresinha' && (
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <Zap className="h-12 w-12 mx-auto text-purple-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Surpresinha</h3>
          <p className="text-gray-600">
            O sistema escolherá {loteria.regras.numerosMinimos} números aleatórios para você!
          </p>
        </div>
      )}

      {/* Quantidade de Jogos */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quantidade de Jogos</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantidadeJogos(Math.max(1, quantidadeJogos - 1))}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold text-gray-800 w-16 text-center">
            {quantidadeJogos}
          </span>
          <button
            onClick={() => setQuantidadeJogos(quantidadeJogos + 1)}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Resumo da Aposta */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Resumo da Aposta
          </h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Loteria:</span>
            <span className="font-bold">{loteria.nome}</span>
          </div>
          <div className="flex justify-between">
            <span>Números:</span>
            <span>
              {tipoAposta === 'surpresinha' 
                ? `${loteria.regras.numerosMinimos} (Surpresinha)`
                : `${numerosSelecionados.length || loteria.regras.numerosMinimos}`
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>Quantidade de jogos:</span>
            <span>{quantidadeJogos}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-lg font-bold text-green-600">
            <span>Total:</span>
            <span>R$ {calcularValor().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Botão de Adicionar ao Carrinho */}
      <motion.button
        onClick={adicionarAoCarrinho}
        disabled={!podeApostar()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center ${
          podeApostar()
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Adicionar ao Carrinho
      </motion.button>

      {!podeApostar() && (
        <p className="text-red-600 text-sm text-center">
          Selecione pelo menos {loteria.regras.numerosMinimos} números para apostar
        </p>
      )}
    </div>
  )
}