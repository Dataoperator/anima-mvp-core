import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export function Landing() {
  const navigate = useNavigate();
  const { connect, identity } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (identity) {
      navigate('/vault');
    }
  }, [identity, navigate]);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await connect();
      navigate('/vault');
    } catch (err) {
      console.error('Connection failed:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">ANIMA</h1>
          <p className="text-xl text-gray-400">Living NFTs on the Internet Computer</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <p className="text-gray-300 mb-6">
            Connect your wallet to begin your ANIMA journey
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>

        <div className="text-sm text-gray-500">
          <p>Powered by Internet Computer</p>
        </div>
      </div>
    </div>
  );
}