import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface AnimaDetails {
  designation: string;
  level: number;
  experience: number;
  created_at: number;
}

export function SimpleAnima() {
  const { animaId } = useParams();
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [anima, setAnima] = useState<AnimaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnima = async () => {
      if (!animaId) return;
      try {
        const result = await actor.get_anima(BigInt(animaId));
        if ('Ok' in result) {
          setAnima({
            designation: result.Ok.designation,
            level: Number(result.Ok.level),
            experience: Number(result.Ok.experience),
            created_at: Number(result.Ok.created_at)
          });
        } else {
          throw new Error(result.Err);
        }
      } catch (err) {
        console.error('Failed to load ANIMA:', err);
        setError('Failed to load ANIMA details');
      } finally {
        setLoading(false);
      }
    };

    loadAnima();
  }, [actor, animaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !anima) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-200 mb-4">{error || 'ANIMA not found'}</p>
            <button
              onClick={() => navigate('/vault')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Return to Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/vault')}
            className="text-gray-400 hover:text-white mr-4"
          >
            ← Back to Vault
          </button>
          <h1 className="text-3xl font-bold text-white">{anima.designation}</h1>
        </div>

        {/* ANIMA Details Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-400 mb-1">Level</div>
              <div className="text-2xl text-white">{anima.level}</div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-400 mb-1">Experience</div>
              <div className="text-2xl text-white">{anima.experience}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-gray-400 mb-2">Created On</div>
            <div className="text-white">
              {new Date(anima.created_at * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Neural Link Option */}
        <div className="text-center">
          <button
            onClick={() => navigate(`/neural-link/${animaId}`)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Open Neural Link →
          </button>
        </div>
      </div>
    </div>
  );
}