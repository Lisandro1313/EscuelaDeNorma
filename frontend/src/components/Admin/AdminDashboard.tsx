import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalForumPosts: number;
  totalCertificates: number;
  systemUptime: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  tipo: 'estudiante' | 'profesor' | 'admin';
  fechaRegistro: string;
  activo: boolean;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'users' | 'system'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/users')
      ]);
      setStats(statsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona y supervisa la plataforma Campus Norma</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('dashboard')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                selectedTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                selectedTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 Usuarios
            </button>
            <button
              onClick={() => setSelectedTab('system')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                selectedTab === 'system'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ⚙️ Sistema
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {selectedTab === 'dashboard' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.activeUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Cursos</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalCourses}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🏆</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Certificados</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalCertificates}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-green-600">✅</span>
                    <span className="ml-2 text-sm text-gray-600">Sistema de registro implementado correctamente</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-600">👥</span>
                    <span className="ml-2 text-sm text-gray-600">Panel de gestión de usuarios activado</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600">🔧</span>
                    <span className="ml-2 text-sm text-gray-600">Navegación administrativa configurada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Gestión de Usuarios</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.tipo === 'admin' ? 'bg-red-100 text-red-800' :
                            user.tipo === 'profesor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.fechaRegistro).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`mr-2 ${
                              user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {user.activo ? 'Desactivar' : 'Activar'}
                          </button>
                          {user.tipo !== 'admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {selectedTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Configuración del Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Registro de Usuarios</h4>
                      <p className="text-sm text-gray-500">Permitir nuevos registros en la plataforma</p>
                    </div>
                    <button className="bg-green-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notificaciones por Email</h4>
                      <p className="text-sm text-gray-500">Enviar notificaciones automáticas por correo</p>
                    </div>
                    <button className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Modo Mantenimiento</h4>
                      <p className="text-sm text-gray-500">Activar modo mantenimiento para la plataforma</p>
                    </div>
                    <button className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Información del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Versión</dt>
                    <dd className="mt-1 text-sm text-gray-900">Campus Norma v1.0</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tiempo de actividad</dt>
                    <dd className="mt-1 text-sm text-gray-900">{stats?.systemUptime || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Último reinicio</dt>
                    <dd className="mt-1 text-sm text-gray-900">Hoy, 08:00 AM</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado del servidor</dt>
                    <dd className="mt-1 text-sm text-green-600">🟢 Operativo</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};