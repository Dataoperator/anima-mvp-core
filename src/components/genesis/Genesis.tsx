import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { createPaymentParams } from '@/utils/payment';

const MINT_COST = 1; // 1 ICP

type PaymentStatus = 'awaiting' | 'pending' | 'confirmed' | 'minting' | 'complete';

export function Genesis() {
  const navigate = useNavigate();
  const { actor, identity } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('awaiting');

  const handlePayment = async () => {
    if (!identity) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare transfer parameters
      const transferArgs = createPaymentParams(MINT_COST);

      // Request transfer through Plug wallet
      const result = await window.ic.plug.requestTransfer(transferArgs);
      
      if (result.height) {
        setStatus('pending');
        await checkPaymentAndMint();
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  };

  const checkPaymentAndMint = async () => {
    try {
      const isConfirmed = await actor.verify_payment(identity!.getPrincipal());
      if (isConfirmed) {
        await handleMint();
      } else {
        setTimeout(checkPaymentAndMint, 5000); // Check again in 5 seconds
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      setError('Payment verification failed. Please try again.');
      setStatus('awaiting');
      setLoading(false);
    }
  };

  const handleMint = async () => {
    setStatus('minting');
    try {
      const result = await actor.mint_anima(identity!.getPrincipal());
      
      if ('Ok' in result) {
        setStatus('complete');
        // Redirect to vault after success
        setTimeout(() => {
          navigate('/vault');
        }, 2000); // Short delay to show success state
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      console.error('Minting failed:', err);
      setError(err instanceof Error ? err.message : 'Minting failed');
      setStatus('awaiting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-6 rounded-lg shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold mb-2">Create Your ANIMA</h2>
          <p className="text-center text-gray-400 mb-6">
            Each ANIMA is uniquely designated upon creation
          </p>

          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Payment Required</h3>
            <p className="text-xl text-center text-white">1 ICP</p>
            <p className="text-sm text-gray-400 mt-2 text-center">
              Payment will be processed through Internet Computer network
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-lg text-indigo-300">
              {status === 'awaiting' && 'Ready to create your ANIMA'}
              {status === 'pending' && 'Verifying payment...'}
              {status === 'confirmed' && 'Payment confirmed!'}
              {status === 'minting' && 'Creating your ANIMA...'}
              {status === 'complete' && 'ANIMA created successfully! Redirecting to vault...'}
            </p>
            {loading && (
              <div className="mt-4 inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
            )}
          </div>

          {status === 'awaiting' && (
            <button
              onClick={handlePayment}
              disabled={loading || !identity}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create ANIMA
            </button>
          )}
        </div>

        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Your ANIMA will be created automatically after payment confirmation</p>
        </div>
      </div>
    </div>
  );
}