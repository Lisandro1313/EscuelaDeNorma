import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ForumReply {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    role: 'student' | 'instructor' | 'admin';
    avatar?: string;
  };
  postId: number;
  parentReplyId?: number;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: ForumReply[];
}

interface PostDetailProps {
  postId: number;
  onClose: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onClose }) => {
  const { usuario } = useAuth();
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReplies();
  }, [postId]);

  const loadReplies = async () => {
    setIsLoading(true);
    try {
      // Simular carga de respuestas
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const demoReplies: ForumReply[] = [
        {
          id: 1,
          content: 'Te recomiendo usar cookies httpOnly para mayor seguridad. El localStorage es vulnerable a ataques XSS.',
          author: {
            id: 3,
            name: 'Dr. Carlos López',
            role: 'instructor',
            avatar: '👨‍🏫'
          },
          postId: postId,
          upvotes: 12,
          downvotes: 0,
          isAccepted: true,
          createdAt: new Date('2024-10-25T10:30:00'),
          updatedAt: new Date('2024-10-25T10:30:00'),
          children: [
            {
              id: 5,
              content: 'Gracias por la respuesta! ¿Tienes algún ejemplo de implementación?',
              author: {
                id: 2,
                name: 'Ana García',
                role: 'student'
              },
              postId: postId,
              parentReplyId: 1,
              upvotes: 3,
              downvotes: 0,
              isAccepted: false,
              createdAt: new Date('2024-10-25T11:00:00'),
              updatedAt: new Date('2024-10-25T11:00:00')
            }
          ]
        },
        {
          id: 2,
          content: 'Aquí tienes un ejemplo de implementación: https://github.com/ejemplo/jwt-auth\n\nTambién te recomiendo revisar la documentación oficial de JWT.',
          author: {
            id: 4,
            name: 'María Rodríguez',
            role: 'student',
            avatar: '👩‍💻'
          },
          postId: postId,
          upvotes: 8,
          downvotes: 1,
          isAccepted: false,
          createdAt: new Date('2024-10-25T11:15:00'),
          updatedAt: new Date('2024-10-25T11:15:00'),
          children: []
        },
        {
          id: 3,
          content: 'Una alternativa es usar Context API de React para manejar el estado de autenticación globalmente.',
          author: {
            id: 6,
            name: 'Pedro Sánchez',
            role: 'student'
          },
          postId: postId,
          upvotes: 5,
          downvotes: 2,
          isAccepted: false,
          createdAt: new Date('2024-10-25T14:20:00'),
          updatedAt: new Date('2024-10-25T14:20:00'),
          children: []
        }
      ];

      setReplies(demoReplies);
    } catch (error) {
      console.error('Error cargando respuestas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReply = async () => {
    if (!newReply.trim()) return;

    const reply: ForumReply = {
      id: Date.now(),
      content: newReply,
      author: {
        id: usuario?.id || 1,
        name: usuario?.nombre || 'Usuario',
        role: usuario?.tipo === 'profesor' ? 'instructor' : 'student'
      },
      postId: postId,
      parentReplyId: replyingTo || undefined,
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      children: []
    };

    if (replyingTo) {
      // Agregar como respuesta anidada
      setReplies(prev => prev.map(r => {
        if (r.id === replyingTo) {
          return {
            ...r,
            children: [...(r.children || []), reply]
          };
        }
        return r;
      }));
    } else {
      // Agregar como respuesta principal
      setReplies(prev => [...prev, reply]);
    }

    setNewReply('');
    setReplyingTo(null);
  };

  const voteReply = (replyId: number, type: 'up' | 'down', parentId?: number) => {
    const updateReply = (reply: ForumReply): ForumReply => {
      if (reply.id === replyId) {
        return {
          ...reply,
          upvotes: type === 'up' ? reply.upvotes + 1 : reply.upvotes,
          downvotes: type === 'down' ? reply.downvotes + 1 : reply.downvotes
        };
      }
      
      if (reply.children) {
        return {
          ...reply,
          children: reply.children.map(updateReply)
        };
      }
      
      return reply;
    };

    setReplies(prev => prev.map(updateReply));
  };

  const acceptReply = (replyId: number) => {
    setReplies(prev => prev.map(reply => ({
      ...reply,
      isAccepted: reply.id === replyId,
      children: reply.children?.map(child => ({
        ...child,
        isAccepted: child.id === replyId
      }))
    })));
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'hace un momento';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'instructor': return 'Instructor';
      case 'admin': return 'Admin';
      default: return 'Estudiante';
    }
  };

  const renderReply = (reply: ForumReply, isNested = false) => (
    <div key={reply.id} className={`${isNested ? 'ml-8 mt-4' : 'mb-6'}`}>
      <div className={`bg-white rounded-lg border ${reply.isAccepted ? 'border-green-300 bg-green-50' : 'border-gray-200'} p-4`}>
        {reply.isAccepted && (
          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              ✅ Respuesta Aceptada
            </span>
          </div>
        )}

        {/* Header de la respuesta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{reply.author.avatar || '👤'}</span>
            <span className="font-medium text-gray-900">{reply.author.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(reply.author.role)}`}>
              {getRoleLabel(reply.author.role)}
            </span>
            <span className="text-xs text-gray-500">
              {getTimeDifference(reply.createdAt)}
            </span>
          </div>

          {/* Acciones del instructor/admin */}
          {(usuario?.tipo === 'profesor' || usuario?.tipo === 'admin') && !reply.isAccepted && (
            <button
              onClick={() => acceptReply(reply.id)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
              title="Marcar como respuesta aceptada"
            >
              ✅ Aceptar
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="text-gray-700 mb-4 whitespace-pre-wrap">
          {reply.content}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => voteReply(reply.id, 'up')}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition duration-200"
            >
              <span>👍</span>
              <span className="text-sm">{reply.upvotes}</span>
            </button>

            <button
              onClick={() => voteReply(reply.id, 'down')}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition duration-200"
            >
              <span>👎</span>
              <span className="text-sm">{reply.downvotes}</span>
            </button>

            {!isNested && (
              <button
                onClick={() => {
                  setReplyingTo(reply.id);
                  document.getElementById('reply-textarea')?.focus();
                }}
                className="text-gray-500 hover:text-blue-600 text-sm transition duration-200"
              >
                💬 Responder
              </button>
            )}
          </div>

          <div className="text-xs text-gray-400">
            Score: {reply.upvotes - reply.downvotes}
          </div>
        </div>
      </div>

      {/* Respuestas anidadas */}
      {reply.children && reply.children.length > 0 && (
        <div className="mt-4">
          {reply.children.map(child => renderReply(child, true))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              💬 Respuestas y Discusión
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Estadísticas */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{replies.length}</div>
                  <div className="text-xs text-gray-500">Respuestas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {replies.filter(r => r.isAccepted || r.children?.some(c => c.isAccepted)).length}
                  </div>
                  <div className="text-xs text-gray-500">Aceptadas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {replies.reduce((total, r) => total + r.upvotes + (r.children?.reduce((sum, c) => sum + c.upvotes, 0) || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Votos</div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Ordenado por relevancia
              </div>
            </div>
          </div>

          {/* Lista de respuestas */}
          <div className="space-y-6 mb-8">
            {replies.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay respuestas aún
                </h3>
                <p className="text-gray-600">
                  Sé el primero en responder a este post
                </p>
              </div>
            ) : (
              replies
                .sort((a, b) => {
                  // Primero las respuestas aceptadas
                  if (a.isAccepted && !b.isAccepted) return -1;
                  if (!a.isAccepted && b.isAccepted) return 1;
                  // Luego por puntuación
                  return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
                })
                .map(reply => renderReply(reply))
            )}
          </div>

          {/* Formulario de nueva respuesta */}
          <div className="border-t pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {replyingTo ? '💬 Responder a comentario' : '✍️ Agregar tu respuesta'}
              </h3>
              {replyingTo && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600">
                    Respondiendo a: {replies.find(r => r.id === replyingTo)?.author.name}
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <textarea
                id="reply-textarea"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu respuesta..."
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Puedes usar Markdown para formatear tu respuesta
                </div>

                <div className="flex space-x-3">
                  {replyingTo && (
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setNewReply('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                  
                  <button
                    onClick={submitReply}
                    disabled={!newReply.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition duration-200"
                  >
                    {replyingTo ? 'Responder' : 'Publicar Respuesta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;