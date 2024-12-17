'use client'

import { usePathname } from 'next/navigation'
import { TopMenu } from './top-menu'

export function ConditionalTopMenu() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return null
  }

  return <TopMenu />
}
