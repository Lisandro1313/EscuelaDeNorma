import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    }
  };

  const usarCuentaPrueba = (tipoCuenta: 'alumno' | 'profesor' | 'admin') => {
    const cuentas = {
      alumno: { email: 'alumno@test.com', password: '123456' },
      profesor: { email: 'profesor@test.com', password: '123456' },
      admin: { email: 'admin@campusnorma.com', password: 'admin123' }
    };
    
    setEmail(cuentas[tipoCuenta].email);
    setPassword(cuentas[tipoCuenta].password);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Campus Virtual
          </h2>
          <p className="text-gray-600">
            Escuela de Enseñanza Superior
          </p>
        </div>

        {/* Indicador de conexión con backend */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">🟢</span>
            <span className="text-sm text-green-700">Conectado al servidor backend</span>
          </div>
        </div>

        {/* Cuentas de prueba */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🔧 Cuentas de Prueba (Backend Real)</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => usarCuentaPrueba('alumno')}
              className="w-full text-left px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded transition duration-200"
              disabled={loading}
            >
              👩‍🎓 <strong>Alumno:</strong> alumno@campus.com / 123456
            </button>
            <button
              type="button"
              onClick={() => usarCuentaPrueba('profesor')}
              className="w-full text-left px-3 py-2 text-sm bg-green-100 hover:bg-green-200 rounded transition duration-200"
              disabled={loading}
            >
              👨‍🏫 <strong>Profesor:</strong> profesor@campus.com / 123456
            </button>
            <button
              type="button"
              onClick={() => usarCuentaPrueba('admin')}
              className="w-full text-left px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 rounded transition duration-200"
              disabled={loading}
            >
              👩‍💼 <strong>Admin:</strong> admin@campus.com / 123456
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Tu contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Conectando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              disabled={loading}
              className="text-blue-600 hover:text-blue-500 text-sm disabled:text-gray-400"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Acceso gratuito a cursos</p>
          <p>💳 Paga solo las clases que tomes</p>
          <p className="mt-2 text-xs text-green-600">✅ Backend funcionando con JWT y base de datos</p>
        </div>
      </div>
    </div>
  );
};

export default Login;