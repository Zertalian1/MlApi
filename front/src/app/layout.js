import './globals.css'
import Navbar from '@/components/navbar/Navbar'

export const metadata = {
  title: 'Next App',
  description: 'Next.js starter app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{overflowX: 'hidden'}}>     
        <Navbar/>    
        {children}
      </body>
    </html>
  )
}