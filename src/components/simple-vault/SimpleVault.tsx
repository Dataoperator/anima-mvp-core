import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface AnimaData {
  id: string;
  designation: string;
  level: number;
  experience: number;
}

export function SimpleVault() {
  const navigate = useNavigate();
  const { actor, identity } = useAuth();
  const [animas, setAnimas] = useState<AnimaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnimas = async () => {
      if (!identity) return;

      try {
        const userAnimas = await actor.get_user_animas(identity.getPrincipal());
        const formatted = userAnimas.map(([id, data]) => ({
          id: id.toString(),
          designation: data.designation,
          level: Number(data.level),
          experience: Number(data.experience)
        }));
        
        setAnimas(formatted);
      } catch (err) {
        console.error('Failed to load ANIMAs:', err);
        setError('Failed to load your ANIMAs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAnimas();
  }, [actor, identity]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Your ANIMAs</h1>
          <button
            onClick={() => navigate('/genesis')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Create New ANIMA
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : animas.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium text-white mb-2">No ANIMAs Yet</h3>
            <p className="text-gray-400 mb-6">Create your first ANIMA to begin</p>
            <button
              onClick={() => navigate('/genesis')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Create ANIMA
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animas.map((anima) => (
              <div
                key={anima.id}
                onClick={() => navigate(`/anima/${anima.id}`)}
                className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {anima.designation}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Level</span>
                    <span>{anima.level}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Experience</span>
                    <span>{anima.experience}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>ID</span>
                    <span className="text-sm">{anima.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}