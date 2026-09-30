interface LoginScreenProps {
  title?: string
  subtitle?: string
  logo?: React.ComponentType<{ className?: string }>
  brand?: React.ReactNode
  children: React.ReactNode
}

export function LoginScreen({ title = 'App', subtitle, logo, brand, children }: LoginScreenProps) {
  const Logo = logo

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {brand ?? (
            <>
              {Logo && <Logo className="h-20 w-20 mb-3" />}
              <span className="text-3xl font-bold text-foreground">{title}</span>
              {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
