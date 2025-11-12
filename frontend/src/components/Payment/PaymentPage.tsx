import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  profesor_nombre?: string;
  duracion?: string;
  categoria?: string;
}

const PaymentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      } else {
        setError('Error al cargar el curso');
      }
    } catch (error) {
      console.error('Error al cargar curso:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course) return;
    
    try {
      setProcessing(true);
      setError('');

      try {
        // Crear preferencia de pago con MercadoPago
        const response = await fetch('http://localhost:5000/api/payments/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ courseId: course.id })
        });

        if (response.ok) {
          const data = await response.json();
          // Redirigir a MercadoPago
          window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.preferenceId}`;
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error al procesar el pago');
        }
      } catch (fetchError) {
        console.error('Error en la solicitud de pago:', fetchError);
        setError('Error de conexión. Intenta nuevamente.');
      }

    } catch (error) {
      console.error('Error procesando pago:', error);
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se pudo cargar la información del curso</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <p className="text-gray-600 mt-2">Completa tu inscripción al curso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Curso</h2>
              
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{course.nombre}</h3>
                  <p className="text-gray-600 mt-1">{course.descripcion}</p>
                  
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span>👨‍🏫 {course.profesor_nombre || 'Instructor'}</span>
                    <span>⏱️ {course.duracion || 'Duración no especificada'}</span>
                    <span>🎓 {course.categoria || 'General'}</span>
                  </div>
                </div>
              </div>

              {/* Course Content Preview */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Contenido del Curso</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Introducción a la Programación Avanzada
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Estructuras de Datos Complejas
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Algoritmos de Optimización
                  </div>
                  <div className="text-sm text-gray-500 ml-5">
                    +5 módulos más
                  </div>
                </div>
              </div>
            </div>

            {/* What you'll get */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qué incluye este curso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Acceso completo al curso
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Certificado de finalización
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Materiales descargables
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Acceso de por vida
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Soporte del instructor
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Actualizaciones gratuitas
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Compra</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio del curso</span>
                  <span className="font-medium">{formatCurrency(course.precio)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuento</span>
                  <span className="text-green-600">-{formatCurrency(0)}</span>
                </div>
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(course.precio)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando pago...
                  </>
                ) : (
                  <>
                    💳 Procesar Pago
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">🔒</span>
                  <div className="text-sm text-green-700">
                    <p className="font-medium">Pago Seguro</p>
                    <p>Integración completa con MercadoPago. Tu información está protegida.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;