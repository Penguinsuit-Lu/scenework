import "./globals.css"
import { Inter, Sora } from "next/font/google"
import { Header } from "../components/Header"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" })

export const metadata = {
  title: "SceneWork",
  description: "Connecting Creativity",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-black text-white">
        <Header />
        {children}
      </body>
    </html>
  )
}
