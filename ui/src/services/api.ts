// src/services/api.ts
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
   // Transform string array into Collection objects
   return {
     data: response.data
       .filter(name => name !== "undefined")
       .map(name => ({
         name,
         count: 0 // You can update this when backend provides document count
       }))
   };
 },

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

 getCollectionStats: async (name: string) => {
   const docs = await api.get<Document[]>(`/api/${name}`);
   return {
     name,
     count: docs.data.length
   };
 }
};

// Helper function to get collection with document counts
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