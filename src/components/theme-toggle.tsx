'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
<<<<<<< HEAD
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="group relative w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        {/* Icons */}
        <div className="relative flex items-center justify-center w-6 h-6">
          <Sun 
            className={`absolute w-5 h-5 text-yellow-500 dark:text-yellow-400 transition-all duration-500 ${
              theme === 'dark' 
                ? 'opacity-0 rotate-90 translate-x-2 translate-y-2' 
                : 'opacity-100 rotate-0 translate-x-0 translate-y-0'
            }`} 
          />
          <Moon 
            className={`absolute w-4 h-4 text-gray-700 dark:text-gray-300 transition-all duration-500 ${
              theme === 'dark' 
                ? 'opacity-100 rotate-0 translate-x-0 translate-y-0' 
                : 'opacity-0 -rotate-90 translate-x-2 translate-y-2'
            }`} 
          />
        </div>
        
        {/* Indicator dot */}
        <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-purple-500 shadow-lg shadow-purple-500/50' 
            : 'bg-blue-500 shadow-lg shadow-blue-500/50'
        }`} />
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 dark:from-blue-600/20 dark:to-purple-800/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <span className="sr-only">
        {theme === 'light' ? 'Koyu moda geç' : 'Açık moda geç'}
      </span>
=======

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="theme-toggle relative overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-lg"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-700 ease-in-out dark:-rotate-180 dark:scale-0 absolute" />
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-180 scale-0 transition-all duration-700 ease-in-out dark:rotate-0 dark:scale-100 absolute" />
      </div>
      <span className="sr-only">Toggle theme</span>
>>>>>>> origin/master
    </Button>
  )
}