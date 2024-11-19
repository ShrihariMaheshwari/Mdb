import { useState, useEffect } from 'react';
import { Collection } from '../types';
import { collectionsApi } from '../services/api';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionsApi.list();
      setCollections(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
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