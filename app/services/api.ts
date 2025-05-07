import axios from "axios";
import {
  Document,
  HistoryEntry,
  LoginCredentials,
  ApiResponse,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (credentials: LoginCredentials) => {
  const response = await api.post<
    ApiResponse<{ access_token: string; user: any }>
  >("/auth/login", credentials);
  return response.data.data;
};

// Documents
export const createDocument = async (documentData: Partial<Document>) => {
  const response = await api.post<ApiResponse<Document>>(
    "/documents",
    documentData
  );
  return response.data.data;
};

export const getDocuments = async () => {
  const response = await api.get<ApiResponse<Document[]>>("/documents");
  return response.data.data;
};

export const getDocument = async (id: string) => {
  const response = await api.get<ApiResponse<Document>>(`/documents/${id}`);
  return response.data.data;
};

export const approveDocument = async (id: string) => {
  const response = await api.post<ApiResponse<Document>>(
    `/documents/${id}/approve`
  );
  return response.data.data;
};

export const rejectDocument = async (id: string) => {
  const response = await api.post<ApiResponse<Document>>(
    `/documents/${id}/reject`
  );
  return response.data.data;
};

// History
export const getDocumentHistory = async (documentId: string) => {
  const response = await api.get<ApiResponse<HistoryEntry[]>>(
    `/history/document/${documentId}`
  );
  return response.data.data;
};

export const getUserHistory = async () => {
  const response = await api.get<ApiResponse<HistoryEntry[]>>("/history/user");
  return response.data.data;
};

export default api;
