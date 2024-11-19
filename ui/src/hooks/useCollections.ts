// src/hooks/useCollections.ts
import { useState, useEffect } from 'react';
import { Collection } from '../types';
import { getCollectionsWithCounts } from '../services/api';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await getCollectionsWithCounts();
      setCollections(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return {
    collections,
    loading,
    error,
    refresh: fetchCollections
  };
}