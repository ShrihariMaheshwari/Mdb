import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CollectionsPage } from './pages/CollectionsPage';
import { Collection } from './pages/Collection';
import { useCollections } from './hooks/useCollections';

export default function App() {
  const { collections } = useCollections();

  return (
    <Layout collections={collections}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:name" element={<Collection />} />
      </Routes>
    </Layout>
  );
}