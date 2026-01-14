import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, AlertCircle } from 'lucide-react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import ProjectSidebar from '@/components/dashboard/ProjectSidebar';
import AddProjectModal from '@/components/dashboard/AddProjectModal';
import AnalysisInput from '@/components/dashboard/AnalysisInput';
import AnalysisReport from '@/components/dashboard/AnalysisReport';
import HistorySidebar from '@/components/dashboard/HistorySidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  projectsApi,
  logsApi,
  analysisApi,
  Project,
  AnalysisResult,
} from '@/lib/api';

const Dashboard: React.FC = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [reports, setReports] = useState<AnalysisResult[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [authLoading, isLoggedIn, navigate]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    const result = await projectsApi.list();
    if (result.data) {
      setProjects(result.data);
      if (result.data.length > 0 && !activeProjectId) {
        setActiveProjectId(result.data[0].id);
      }
    } else if (result.error) {
      toast({
        title: 'Error loading projects',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsLoadingProjects(false);
  }, [activeProjectId, toast]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    }
  }, [isLoggedIn, fetchProjects]);

  // Fetch reports for active project
  const fetchReports = useCallback(async () => {
    if (!activeProjectId) return;

    setIsLoadingReports(true);
    const result = await analysisApi.getHistory(activeProjectId);
    if (result.data) {
      setReports(result.data);
      if (result.data.length > 0) {
        setActiveReportId(result.data[0].id);
      } else {
        setActiveReportId(null);
      }
    }
    setIsLoadingReports(false);
  }, [activeProjectId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle adding project
  const handleAddProject = async (name: string, repoUrl: string) => {
    const result = await projectsApi.create(name, repoUrl);
    if (result.data) {
      toast({
        title: 'Project created!',
        description: 'Your project has been set up successfully.',
      });
      await fetchProjects();
      setActiveProjectId(result.data.id);
    } else if (result.error) {
      toast({
        title: 'Error creating project',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  // Handle deleting project
  const handleDeleteProject = async (projectId: string) => {
    const result = await projectsApi.delete(projectId);
    if (result.data?.success) {
      toast({
        title: 'Project deleted',
        description: 'The project has been removed.',
      });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProjectId === projectId) {
        const remaining = projects.filter((p) => p.id !== projectId);
        setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
        setReports([]);
        setActiveReportId(null);
      }
    } else if (result.error) {
      toast({
        title: 'Error deleting project',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleAnalyze = async (rawLogs: string) => {
    if (!activeProjectId) {
      toast({
        title: 'No project selected',
        description: 'Please select or create a project first.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // 1️⃣ Submit logs
      const logResult = await logsApi.submit(activeProjectId, rawLogs);
      console.log('🧪 logResult from /api/logs:', logResult);

      const logEventId = logResult.data?.id;
      if (!logEventId) {
        throw new Error('Failed to create log event');
      }

      // 2️⃣ Run analysis
      const analysisResult = await analysisApi.run(logEventId);
      if (analysisResult.error || !analysisResult.data) {
        throw new Error(analysisResult.error || 'Analysis failed');
      }

      // 3️⃣ Update UI
      setReports((prev) => [analysisResult.data, ...prev]);
      setActiveReportId(analysisResult.data.id);

      toast({
        title: 'Analysis complete',
        description: 'Your debugging report is ready.',
      });
    } catch (err: any) {
      toast({
        title: 'Analysis error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeReport = reports.find((r) => r.id === activeReportId);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Project Sidebar */}
        <ResizablePanel defaultSize={18} minSize={12} maxSize={30}>
          <ProjectSidebar
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onAddProject={() => setIsAddModalOpen(true)}
            onDeleteProject={handleDeleteProject}
            isLoading={isLoadingProjects}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content */}
        <ResizablePanel defaultSize={activeProjectId ? 57 : 82} minSize={30}>
          <div className="h-full flex flex-col min-w-0">
            {activeProjectId ? (
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                  {/* Input */}
                  <AnalysisInput
                    onSubmit={handleAnalyze}
                    isLoading={isAnalyzing}
                    disabled={!activeProjectId}
                  />

                  {/* Active Report */}
                  {activeReport && <AnalysisReport report={activeReport} />}

                  {/* Empty State */}
                  {!activeReport && !isLoadingReports && (
                    <div className="glass rounded-xl p-12 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No analysis yet</h3>
                      <p className="text-muted-foreground">
                        Paste an error, stack trace, or log above to get started.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No project selected</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a project from the sidebar or create a new one.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        {/* History Sidebar */}
        {activeProjectId && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
              <HistorySidebar
                reports={reports}
                activeReportId={activeReportId}
                onSelectReport={setActiveReportId}
                isLoading={isLoadingReports}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProject}
      />
    </div>
  );
};

export default Dashboard;
