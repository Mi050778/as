import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">🎱 Loteria Online</h3>
            <p className="text-gray-300 mb-4">
              Sua plataforma confiável para apostar nas principais loterias brasileiras.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
              <Instagram className="h-5 w-5 hover:text-pink-400 cursor-pointer" />
              <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Loterias */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Loterias</h4>
            <div className="space-y-2">
              <Link href="/mega-sena" className="block text-gray-300 hover:text-white">Mega-Sena</Link>
              <Link href="/lotofacil" className="block text-gray-300 hover:text-white">Lotofácil</Link>
              <Link href="/quina" className="block text-gray-300 hover:text-white">Quina</Link>
              <Link href="/lotomania" className="block text-gray-300 hover:text-white">Lotomania</Link>
              <Link href="/dupla-sena" className="block text-gray-300 hover:text-white">Dupla Sena</Link>
              <Link href="/timemania" className="block text-gray-300 hover:text-white">Timemania</Link>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <div className="space-y-2">
              <Link href="/boloes" className="block text-gray-300 hover:text-white">Bolões</Link>
              <Link href="/resultados" className="block text-gray-300 hover:text-white">Resultados</Link>
              <Link href="/estatisticas" className="block text-gray-300 hover:text-white">Estatísticas</Link>
              <Link href="/conferir-jogo" className="block text-gray-300 hover:text-white">Conferir Jogo</Link>
              <Link href="/como-funciona" className="block text-gray-300 hover:text-white">Como Funciona</Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-gray-300">contato@loteriaonline.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </div>
              <Link href="/suporte" className="block text-gray-300 hover:text-white">Central de Ajuda</Link>
              <Link href="/termos" className="block text-gray-300 hover:text-white">Termos de Uso</Link>
              <Link href="/privacidade" className="block text-gray-300 hover:text-white">Política de Privacidade</Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm mb-4 md:mb-0">
            © 2024 Loteria Online. Todos os direitos reservados.
          </div>
          <div className="text-gray-300 text-sm text-center">
            <p className="mb-2">🔞 Proibido para menores de 18 anos</p>
            <p className="text-xs">
              Jogue com responsabilidade. Apostas podem causar dependência.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>
            A Loteria Online não possui qualquer vínculo com a Caixa Econômica Federal e é uma empresa independente 
            que realiza intermediação. Todos os produtos lotéricos ofertados na plataforma são processados pelos 
            agentes oficiais da Caixa Econômica Federal.
          </p>
        </div>
      </div>
    </footer>
  )
}