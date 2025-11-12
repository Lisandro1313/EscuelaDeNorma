import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <nav className="relative z-10 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="text-white font-bold text-xl">Campus Virtual</span>
            </div>
            <Link
              to="/login"
              className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-300"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Escuela de
            <span className="block text-blue-300">Enseñanza Superior</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            La plataforma educativa que revoluciona el aprendizaje con 
            <span className="text-yellow-300 font-semibold"> acceso gratuito</span> y 
            <span className="text-green-300 font-semibold"> pago por clases</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition duration-300 transform hover:scale-105"
            >
              🚀 Comenzar Ahora
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition duration-300">
              📹 Ver Demo
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-xl font-bold text-white mb-2">Acceso Gratuito</h3>
              <p className="text-blue-100">
                Inscríbete sin costo en todos los cursos. Accede a materiales, videos y recursos.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-white mb-2">Paga por Clase</h3>
              <p className="text-blue-100">
                Solo paga cuando tomes clases en vivo. Sin mensualidades ni compromisos.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">Estilo Moodle</h3>
              <p className="text-blue-100">
                Plataforma completa con videos, documentos, chat y seguimiento de progreso.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-16 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-blue-200">Estudiantes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-blue-200">Cursos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">25+</div>
              <div className="text-blue-200">Profesores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-blue-200">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            ¿Cómo Funciona?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Regístrate Gratis</h3>
              <p className="text-blue-200">
                Crea tu cuenta sin costo y accede inmediatamente a todos los cursos disponibles.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Explora y Estudia</h3>
              <p className="text-blue-200">
                Navega por los materiales, ve videos y estudia a tu propio ritmo.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Paga Solo las Clases</h3>
              <p className="text-blue-200">
                Cuando quieras interactuar en vivo, reserva y paga solo esa clase específica.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Revolucionar tu Aprendizaje?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a cientos de estudiantes que ya están transformando su educación
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              👩‍🎓 Comenzar como Estudiante
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              👨‍🏫 Soy Profesor
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🎓</span>
            <span className="text-white font-bold text-xl">Campus Virtual</span>
          </div>
          <p className="text-blue-200">
            Escuela de Enseñanza Superior - Transformando la educación digital
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <span className="text-blue-300 hover:text-white cursor-pointer">📧 Contacto</span>
            <span className="text-blue-300 hover:text-white cursor-pointer">📱 Soporte</span>
            <span className="text-blue-300 hover:text-white cursor-pointer">📚 Blog</span>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LandingPage;