import { Calculator, RotateCcw, LogOut, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onReset: () => void;
  onSignOut?: () => void;
  userEmail?: string;
  saving?: boolean;
}

export function Header({ onReset, onSignOut, userEmail, saving }: HeaderProps) {
  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
              <Calculator className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Profitability Canvas</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Business Financial Planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Saving indicator */}
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </div>
            )}

            {/* Reset button */}
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>

            {/* User menu */}
            {userEmail && onSignOut && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm truncate max-w-[150px]">
                      {userEmail}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
