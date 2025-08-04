import Hero from '@/components/Hero'
import ProximasPremiacoes from '@/components/ProximasPremiacoes'
import UltimosResultados from '@/components/UltimosResultados'
import BoloesDestaque from '@/components/BoloesDestaque'
import ComoFunciona from '@/components/ComoFunciona'
import Estatisticas from '@/components/Estatisticas'

export default function Home() {
  return (
    <>
      <Hero />
      <ProximasPremiacoes />
      <UltimosResultados />
      <BoloesDestaque />
      <ComoFunciona />
      <Estatisticas />
    </>
  )
}
