import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'alumno' | 'profesor'>('alumno');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    teacherCode: '' // Para profesores
  });

  const TEACHER_CODES = ['PROF2024', 'DOCENTE123', 'MAESTRO456']; // Códigos válidos para profesores

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validar código de profesor si es necesario
    if (userType === 'profesor' && !TEACHER_CODES.includes(formData.teacherCode)) {
      setError('Código de profesor incorrecto');
      setLoading(false);
      return;
    }

    try {
      const teacherCodeToSend = userType === 'profesor' ? formData.teacherCode : undefined;
      const success = await register(formData.email, formData.password, formData.nombre, userType, teacherCodeToSend);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Error al registrar usuario');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">🎓</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear nueva cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete al Campus Virtual Norma
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Selector de tipo de usuario */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('alumno')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition duration-200 ${
                  userType === 'alumno'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="text-2xl">👩‍🎓</span>
                <span className="font-medium">Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('profesor')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition duration-200 ${
                  userType === 'profesor'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="text-2xl">👨‍🏫</span>
                <span className="font-medium">Profesor</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="sr-only">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña (mín. 6 caracteres)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
              />
            </div>

            {/* Campo código de profesor */}
            {userType === 'profesor' && (
              <div>
                <label htmlFor="teacherCode" className="sr-only">
                  Código de profesor
                </label>
                <div className="relative">
                  <input
                    id="teacherCode"
                    name="teacherCode"
                    type="password"
                    required
                    value={formData.teacherCode}
                    onChange={handleInputChange}
                    className="relative block w-full px-3 py-3 border border-green-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Código de profesor (requerido)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-green-500">🔑</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Contacta con la administración para obtener el código de profesor
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : userType === 'profesor'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                <>
                  <span className="mr-2">
                    {userType === 'profesor' ? '👨‍🏫' : '👩‍🎓'}
                  </span>
                  Crear cuenta {userType === 'profesor' ? 'de profesor' : 'de estudiante'}
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            💡 Información importante:
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Los estudiantes pueden inscribirse en cursos inmediatamente</li>
            <li>• Los profesores necesitan un código especial para registrarse</li>
            <li>• Todos los datos se guardan de forma segura</li>
            <li>• Puedes cambiar tu perfil después del registro</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;