"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { getDocuments, createDocument } from "../services/api";
import { Document } from "../types";
import {
  DocumentIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function DocumentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDocument, setNewDocument] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDocument(newDocument);
      setShowCreateForm(false);
      setNewDocument({ title: "", content: "" });
      fetchDocuments();
    } catch (err) {
      setError("Failed to create document");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
          <DocumentIcon className="h-5 w-5" />
          Create Document
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showCreateForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Create New Document
            </h2>
            <form onSubmit={handleCreateDocument}>
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Title
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, title: e.target.value })
                    }
                    className="pl-10 pr-4 py-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition-all outline-none"
                    placeholder="Enter document title"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Content
                </label>
                <div className="relative">
                  <span className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
                    <PencilIcon className="h-5 w-5 text-gray-400" />
                  </span>
                  <textarea
                    value={newDocument.content}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        content: e.target.value,
                      })
                    }
                    className="pl-10 pr-4 py-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition-all outline-none resize-none"
                    rows={4}
                    placeholder="Enter document content"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
                >
                  <DocumentIcon className="h-5 w-5" />
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/documents/${doc._id}`)}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              {doc.title}
            </h3>
            
            <p className="text-gray-700 text-sm mb-2">
              Status:{" "}
              <span className={`font-medium ${getStatusColor(doc.status)}`}>
                {doc.status}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              Created: {new Date(doc.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "text-green-700";
    case "rejected":
      return "text-red-700";
    default:
      return "text-yellow-700";
  }
}
