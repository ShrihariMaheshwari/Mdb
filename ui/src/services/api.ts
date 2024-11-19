import axios from "axios";
import { Collection, Document, QueryFilter } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const collectionsApi = {
  list: () => api.get<Collection[]>("/api/collections"),
  create: (name: string) => api.post("/api/collections", { name }),
  getDocuments: (collection: string) =>
    api.get<Document[]>(`/api/${collection}`),
  createDocument: (
    collection: string,
    data: Omit<Document, "id" | "createdAt" | "updatedAt">
  ) => api.post(`/api/${collection}`, data),
  updateDocument: (collection: string, id: string, data: Partial<Document>) =>
    api.put(`/api/${collection}/${id}`, data),
  deleteDocument: (collection: string, id: string) =>
    api.delete(`/api/${collection}/${id}`),
  query: (collection: string, filter: QueryFilter) =>
    api.get<Document[]>(
      `/api/${collection}?query=${encodeURIComponent(JSON.stringify(filter))}`
    ),
};
