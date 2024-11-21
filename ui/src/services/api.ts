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
  list: async () => {
    const response = await api.get<string[]>("/api/collections");
    return {
      data: response.data
        .filter(name => name !== "undefined")
        .map(name => ({
          name,
          count: 0
        }))
    };
  },

  create: (name: string) => api.post("/api/collections", { name }),

  getDocuments: async (collection: string) => {
    const response = await api.get<Document[]>(`/api/${collection}`);
    return response;
  },

  createDocument: async (
    collection: string,
    data: Omit<Document, "id" | "createdAt" | "updatedAt">
  ) => {
    const response = await api.post(`/api/${collection}`, data);
    return response;
  },

  updateDocument: async (collection: string, id: string, data: Partial<Document>) => {
    const response = await api.put(`/api/${collection}/${id}`, data);
    return response;
  },

  deleteDocument: async (collection: string, id: string) => {
    const response = await api.delete(`/api/${collection}/${id}`);
    return response;
  },

  query: async (collection: string, filter: QueryFilter) => {
    const response = await api.get<Document[]>(
      `/api/${collection}?query=${encodeURIComponent(JSON.stringify(filter))}`
    );
    return response;
  },

  getCollectionStats: async (name: string) => {
    const response = await api.get<Document[]>(`/api/${name}`);
    return {
      name,
      count: response.data.length
    };
  }
};

export async function getCollectionsWithCounts(): Promise<Collection[]> {
  const collections = await collectionsApi.list();
  const collectionsWithCounts = await Promise.all(
    collections.data.map(async collection => {
      const stats = await collectionsApi.getCollectionStats(collection.name);
      return stats;
    })
  );
  return collectionsWithCounts;
}