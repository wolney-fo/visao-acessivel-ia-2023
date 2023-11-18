import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head />
      <Header />
      <body className='bg-[#0f1114]'>
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  )
}
