import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface Message {
  id: string;
  sender: 'user' | 'anima';
  content: string;
  timestamp: number;
}

interface AnimaDetails {
  designation: string;
  level: number;
  experience: number;
}

export function SimpleNeuralLink() {
  const { animaId } = useParams();
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [anima, setAnima] = useState<AnimaDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
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
            experience: Number(result.Ok.experience)
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !animaId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const result = await actor.interact({
        token_id: BigInt(animaId),
        message: userMessage.content
      });

      if ('Ok' in result) {
        const animaMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'anima',
          content: result.Ok.message,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, animaMessage]);

        const updatedAnima = await actor.get_anima(BigInt(animaId));
        if ('Ok' in updatedAnima) {
          setAnima({
            designation: updatedAnima.Ok.designation,
            level: Number(updatedAnima.Ok.level),
            experience: Number(updatedAnima.Ok.experience)
          });
        }
      }
    } catch (err) {
      console.error('Interaction failed:', err);
      setError('Failed to send message');
    }
  };

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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/anima/${animaId}`)}
              className="text-gray-400 hover:text-white mr-4"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-white">
              Neural Link: {anima.designation}
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            Level {anima.level} • {anima.experience} XP
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              Begin your neural link connection...
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-sm rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}