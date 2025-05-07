export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "approver";
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdBy: User;
  blockchainTx?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  _id: string;
  document: string;
  action: "create" | "approve" | "reject";
  user: User;
  blockchainTx?: string;
  timestamp: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}
