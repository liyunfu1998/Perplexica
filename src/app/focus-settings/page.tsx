'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  SwatchBook,
  Pencil,
  BadgePercent,
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { SiReddit, SiYoutube } from '@icons-pack/react-simple-icons';
import FocusModeModal from './FocusModeModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export const getIconByKey = (key: string) => {
  switch (key) {
    case 'webSearch':
      return <Globe size={20} />;
    case 'academicSearch':
      return <SwatchBook size={20} />;
    case 'writingAssistant':
      return <Pencil size={16} />;
    case 'wolframAlphaSearch':
      return <BadgePercent size={20} />;
    case 'youtubeSearch':
      return <SiYoutube className="h-5 w-auto mr-0.5" />;
    case 'redditSearch':
      return <SiReddit className="h-5 w-auto mr-0.5" />;
    default:
      return <Globe size={20} />;
  }
};

export interface FocusMode {
  key: string;
  title: string;
  description: string;
  api_source: string;
  icon: React.ReactNode;
}
const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modes, setModes] = useState<FocusMode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMode, setEditingMode] = useState<FocusMode | null>();
  const [deleteMode, setDeleteMode] = useState<FocusMode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModes = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/focus-modes');
        const data = await response.json();
        setModes(
          data.map((mode: FocusMode) => ({
            ...mode,
            icon: getIconByKey(mode.key),
          })),
        );
      } catch (error) {
        console.error('Error fetching focus modes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModes();
  }, []);

  const handleAddMode = () => {
    setEditingMode(null);
    setIsModalOpen(true);
  };

  const handleEditMode = (mode: FocusMode) => {
    setEditingMode(mode);
    setIsModalOpen(true);
  };

  const handleDeleteMode = async (mode: FocusMode) => {
    setDeleteMode(mode);
  };

  const handleConfirmDelete = async () => {
    if (!deleteMode) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/focus-modes/${deleteMode.key}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setModes(modes.filter((mode) => mode.key !== deleteMode.key));
      } else {
        console.error('Failed to delete focus mode');
      }
    } catch (error) {
      console.error('Error deleting focus mode:', error);
    } finally {
      setLoading(false);
      setDeleteMode(null);
    }
  };

  const handleSaveMode = async (mode: FocusMode) => {
    setLoading(true);
    try {
      if (editingMode) {
        const response = await fetch(`/api/focus-modes/${editingMode.key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mode),
        });
        if (response.ok) {
          const updatedMode = await response.json();
          setModes(
            modes.map((m) =>
              m.key === editingMode.key
                ? { ...updatedMode, icon: getIconByKey(updatedMode.key) }
                : m,
            ),
          );
        }
      } else {
        const response = await fetch('/api/focus-modes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mode),
        });
        if (response.ok) {
          const newMode = await response.json();
          setModes([...modes, { ...newMode, icon: getIconByKey(newMode.key) }]);
        }
      }
      setIsModalOpen(false);
      setEditingMode(null);
    } catch (error) {
      console.error('Error saving focus mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/focus-modes');
      const data = await response.json();
      const filteredData = data.filter((mode: FocusMode) =>
        mode.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setModes(
        filteredData.map((mode: FocusMode) => ({
          ...mode,
          icon: getIconByKey(mode.key),
        })),
      );
    } catch (error) {
      console.error('Error searching focus modes:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/focus-modes');
      const data = await response.json();
      setModes(
        data.map((mode: FocusMode) => ({
          ...mode,
          icon: getIconByKey(mode.key),
        })),
      );
      setSearchTerm('');
    } catch (error) {
      console.error('Error resetting focus modes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Focus Settings</h1>
          <button
            onClick={handleAddMode}
            className="px-4 py-2 rounded-lg border border-light-200 dark:border-dark-200 hover:bg-light-secondary dark:hover:bg-dark-secondary flex items-center space-x-2 transition duration-200"
          >
            <Plus size={16} />
            <span>Add Mode</span>
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Search Focus Modes</h2>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-200 dark:border-dark-200 bg-light-primary dark:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
            <button
              onClick={resetSearch}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-light-200 dark:border-dark-200 hover:bg-light-secondary dark:hover:bg-dark-secondary flex items-center space-x-2 transition duration-200 disabled:opacity-50"
            >
              <X size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modes.map((mode) => (
                <div
                  key={mode.key}
                  className="p-4 rounded-lg border border-light-200 dark:border-dark-200 bg-light-primary dark:bg-dark-primary hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-black dark:text-white">
                        {mode.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{mode.title}</h3>
                        <p className="text-sm text-black/70 dark:text-white/70">
                          {mode.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditMode(mode)}
                        className="p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMode(mode)}
                        className="p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-light-200 dark:border-dark-200">
                    <div className="text-sm">
                      <span className="text-black/50 dark:text-white/50">
                        API Source:{' '}
                      </span>
                      <span className="text-black/70 dark:text-white/70">
                        {mode.api_source}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-black/50 dark:text-white/50">
                        Key:{' '}
                      </span>
                      <span className="text-black/70 dark:text-white/70">
                        {mode.key}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <FocusModeModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveMode}
              editingMode={editingMode}
            />

            <DeleteConfirmModal
              isOpen={deleteMode !== null}
              onClose={() => setDeleteMode(null)}
              onConfirm={handleConfirmDelete}
              title="Delete Focus Mode"
              message={`Are you sure you want to delete ${deleteMode?.title}? This action cannot be undone.`}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Page;
