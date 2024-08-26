import "./globals.css"
import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "./(cpnotrouted)/theme-provider"
import { cn } from "@/lib/utils"

import AuthProvider from './Providers'
import { getServerSession } from 'next-auth';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async  function RootLayout({ children }: RootLayoutProps) {
  const session = await  getServerSession()
  return (
    
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ajoutez ici les éléments nécessaires dans le head */}
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        {/* <AuthProvider session={session}> */}
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
