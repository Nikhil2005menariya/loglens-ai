import { getAuthHeaders, setToken, removeToken } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return { error: json?.error?.message || 'An error occurred' };
    }

    return json;
  } catch {
    return { error: 'Network error. Please try again.' };
  }
}

/* ---------------- AUTH ---------------- */

export const authApi = {
  signup: async (username: string, email: string, password: string) => {
    const res = await apiRequest<{ token: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (res.data?.token) setToken(res.data.token);
    return res;
  },

  login: async (email: string, password: string) => {
    const res = await apiRequest<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.data?.token) setToken(res.data.token);
    return res;
  },

  getMe: async () =>
    apiRequest<{ id: string; username: string; email: string }>('/api/auth/me'),

  logout: removeToken,
};

/* ---------------- PROJECTS ---------------- */

export interface Project {
  id: string;
  name: string;
  repoId: string;
  repoUrl?: string;
  owner?: string;
  repoName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const projectsApi = {
  list: async () => {
    const res = await apiRequest<any[]>('/api/projects');

    return {
      ...res,
      data: res.data?.map(p => ({
        id: p._id || p.id,
        name: p.name,
        repoId: p.repoId,
        repoUrl: p.repoUrl,
        owner: p.owner,
        repoName: p.repoName,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    };
  },

  create: async (name: string, repoUrl: string) => {
    const res = await apiRequest<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name, repoUrl }),
    });

    return {
      ...res,
      data: res.data
        ? {
            id: res.data._id || res.data.id,
            name: res.data.name,
            repoId: res.data.repoId,
            repoUrl: res.data.repoUrl,
            owner: res.data.owner,
            repoName: res.data.repoName,
          }
        : undefined,
    };
  },

  delete: async (projectId: string) => {
    return apiRequest<{ success: boolean }>(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};

/* ---------------- LOGS ---------------- */

export interface LogEvent {
  id: string;
  projectId: string;
  rawLogs: string;
  environment: string;
  createdAt: string;
}

export const logsApi = {
  submit: async (projectId: string, rawLogs: string, environment = 'local') => {
    const res = await apiRequest<any>('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ projectId, rawLogs, environment }),
    });

    return {
      ...res,
      data: res.data
        ? {
            id: res.data._id,
            projectId: res.data.projectId,
            rawLogs: res.data.rawLogs,
            environment: res.data.environment,
            createdAt: res.data.createdAt,
          }
        : undefined,
    };
  },
};

/* ---------------- ANALYSIS ---------------- */

export interface MatchedFile {
  path: string;
  snippet: string;
  lineStart?: number;
  lineEnd?: number;
}

export interface ValidationStatus {
  status: 'verified' | 'partial' | 'conceptual';
  reason?: string;
}

export interface AiAnalysis {
  rootCause: string;
  fix: string;
  validation: ValidationStatus;
  confidence: number;
  checklist?: string[];
}

export interface ParsedLog {
  errorType?: string;
  message?: string;
  file?: string;
  line?: number;
  severity?: 'error' | 'warning' | 'info';
}

export interface AnalysisResult {
  id: string;
  parsedLog: ParsedLog;
  matchedFiles: MatchedFile[];
  aiAnalysis: AiAnalysis;
  createdAt: string;
}

export const analysisApi = {
  run: async (logEventId: string) => {
    const res = await apiRequest<any>('/api/analysis/run', {
      method: 'POST',
      body: JSON.stringify({ logEventId }),
    });

    if (!res.data) return res;

    return {
      ...res,
      data: {
        id: res.data._id,
        parsedLog: res.data.parsedLog,
        matchedFiles: res.data.matchedFiles.map((f: any) => ({
          path: f.filePath,
          snippet: f.snippet,
        })),
        aiAnalysis: res.data.aiAnalysis,
        createdAt: res.data.createdAt,
      },
    };
  },

  getHistory: async (projectId: string, page = 1, limit = 10) => {
    const res = await apiRequest<any>(
      `/api/analysis/repo/${projectId}?page=${page}&limit=${limit}`
    );

    return {
      ...res,
      data: res.data?.map((item: any) => ({
        id: item._id,
        parsedLog: item.parsedLog,
        matchedFiles: item.matchedFiles.map((f: any) => ({
          path: f.filePath,
          snippet: f.snippet,
        })),
        aiAnalysis: item.aiAnalysis,
        createdAt: item.createdAt,
      })),
    };
  },
};

export const getWebhookUrl = () =>
  `${API_BASE_URL}/api/repos/webhook/github`;
