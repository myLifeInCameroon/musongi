import { useState } from "react";
import { Plus, FolderOpen, Trash2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ProjectSummary {
  id: string;
  project_name: string;
  updated_at: string;
}

interface ProjectSelectorProps {
  projects: ProjectSummary[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProjectSelector({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  isLoading,
}: ProjectSelectorProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectSummary | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { t } = useLanguage();

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      await onCreateProject(newProjectName.trim());
      setNewProjectName("");
      setShowNewDialog(false);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await onDeleteProject(projectToDelete.id);
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
            <FolderOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {isLoading ? t("common.loading") : currentProject?.project_name || t("project.selectProject")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {project.id === currentProjectId && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
                <div className={cn("flex-1 min-w-0", project.id !== currentProjectId && "ml-6")}>
                  <p className="truncate font-medium">{project.project_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(project.updated_at)}
                  </p>
                </div>
              </div>
              {projects.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectToDelete(project);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowNewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("project.newProject")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Project Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("project.createTitle")}</DialogTitle>
            <DialogDescription>
              {t("project.createDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">{t("project.projectName")}</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t("project.projectNamePlaceholder")}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreate} disabled={creating || !newProjectName.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("project.createButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("project.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("project.deleteDescription").replace("{name}", projectToDelete?.project_name || "")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
