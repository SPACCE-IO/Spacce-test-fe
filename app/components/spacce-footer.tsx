import React from 'react'
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="p-6 bg-gradient-to-b from-transparent to-purple-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm  text-white text-opacity-40">
          <div>© 2024 Spacece. All rights reserved.</div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-purple-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-purple-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-purple-500 transition-colors">
              Cookies Settings
            </Link>
          </div>
        </div>
      </footer>
  )
}

export default Footer