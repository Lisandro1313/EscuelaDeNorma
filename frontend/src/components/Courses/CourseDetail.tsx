import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import socketService from '../../services/socket';

interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  profesor: string;
  profesor_id: number;
  categoria: string;
  precio: number;
  duracion: string;
  estudiantes: number;
  rating: number;
  imagen: string;
}

interface Class {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  duracion: number;
  tipo: string;
  videoUrl?: string;
  materialUrl?: string;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('contenido');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const courseId = parseInt(id);
        
        try {
          // Cargar datos reales del curso desde la API
          const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
          if (response.ok) {
            const courseData = await response.json();
            setCourse(courseData);
            
            // Verificar si el usuario está inscrito en este curso
            if (usuario) {
              const enrollmentResponse = await fetch(`http://localhost:5000/api/courses/${courseId}/enrollment`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              if (enrollmentResponse.ok) {
                const enrollmentData = await enrollmentResponse.json();
                setEnrolled(enrollmentData.enrolled);
              }
            }
          } else {
            console.error('Curso no encontrado');
            navigate('/courses');
            return;
          }
          
          // Por ahora, las clases estarán vacías hasta implementar módulos
          setClasses([]);
          
        } catch (error) {
          console.error('Error al cargar curso:', error);
          navigate('/courses');
          return;
        }
      } catch (error) {
        console.error('Error cargando curso:', error);
        setError('Error cargando los datos del curso');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id, usuario]);

  // Efecto separado para el chat
  useEffect(() => {
    if (enrolled && id && usuario) {
      const courseId = parseInt(id);
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
        socketService.joinCourse(courseId);
        socketService.onNewMessage((messageData: any) => {
          setChatMessages(prev => [...prev, messageData]);
        });
      }

      return () => {
        socketService.offNewMessage();
      };
    }
  }, [enrolled, id, usuario]);

  const isInstructor = useMemo(() => {
    return course && usuario?.tipo === 'profesor' && course.profesor_id === usuario.id;
  }, [course, usuario]);

  const handleEnroll = async () => {
    if (!course) return;
    
    // Verificar que el usuario esté autenticado
    if (!usuario) {
      alert('Debes iniciar sesión para inscribirte en un curso');
      navigate('/login');
      return;
    }
    
    // Si el curso es gratuito, inscribir directamente
    if (course.precio === 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/courses/${course.id}/enroll`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setEnrolled(true);
          alert('¡Te has inscrito exitosamente al curso gratuito!');
          // Recargar la página para actualizar el estado
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`Error al inscribirse: ${error.error}`);
        }
      } catch (error) {
        console.error('Error al inscribirse:', error);
        alert('Error de conexión al inscribirse');
      }
    } else {
      // Si el curso tiene precio, redirigir a la página de pago
      navigate(`/course/${course.id}/payment`);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !course || !usuario) return;
    
    socketService.sendMessage(course.id, newMessage, usuario.id, usuario.nombre);
    setNewMessage('');
  };

  const handleJoinClass = async (_classId: number) => {
    try {
      // Simular unirse a la clase
      alert('¡Te has unido a la clase!');
    } catch (error) {
      console.error('Error al unirse a la clase:', error);
      alert('Error al unirse a la clase. Intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando curso del servidor...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600">{error || 'Curso no encontrado'}</p>
              <Link 
                to="/courses" 
                className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Volver a Cursos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header del curso */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className="text-6xl mr-4">{course.imagen}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{course.nombre}</h1>
                  <p className="text-gray-600 mt-1">👨‍🏫 {course.profesor}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span>⏱️ {course.duracion}</span>
                    <span>👥 {course.estudiantes} estudiantes</span>
                    <span>⭐ {course.rating}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {course.categoria}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg">{course.descripcion}</p>

              {/* Estado de conexión */}
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">🟢</span>
                  <span className="text-sm text-green-700">
                    Conectado al backend - Chat y clases en tiempo real disponibles
                  </span>
                </div>
              </div>
            </div>

            <div className="ml-8 flex flex-col items-end">
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {course.precio === 0 ? (
                  <span className="text-green-600">GRATIS</span>
                ) : (
                  `$${course.precio}`
                )}
              </div>
              
              {enrolled ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <span className="text-green-700 font-medium">✅ Inscrito</span>
                  <p className="text-sm text-green-600 mt-1">Tienes acceso completo</p>
                  <Link
                    to={`/course/${course.id}/view`}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition duration-200 inline-block"
                  >
                    Ver Contenido del Curso
                  </Link>
                </div>
              ) : isInstructor ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <span className="text-blue-700 font-medium">👨‍🏫 Tu Curso</span>
                  <p className="text-sm text-blue-600 mt-1">Eres el instructor</p>
                  <Link
                    to={`/course/${course.id}/manage`}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-200"
                  >
                    Gestionar Curso
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center ${
                    course.precio === 0 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {course.precio === 0 ? (
                    <>🆓 Inscribirse Gratis</>
                  ) : (
                    <>💳 Comprar Curso - ${course.precio}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'contenido', label: '📚 Contenido', badge: classes.length },
            { id: 'chat', label: '💬 Chat del Curso', badge: chatMessages.length },
            { id: 'recursos', label: '📁 Recursos' },
            { id: 'calificaciones', label: '📊 Calificaciones' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'contenido' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Clases del Curso ({classes.length})
            </h3>
            
            {classes.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📝</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No hay clases disponibles
                </h4>
                <p className="text-gray-600">
                  Las clases aparecerán aquí cuando el instructor las publique
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {classes.map((clase, index) => (
                  <div key={clase.id} className="border rounded-lg p-4 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            Clase {index + 1}
                          </span>
                          <h4 className="font-medium text-gray-900">{clase.titulo}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            clase.tipo === 'grabada' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {clase.tipo === 'grabada' ? '📹 Grabada' : '🔴 En Vivo'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{clase.descripcion}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {new Date(clase.fecha).toLocaleDateString()}</span>
                          <span>🕐 {clase.hora}</span>
                          <span>⏱️ {clase.duracion} min</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {enrolled || isInstructor ? (
                          <div className="flex space-x-2">
                            {clase.videoUrl && (
                              <button className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm transition duration-200">
                                ▶️ Ver Video
                              </button>
                            )}
                            {clase.tipo === 'vivo' && (
                              <button 
                                onClick={() => handleJoinClass(clase.id)}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-md text-sm transition duration-200"
                              >
                                🔴 Unirse
                              </button>
                            )}
                            {clase.materialUrl && (
                              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm transition duration-200">
                                📁 Material
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">🔒 Inscríbete para acceder</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chat del Curso en Tiempo Real 💬
            </h3>
            
            {enrolled || isInstructor ? (
              <div className="space-y-4">
                {/* Mensajes del chat */}
                <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                      <span className="text-2xl block mb-2">💬</span>
                      <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div key={index} className="mb-2 p-2 bg-white rounded">
                        <div className="text-sm text-gray-600">
                          <strong>{message.usuario}</strong> - {message.fecha}
                        </div>
                        <div>{message.mensaje}</div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Input para nuevo mensaje */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Enviar
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">🔄</span>
                    <span className="text-sm text-blue-700">
                      Chat en tiempo real - Los mensajes aparecen al instante
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🔒</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Chat solo para estudiantes inscritos
                </h4>
                <p className="text-gray-600 mb-4">
                  Inscríbete al curso para participar en el chat en tiempo real
                </p>
                <button
                  onClick={handleEnroll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  💳 Comprar Curso
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recursos' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recursos del Curso</h3>
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📁</span>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Recursos próximamente
              </h4>
              <p className="text-gray-600">
                Los recursos adicionales del curso aparecerán aquí
              </p>
            </div>
          </div>
        )}

        {activeTab === 'calificaciones' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Calificaciones</h3>
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📊</span>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Sistema de calificaciones próximamente
              </h4>
              <p className="text-gray-600">
                Las calificaciones y evaluaciones aparecerán aquí
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;