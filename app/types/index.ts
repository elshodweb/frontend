export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "pending" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HistoryEntry {
  _id: string;
  documentId: string;
  userId: string;
  user: User;
  action: "UPLOAD" | "VIEW" | "APPROVE" | "REJECT";
  timestamp: string;
  blockchainTx: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  timestamp: string;
  path: string;
}
