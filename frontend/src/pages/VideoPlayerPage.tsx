import React from 'react';
import VideoPlayer from '../components/Video/VideoPlayer';

const VideoPlayerPage: React.FC = () => {
  // Datos que deben venir de la API real
  const videoData = {
    videoUrl: "", // Será cargado desde API
    title: "Cargando video...",
    description: "Cargando descripción del video...",
    courseId: 1,
    classId: 101,
    duration: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
            <span>›</span>
            <a href="/courses" className="hover:text-blue-600">Mis Cursos</a>
            <span>›</span>
            <a href="/courses/1" className="hover:text-blue-600">Desarrollo Web Frontend</a>
            <span>›</span>
            <span className="text-gray-900">Clase 1</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Aula Virtual - Reproductor de Video
              </h1>
              <p className="text-gray-600">
                Experiencia de aprendizaje interactiva con notas y marcadores
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2">
                <span>✅</span>
                <span>Marcar como Completada</span>
              </button>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2">
                <span>💾</span>
                <span>Guardar Progreso</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <VideoPlayer {...videoData} />

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recursos de la clase */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📂</span>
              Recursos de la Clase
            </h3>
            
            <div className="space-y-3">
              {/* TODO: Cargar recursos reales desde API */}
              <div className="text-center py-8 text-gray-500">
                <p>No hay recursos disponibles para esta clase.</p>
                <p className="text-sm">Los recursos se cargarán desde la API real.</p>
              </div>
            </div>
          </div>

          {/* Progreso del curso */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Progreso del Curso
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso General</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">Clases Completadas</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">10</p>
                  <p className="text-sm text-gray-600">Clases Restantes</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Próxima clase:</p>
                <p className="font-medium text-gray-900">Manejo de Estado con Redux</p>
                <p className="text-sm text-gray-500">Disponible el 15 de Dic, 2024</p>
              </div>
            </div>
          </div>

          {/* Comentarios y discusión */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span className="mr-2">💬</span>
              Discusión de la Clase
            </h3>
            
            <div className="space-y-4">
              {/* Comentario 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    JD
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Juan Pérez</p>
                    <p className="text-xs text-gray-500">hace 2 horas</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Excelente explicación sobre los hooks. La parte de useEffect me quedó muy clara.
                </p>
              </div>

              {/* Comentario 2 */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MG
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">María García</p>
                    <p className="text-xs text-gray-500">hace 5 horas</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  ¿Podrían agregar más ejemplos prácticos? Me gustaría ver más casos de uso.
                </p>
              </div>

              {/* Formulario de comentario */}
              <div className="border-t pt-4">
                <textarea
                  placeholder="Escribe tu comentario sobre esta clase..."
                  className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200">
                  Publicar Comentario
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación de clases */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Navegación de Clases</h3>
          
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200">
              <span>◀️</span>
              <span>Clase Anterior</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Clase 1 de 18</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === 0 ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
              <span>Siguiente Clase</span>
              <span>▶️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;