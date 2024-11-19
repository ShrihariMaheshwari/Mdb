// src/hooks/useCollection.ts
import { useState, useEffect } from 'react';
import { collectionsApi } from '../services/api';
import { Document, QueryFilter } from '../types';

export function useCollection(collectionName: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await collectionsApi.getDocuments(collectionName);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionName) {
      fetchDocuments();
    }
  }, [collectionName]);

  const queryDocuments = async (filter: QueryFilter) => {
    try {
      setLoading(true);
      const response = await collectionsApi.query(collectionName, filter);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Query failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    refresh: fetchDocuments,
    queryDocuments,
    createDocument: async (data: any) => {
      await collectionsApi.createDocument(collectionName, data);
      await fetchDocuments();
    },
    updateDocument: async (id: string, data: any) => {
      await collectionsApi.updateDocument(collectionName, id, data);
      await fetchDocuments();
    },
    deleteDocument: async (id: string) => {
      await collectionsApi.deleteDocument(collectionName, id);
      await fetchDocuments();
    }
  };
}