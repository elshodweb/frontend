"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  getDocument,
  approveDocument,
  rejectDocument,
  getDocumentHistory,
} from "../../services/api";
import { Document, HistoryEntry } from "../../types";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function DocumentDetailPage({ params }: { params: any }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocumentAndHistory();
  }, [resolvedParams.id]);

  const fetchDocumentAndHistory = async () => {
    try {
      const [docData, historyData] = await Promise.all([
        getDocument(resolvedParams.id),
        getDocumentHistory(resolvedParams.id),
      ]);
      setDocument(docData);
      setHistory(historyData);
    } catch (err) {
      setError("Failed to fetch document details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approveDocument(resolvedParams.id);
      fetchDocumentAndHistory();
    } catch (err) {
      setError("Failed to approve document");
    }
  };

  const handleReject = async () => {
    try {
      await rejectDocument(resolvedParams.id);
      fetchDocumentAndHistory();
    } catch (err) {
      setError("Failed to reject document");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!document) {
    return <div className="p-4 text-red-600">Document not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Documents
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
            <p className="text-gray-600">
              Status:{" "}
              <span
                className={`font-medium ${getStatusColor(document.status)}`}
              >
                {document.status}
              </span>
            </p>
          </div>
          {user?.role === "ADMIN" && document.status === "PENDING" && (
            <div className="space-x-2 flex">
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                Approve
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
              >
                <XMarkIcon className="h-5 w-5" />
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-2">Content</h2>
          <p className="whitespace-pre-wrap">{document.content}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Document History</h2>
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="border-l-4 border-indigo-500 pl-4 py-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{entry.action}</p>
                    <p className="text-sm text-gray-600">
                      By User ID: {entry.userId}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Blockchain Hash: {entry.blockchainHash}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "text-green-600";
    case "REJECTED":
      return "text-red-600";
    default:
      return "text-yellow-600";
  }
}
