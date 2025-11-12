import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

type ViewType = 'overview' | 'students' | 'courses' | 'revenue' | 'engagement';

const AnalyticsPage: React.FC = () => {
  const { usuario } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('overview');

  const navigationItems = [
    { id: 'overview', label: 'Vista General', icon: '📊', description: 'Métricas principales y KPIs' },
    { id: 'students', label: 'Estudiantes', icon: '👥', description: 'Análisis de usuarios y progreso' },
    { id: 'courses', label: 'Cursos', icon: '📚', description: 'Performance de contenido' },
    { id: 'revenue', label: 'Ingresos', icon: '💰', description: 'Análisis financiero' },
    { id: 'engagement', label: 'Engagement', icon: '📱', description: 'Interacción y actividad' }
  ];

  const renderStudentAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Análisis de Estudiantes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Estudiantes Activos</h3>
            <p className="text-3xl font-bold">1,247</p>
            <p className="text-blue-100 text-sm">↗️ +12.5% vs mes anterior</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Nuevos Registros</h3>
            <p className="text-3xl font-bold">89</p>
            <p className="text-green-100 text-sm">↗️ +23.4% esta semana</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Retención 30d</h3>
            <p className="text-3xl font-bold">84.2%</p>
            <p className="text-purple-100 text-sm">↗️ +3.1% mejora</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Crecimiento de Usuarios</h3>
            <div className="space-y-3">
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((month, index) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-gray-700">{month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 rounded-full h-4 w-32">
                      <div 
                        className="bg-blue-600 h-4 rounded-full" 
                        style={{width: `${(index + 1) * 15}%`}}
                      />
                    </div>
                    <span className="text-sm font-medium">{(index + 1) * 45}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Segmentación de Usuarios</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Estudiantes Principiantes</span>
                <span className="font-bold text-blue-600">456 (37%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Estudiantes Intermedios</span>
                <span className="font-bold text-green-600">523 (42%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Estudiantes Avanzados</span>
                <span className="font-bold text-purple-600">268 (21%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Análisis de Cursos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Cursos Totales</h3>
            <p className="text-3xl font-bold">23</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Más Popular</h3>
            <p className="text-lg font-bold">React Fundamentals</p>
            <p className="text-yellow-100 text-sm">342 inscritos</p>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Tasa Completitud</h3>
            <p className="text-3xl font-bold">78.5%</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Satisfacción</h3>
            <p className="text-3xl font-bold">4.8/5</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 font-medium text-gray-700">Curso</th>
                <th className="text-center py-4 font-medium text-gray-700">Inscritos</th>
                <th className="text-center py-4 font-medium text-gray-700">Completados</th>
                <th className="text-center py-4 font-medium text-gray-700">Promedio</th>
                <th className="text-center py-4 font-medium text-gray-700">Ingresos</th>
                <th className="text-center py-4 font-medium text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'React Fundamentals', enrolled: 342, completed: 267, average: 87.3, revenue: 8550, trend: 'up' },
                { name: 'JavaScript Advanced', enrolled: 298, completed: 198, average: 82.1, revenue: 7450, trend: 'up' },
                { name: 'Node.js Backend', enrolled: 234, completed: 156, average: 85.7, revenue: 5850, trend: 'stable' },
                { name: 'TypeScript Mastery', enrolled: 189, completed: 134, average: 89.2, revenue: 4725, trend: 'up' },
                { name: 'Vue.js Complete', enrolled: 167, completed: 89, average: 78.9, revenue: 4175, trend: 'down' }
              ].map((course, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-500">ID: {index + 1}</p>
                    </div>
                  </td>
                  <td className="text-center py-4 text-gray-700">{course.enrolled}</td>
                  <td className="text-center py-4">
                    <span className="text-green-600 font-medium">{course.completed}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({((course.completed / course.enrolled) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="text-center py-4">
                    <span className={`font-medium ${
                      course.average >= 85 ? 'text-green-600' : 
                      course.average >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {course.average}%
                    </span>
                  </td>
                  <td className="text-center py-4 font-medium text-green-600">
                    ${course.revenue.toLocaleString()}
                  </td>
                  <td className="text-center py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      course.trend === 'up' ? 'bg-green-100 text-green-800' :
                      course.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.trend === 'up' ? '↗️ Creciendo' : 
                       course.trend === 'down' ? '↘️ Bajando' : '→ Estable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRevenueAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Análisis de Ingresos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Ingresos del Mes</h3>
            <p className="text-3xl font-bold">$18,945</p>
            <p className="text-green-100 text-sm">↗️ +15.3% vs mes anterior</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Transacciones</h3>
            <p className="text-3xl font-bold">159</p>
            <p className="text-blue-100 text-sm">↗️ +8.7% esta semana</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Ticket Promedio</h3>
            <p className="text-3xl font-bold">$119</p>
            <p className="text-purple-100 text-sm">↗️ +6.2% mejora</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Tasa Conversión</h3>
            <p className="text-3xl font-bold">12.8%</p>
            <p className="text-orange-100 text-sm">→ Estable</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Ingresos por Método de Pago</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💳</span>
                  <span className="text-gray-700">Tarjeta de Crédito</span>
                </div>
                <span className="font-bold text-blue-600">$12,450 (65.7%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏪</span>
                  <span className="text-gray-700">MercadoPago</span>
                </div>
                <span className="font-bold text-green-600">$4,890 (25.8%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏦</span>
                  <span className="text-gray-700">Transferencia</span>
                </div>
                <span className="font-bold text-purple-600">$1,605 (8.5%)</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Proyección de Ingresos</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                <p className="text-sm text-green-700">Proyección Próximo Mes</p>
                <p className="text-2xl font-bold text-green-800">$21,780</p>
                <p className="text-xs text-green-600">Basado en tendencia actual</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Q4 2024</p>
                  <p className="text-lg font-bold text-blue-800">$67,500</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">Año 2024</p>
                  <p className="text-lg font-bold text-purple-800">$245,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEngagementAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📱 Análisis de Engagement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Sesiones Diarias</h3>
            <p className="text-3xl font-bold">2,340</p>
            <p className="text-pink-100 text-sm">↗️ +18.5%</p>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Tiempo Promedio</h3>
            <p className="text-3xl font-bold">47 min</p>
            <p className="text-cyan-100 text-sm">↗️ +12.3%</p>
          </div>
          
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Videos Vistos</h3>
            <p className="text-3xl font-bold">12,450</p>
            <p className="text-violet-100 text-sm">↗️ +25.7%</p>
          </div>
          
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Interacciones</h3>
            <p className="text-3xl font-bold">8,920</p>
            <p className="text-teal-100 text-sm">↗️ +31.2%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🕐 Horarios Más Activos</h3>
            <div className="space-y-2">
              {[
                { time: '9:00 - 10:00', percentage: 85 },
                { time: '14:00 - 15:00', percentage: 92 },
                { time: '19:00 - 20:00', percentage: 78 },
                { time: '21:00 - 22:00', percentage: 65 }
              ].map((slot, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{slot.time}</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 rounded-full h-2 w-20">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${slot.percentage}%`}}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{slot.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📱 Dispositivos Utilizados</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center space-x-2">
                  <span>💻</span>
                  <span className="text-sm">Desktop</span>
                </div>
                <span className="font-medium text-blue-600">58%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span className="text-sm">Mobile</span>
                </div>
                <span className="font-medium text-green-600">32%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <div className="flex items-center space-x-2">
                  <span>📟</span>
                  <span className="text-sm">Tablet</span>
                </div>
                <span className="font-medium text-purple-600">10%</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🌍 Ubicaciones Top</h3>
            <div className="space-y-2">
              {[
                { country: 'Argentina', users: 512, flag: '🇦🇷' },
                { country: 'México', users: 398, flag: '🇲🇽' },
                { country: 'Colombia', users: 234, flag: '🇨🇴' },
                { country: 'España', users: 189, flag: '🇪🇸' },
                { country: 'Chile', users: 156, flag: '🇨🇱' }
              ].map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{location.flag}</span>
                    <span className="text-sm text-gray-700">{location.country}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{location.users}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard 📊</h1>
            <p className="text-gray-600 mt-2">
              Insights profundos y métricas detalladas de tu plataforma educativa
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
              📊 Exportar Datos
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
              📈 Crear Reporte
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {currentView === 'overview' && <AnalyticsDashboard />}
        {currentView === 'students' && renderStudentAnalytics()}
        {currentView === 'courses' && renderCourseAnalytics()}
        {currentView === 'revenue' && renderRevenueAnalytics()}
        {currentView === 'engagement' && renderEngagementAnalytics()}
      </div>
    </div>
  );
};

export default AnalyticsPage;