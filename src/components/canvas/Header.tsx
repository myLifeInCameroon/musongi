import { RotateCcw, LogOut, FileDown, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectSelector, ProjectSummary } from "@/components/projects/ProjectSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import musongiLogo from "@/assets/musongi-logo.svg";

interface HeaderProps {
  onReset: () => void;
  onSignOut?: () => void;
  onExportPDF?: () => void;
  onOpenChat?: () => void;
  userEmail?: string;
  saving?: boolean;
  projects: ProjectSummary[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  projectsLoading?: boolean;
}

export function Header({
  onReset,
  onSignOut,
  onExportPDF,
  onOpenChat,
  userEmail,
  saving,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  projectsLoading,
}: HeaderProps) {
  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={musongiLogo} 
              alt="Musongi" 
              className="h-10 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold">Musongi</span>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Financial Consultation Services
              </p>
            </div>
          </div>

          {/* Project Selector - Center */}
          <div className="flex-1 flex justify-center px-4">
            <ProjectSelector
              projects={projects}
              currentProjectId={currentProjectId}
              onSelectProject={onSelectProject}
              onCreateProject={onCreateProject}
              onDeleteProject={onDeleteProject}
              isLoading={projectsLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Saving indicator */}
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* AI Chat button */}
            {onOpenChat && (
              <Button variant="outline" size="sm" onClick={onOpenChat} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">AI Advisor</span>
              </Button>
            )}

            {/* Export PDF button */}
            {onExportPDF && (
              <Button variant="outline" size="sm" onClick={onExportPDF}>
                <FileDown className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}

            {/* Reset button */}
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 sm:mr-2" />
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
                    <span className="hidden md:inline text-sm truncate max-w-[100px]">
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
