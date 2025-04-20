import './globals.css'
import PasswordGate from './components/PasswordGate'
import BarraPerfil from './components/BarraPerfil'

export const metadata = {
  title: 'Jogo de Cartas Daga',
  description: 'PvP estratégico ambientado no mundo de Daga.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <PasswordGate>
        <BarraPerfil />
          {children}
          </PasswordGate>
      </body>
    </html>
  )
}
