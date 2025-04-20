import './globals.css'
import PasswordGate from './components/PasswordGate'

export const metadata = {
  title: 'Jogo de Cartas Daga',
  description: 'PvP estratégico ambientado no mundo de Daga.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  )
}
