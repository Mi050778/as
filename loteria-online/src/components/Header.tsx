'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            🎱 Loteria Online
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button className="hover:text-blue-200">Loterias</button>
              <div className="absolute top-full left-0 bg-white text-gray-800 rounded-md shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/mega-sena" className="block px-4 py-2 hover:bg-gray-100">Mega-Sena</Link>
                <Link href="/lotofacil" className="block px-4 py-2 hover:bg-gray-100">Lotofácil</Link>
                <Link href="/quina" className="block px-4 py-2 hover:bg-gray-100">Quina</Link>
                <Link href="/lotomania" className="block px-4 py-2 hover:bg-gray-100">Lotomania</Link>
                <Link href="/dupla-sena" className="block px-4 py-2 hover:bg-gray-100">Dupla Sena</Link>
                <Link href="/timemania" className="block px-4 py-2 hover:bg-gray-100">Timemania</Link>
              </div>
            </div>
            <Link href="/boloes" className="hover:text-blue-200">Bolões</Link>
            <Link href="/resultados" className="hover:text-blue-200">Resultados</Link>
            <Link href="/como-funciona" className="hover:text-blue-200">Como Funciona</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
            <Link href="/login" className="flex items-center space-x-1 hover:text-blue-200">
              <User className="h-5 w-5" />
              <span>Entrar</span>
            </Link>
            <Link href="/cadastro" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors">
              Cadastrar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-2">
              <Link href="/loterias" className="py-2 hover:text-blue-200">Loterias</Link>
              <Link href="/boloes" className="py-2 hover:text-blue-200">Bolões</Link>
              <Link href="/resultados" className="py-2 hover:text-blue-200">Resultados</Link>
              <Link href="/como-funciona" className="py-2 hover:text-blue-200">Como Funciona</Link>
              <hr className="border-blue-500" />
              <Link href="/login" className="py-2 hover:text-blue-200">Entrar</Link>
              <Link href="/cadastro" className="py-2 text-green-400">Cadastrar</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}