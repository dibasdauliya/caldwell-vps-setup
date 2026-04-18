"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  showBackButton?: boolean
  onBack?: () => void
}

export function AppHeader({ showBackButton = false, onBack }: AppHeaderProps) {
  const { logout } = useAuth()

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div>
        {showBackButton && (
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Projects
          </button>
        )}
      </div>
      <Button
        onClick={logout}
        variant="outline"
        size="sm"
        className="text-sm"
      >
        Logout
      </Button>
    </div>
  )
}
