import { RotateCcw, LogOut, FileDown, Loader2, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
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
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import musongiLogo from "@/assets/musongi-logo.svg";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo - Smaller on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img 
              src={musongiLogo} 
              alt="Musongi" 
              className="h-8 sm:h-10 w-auto"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-sm sm:text-base">Musongi</span>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Financial Consultation Services
              </p>
            </div>
          </div>

          {/* Mobile: centered brand between logo and hamburger */}
          <div className="flex-1 flex flex-col items-center md:hidden">
            <span className="font-bold text-sm">Musongi</span>
            <p className="text-xs text-muted-foreground">Financial Consultation Services</p>
          </div>

          {/* Desktop: Project Selector in center */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <ProjectSelector
              projects={projects}
              currentProjectId={currentProjectId}
              onSelectProject={onSelectProject}
              onCreateProject={onCreateProject}
              onDeleteProject={onDeleteProject}
              isLoading={projectsLoading}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden lg:inline">Saving...</span>
              </div>
            )}

            <LanguageSelector />
            <ThemeToggle />

            {onOpenChat && (
              <Button variant="outline" size="sm" onClick={onOpenChat} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden lg:inline">AI Advisor</span>
              </Button>
            )}

            {onExportPDF && (
              <Button variant="outline" size="sm" onClick={onExportPDF}>
                <FileDown className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">{t("common.export")}</span>
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">{t("common.reset")}</span>
            </Button>

            {userEmail && onSignOut && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline text-sm truncate max-w-[100px]">
                      {userEmail}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("common.signout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile: Hamburger Menu */}
          <div className="flex md:hidden items-center gap-2">
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] px-4">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[200px]">{userEmail}</span>
                      <span className="text-xs text-muted-foreground">Signed in</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                  {/* Project Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Project</label>
                    <ProjectSelector
                      projects={projects}
                      currentProjectId={currentProjectId}
                      onSelectProject={(id) => {
                        onSelectProject(id);
                        setMobileMenuOpen(false);
                      }}
                      onCreateProject={onCreateProject}
                      onDeleteProject={onDeleteProject}
                      isLoading={projectsLoading}
                    />
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <label className="text-sm font-medium">Settings</label>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Language</span>
                      <LanguageSelector />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <label className="text-sm font-medium">Actions</label>
                    
                    {onOpenChat && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2" 
                        onClick={() => {
                          onOpenChat();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        AI Advisor
                      </Button>
                    )}

                    {onExportPDF && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          onExportPDF();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FileDown className="h-4 w-4" />
                        {t("common.export")}
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        onReset();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("common.reset")}
                    </Button>

                    {onSignOut && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                          onSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        {t("common.signout")}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
// import { RotateCcw, LogOut, FileDown, Loader2, MessageSquare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { ProjectSelector, ProjectSummary } from "@/components/projects/ProjectSelector";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { LanguageSelector } from "@/components/LanguageSelector";
// import { useLanguage } from "@/contexts/LanguageContext";
// import musongiLogo from "@/assets/musongi-logo.svg";

// interface HeaderProps {
//   onReset: () => void;
//   onSignOut?: () => void;
//   onExportPDF?: () => void;
//   onOpenChat?: () => void;
//   userEmail?: string;
//   saving?: boolean;
//   projects: ProjectSummary[];
//   currentProjectId: string | null;
//   onSelectProject: (id: string) => void;
//   onCreateProject: (name: string) => Promise<void>;
//   onDeleteProject: (id: string) => Promise<void>;
//   projectsLoading?: boolean;
// }

// export function Header({
//   onReset,
//   onSignOut,
//   onExportPDF,
//   onOpenChat,
//   userEmail,
//   saving,
//   projects,
//   currentProjectId,
//   onSelectProject,
//   onCreateProject,
//   onDeleteProject,
//   projectsLoading,
// }: HeaderProps) {
//   const { t } = useLanguage();
//   const initials = userEmail
//     ? userEmail.slice(0, 2).toUpperCase()
//     : "U";

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <img 
//               src={musongiLogo} 
//               alt="Musongi" 
//               className="h-10 w-auto"
//             />
//             <div className="flex flex-col leading-tight">
//               <span className="font-bold">Musongi</span>
//               <p className="text-xs text-muted-foreground hidden sm:block">
//                 Financial Consultation Services
//               </p>
//             </div>
//           </div>

//           {/* Project Selector - Center */}
//           <div className="flex-1 flex justify-center px-4">
//             <ProjectSelector
//               projects={projects}
//               currentProjectId={currentProjectId}
//               onSelectProject={onSelectProject}
//               onCreateProject={onCreateProject}
//               onDeleteProject={onDeleteProject}
//               isLoading={projectsLoading}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Saving indicator */}
//             {saving && (
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="hidden sm:inline">Saving...</span>
//               </div>
//             )}

//             {/* Language Selector */}
//             <LanguageSelector />

//             {/* Theme Toggle */}
//             <ThemeToggle />

//             {/* AI Chat button */}
//             {onOpenChat && (
//               <Button variant="outline" size="sm" onClick={onOpenChat} className="gap-2">
//                 <MessageSquare className="h-4 w-4" />
//                 <span className="hidden sm:inline">AI Advisor</span>
//               </Button>
//             )}

//             {/* Export PDF button */}
//             {onExportPDF && (
//               <Button variant="outline" size="sm" onClick={onExportPDF}>
//                 <FileDown className="h-4 w-4 sm:mr-2" />
//                 <span className="hidden sm:inline">{t("common.export")}</span>
//               </Button>
//             )}

//             {/* Reset button */}
//             <Button variant="outline" size="sm" onClick={onReset}>
//               <RotateCcw className="h-4 w-4 sm:mr-2" />
//               <span className="hidden sm:inline">{t("common.reset")}</span>
//             </Button>

//             {/* User menu */}
//             {userEmail && onSignOut && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm" className="gap-2">
//                     <Avatar className="h-7 w-7">
//                       <AvatarFallback className="bg-primary/10 text-primary text-xs">
//                         {initials}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="hidden md:inline text-sm truncate max-w-[100px]">
//                       {userEmail}
//                     </span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <div className="px-2 py-1.5">
//                     <p className="text-sm font-medium">{userEmail}</p>
//                     <p className="text-xs text-muted-foreground">Signed in</p>
//                   </div>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
//                     <LogOut className="h-4 w-4 mr-2" />
//                     {t("common.signout")}
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
