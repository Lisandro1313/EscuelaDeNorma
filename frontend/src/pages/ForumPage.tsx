import React, { useState, useEffect } from 'react';
import Forum from '../components/Forum/Forum';
import PostDetail from '../components/Forum/PostDetail';

interface ForumPageProps {}

const ForumPage: React.FC<ForumPageProps> = () => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'forum' | 'trending' | 'my-posts'>('forum');
  const [stats, setStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    myPosts: 0,
    totalReplies: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Simular carga de estadísticas
    setStats({
      totalPosts: 127,
      activePosts: 45,
      myPosts: 8,
      totalReplies: 342
    });
  };

  const trendingTopics = [
    { id: 1, topic: 'React Hooks', posts: 23, trend: '+15%' },
    { id: 2, topic: 'Node.js', posts: 18, trend: '+8%' },
    { id: 3, topic: 'TypeScript', posts: 15, trend: '+12%' },
    { id: 4, topic: 'Authentication', posts: 12, trend: '+20%' },
    { id: 5, topic: 'Deployment', posts: 9, trend: '+5%' }
  ];

  const quickActions = [
    {
      title: 'Hacer una Pregunta',
      description: 'Publica una pregunta técnica',
      icon: '❓',
      color: 'blue',
      action: () => {/* Abrir modal de nueva pregunta */}
    },
    {
      title: 'Compartir Conocimiento',
      description: 'Comparte tips y tutoriales',
      icon: '💡',
      color: 'green',
      action: () => {/* Abrir modal de nuevo post */}
    },
    {
      title: 'Reportar Problema',
      description: 'Reporta bugs o problemas',
      icon: '🐛',
      color: 'red',
      action: () => {/* Abrir modal de reporte */}
    },
    {
      title: 'Buscar Ayuda',
      description: 'Busca en posts existentes',
      icon: '🔍',
      color: 'purple',
      action: () => {/* Activar búsqueda */}
    }
  ];

  const forumGuidelines = [
    {
      title: 'Sé Respetuoso',
      description: 'Mantén un tono profesional y cortés',
      icon: '🤝'
    },
    {
      title: 'Busca Primero',
      description: 'Revisa si tu pregunta ya fue respondida',
      icon: '🔍'
    },
    {
      title: 'Sé Específico',
      description: 'Proporciona detalles y contexto',
      icon: '📝'
    },
    {
      title: 'Ayuda a Otros',
      description: 'Responde cuando puedas aportar',
      icon: '🤲'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Principal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Foros de la Comunidad 💬
              </h1>
              <p className="text-blue-100 text-lg">
                Conecta, aprende y comparte conocimiento con estudiantes e instructores
              </p>
            </div>
            
            <div className="hidden md:block">
              <div className="text-6xl opacity-50">
                🎓
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <div className="text-sm text-blue-100">Posts Totales</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.activePosts}</div>
              <div className="text-sm text-blue-100">Posts Activos</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.myPosts}</div>
              <div className="text-sm text-blue-100">Mis Posts</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalReplies}</div>
              <div className="text-sm text-blue-100">Respuestas</div>
            </div>
          </div>
        </div>

        {/* Navegación de vistas */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-lg shadow">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveView('forum')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'forum'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💬 Foro Principal
              </button>
              
              <button
                onClick={() => setActiveView('trending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'trending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔥 Tendencias
              </button>
              
              <button
                onClick={() => setActiveView('my-posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'my-posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Mis Posts
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {activeView === 'forum' && <Forum />}
            
            {activeView === 'trending' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    🔥 Temas Trending
                  </h2>
                  
                  <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">#{topic.topic}</h3>
                            <p className="text-sm text-gray-600">{topic.posts} posts</p>
                          </div>
                        </div>
                        
                        <div className="text-green-600 font-medium text-sm">
                          {topic.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📊 Estadísticas de la Semana
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">42</div>
                      <div className="text-sm text-gray-600">Nuevos Posts</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">168</div>
                      <div className="text-sm text-gray-600">Respuestas</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-gray-600">Nuevos Usuarios</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">89%</div>
                      <div className="text-sm text-gray-600">Resueltos</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeView === 'my-posts' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📝 Mis Contribuciones
                </h2>
                
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tus posts aparecerán aquí
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Cuando crees posts o respuestas, podrás verlos en esta sección
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200">
                    Crear Mi Primer Post
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Acciones Rápidas
              </h3>
              
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`w-full text-left p-3 rounded-lg border border-gray-200 hover:shadow-md transition duration-200`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{action.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guías del Foro */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Guías del Foro
              </h3>
              
              <div className="space-y-4">
                {forumGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0">{guideline.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{guideline.title}</h4>
                      <p className="text-xs text-gray-600">{guideline.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorías Populares */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📂 Categorías Populares
              </h3>
              
              <div className="space-y-2">
                {[
                  { name: 'Técnico', count: 45, color: 'purple' },
                  { name: 'General', count: 32, color: 'blue' },
                  { name: 'Tareas', count: 28, color: 'green' },
                  { name: 'Q&A', count: 22, color: 'red' }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usuarios Activos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👥 Usuarios Activos
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Dr. Carlos López', role: 'Instructor', avatar: '👨‍🏫' },
                  { name: 'Ana García', role: 'Estudiante', avatar: '👩‍🎓' },
                  { name: 'María Rodríguez', role: 'Estudiante', avatar: '👩‍💻' },
                  { name: 'Admin Campus', role: 'Admin', avatar: '👨‍💼' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg">{user.avatar}</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de PostDetail */}
      {selectedPostId && (
        <PostDetail
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
};

export default ForumPage;