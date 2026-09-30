import { Link, type LinkProps } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type BackLinkProps = LinkProps

export function BackLink({ children, ...props }: BackLinkProps) {
  return (
    <Button variant="ghost" size="sm" asChild className="-ml-3.5 gap-2 self-start">
      <Link {...props}><ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />{children}</Link>
    </Button>
  )
}
