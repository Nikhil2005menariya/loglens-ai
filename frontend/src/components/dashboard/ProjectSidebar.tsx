import React, { useState } from 'react';
import { Plus, GitBranch, Clock, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Project } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onAddProject: () => void;
  onDeleteProject: (projectId: string) => void;
  isLoading?: boolean;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  isLoading = false,
}) => {
  const { logout, user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const parseRepoInfo = (project: Project) => {
    if (project.repoUrl) {
      const match = project.repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    }
    return { owner: project.owner || 'unknown', repo: project.repoName || project.name };
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <aside className="h-full bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Logo />
        </div>

        {/* Add Project Button */}
        <div className="p-4">
          <Button
            onClick={onAddProject}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-sidebar-accent/50 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>No projects yet</p>
              <p className="mt-1 text-xs">Click "New Project" to get started</p>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {projects.map((project) => {
                const { owner, repo } = parseRepoInfo(project);
                const isActive = project.id === activeProjectId;

                return (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-sidebar-accent border border-sidebar-primary/30'
                        : 'hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <GitBranch className={`h-4 w-4 mt-0.5 ${isActive ? 'text-sidebar-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`}>
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {owner}/{repo}
                        </p>
                        {project.updatedAt && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDeleteClick(e, project)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="shrink-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{projectToDelete?.name}</span>? 
              This action cannot be undone and will remove all associated analysis history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectSidebar;
