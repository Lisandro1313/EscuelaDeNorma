import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string;
  user_role: string;
  action_type: string;
  action_description: string;
  entity_type: string | null;
  entity_id: number | null;
  entity_name: string | null;
  ip_address: string | null;
  created_at: string;
}

interface ActivityStats {
  total: number;
  byActionType: Record<string, number>;
  byUserRole: Record<string, number>;
  byEntityType: Record<string, number>;
  topUsers: Array<{ name: string; count: number }>;
  recentActivity: ActivityLog[];
}

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    actionType: '',
    entityType: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.actionType) params.append('actionType', filters.actionType);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await api.get(`/admin/activity-logs?${params.toString()}`);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/admin/activity-stats?${params.toString()}`);
      setStats(response.data);
      setShowStats(true);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const getActionTypeColor = (actionType: string) => {
    const colors: Record<string, string> = {
      auth: 'bg-blue-100 text-blue-800',
      course_create: 'bg-green-100 text-green-800',
      course_update: 'bg-yellow-100 text-yellow-800',
      course_delete: 'bg-red-100 text-red-800',
      enrollment: 'bg-purple-100 text-purple-800',
      payment: 'bg-emerald-100 text-emerald-800',
      forum_post: 'bg-indigo-100 text-indigo-800',
      forum_comment: 'bg-cyan-100 text-cyan-800',
      profile_update: 'bg-pink-100 text-pink-800',
      security: 'bg-orange-100 text-orange-800',
      admin_action: 'bg-rose-100 text-rose-800',
      lesson_create: 'bg-lime-100 text-lime-800',
      resource_upload: 'bg-teal-100 text-teal-800'
    };
    return colors[actionType] || 'bg-gray-100 text-gray-800';
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      auth: 'Autenticación',
      course_create: 'Crear Curso',
      course_update: 'Actualizar Curso',
      course_delete: 'Eliminar Curso',
      enrollment: 'Inscripción',
      payment: 'Pago',
      forum_post: 'Publicación Foro',
      forum_comment: 'Comentario Foro',
      profile_update: 'Actualizar Perfil',
      security: 'Seguridad',
      admin_action: 'Acción Admin',
      lesson_create: 'Crear Lección',
      resource_upload: 'Subir Recurso'
    };
    return labels[actionType] || actionType;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'text-red-600 font-semibold',
      profesor: 'text-blue-600 font-medium',
      alumno: 'text-gray-600'
    };
    return colors[role] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registro de Actividad</h2>
          <p className="text-sm text-gray-500 mt-1">
            Historial completo de todas las acciones en la plataforma
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Ver Estadísticas
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Acción
            </label>
            <select
              value={filters.actionType}
              onChange={(e) => setFilters({ ...filters, actionType: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todas</option>
              <option value="auth">Autenticación</option>
              <option value="course_create">Crear Curso</option>
              <option value="course_update">Actualizar Curso</option>
              <option value="course_delete">Eliminar Curso</option>
              <option value="enrollment">Inscripción</option>
              <option value="payment">Pago</option>
              <option value="forum_post">Publicación Foro</option>
              <option value="forum_comment">Comentario Foro</option>
              <option value="profile_update">Actualizar Perfil</option>
              <option value="security">Seguridad</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Entidad
            </label>
            <select
              value={filters.entityType}
              onChange={(e) => setFilters({ ...filters, entityType: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todas</option>
              <option value="user">Usuario</option>
              <option value="course">Curso</option>
              <option value="lesson">Lección</option>
              <option value="forum">Foro</option>
              <option value="payment">Pago</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={() => setFilters({ actionType: '', entityType: '', startDate: '', endDate: '', page: 1, limit: 50 })}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Estadísticas Modal */}
      {showStats && stats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Estadísticas de Actividad</h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total de actividades */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                <div className="text-sm font-medium text-indigo-600 mb-2">Total de Actividades</div>
                <div className="text-4xl font-bold text-indigo-900">{stats.total.toLocaleString()}</div>
              </div>

              {/* Por tipo de acción */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Por Tipo de Acción</h4>
                <div className="space-y-2">
                  {Object.entries(stats.byActionType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{getActionTypeLabel(type)}</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por rol de usuario */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Por Rol de Usuario</h4>
                <div className="space-y-2">
                  {Object.entries(stats.byUserRole).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center">
                      <span className={`text-sm ${getRoleColor(role)}`}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usuarios más activos */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Usuarios Más Activos</h4>
                <div className="space-y-2">
                  {stats.topUsers.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{user.name}</span>
                      <span className="font-semibold text-gray-900">{user.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Logs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Cargando logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay registros de actividad
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.user_name}</div>
                      <div className={`text-xs ${getRoleColor(log.user_role)}`}>
                        {log.user_role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionTypeColor(log.action_type)}`}>
                        {getActionTypeLabel(log.action_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.action_description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.entity_type && (
                        <div>
                          <div className="font-medium">{log.entity_type}</div>
                          {log.entity_name && (
                            <div className="text-xs text-gray-400">{log.entity_name}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip_address || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: Math.min(pagination.totalPages, filters.page + 1) })}
                disabled={filters.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((filters.page - 1) * filters.limit) + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(filters.page * filters.limit, pagination.total)}</span> de{' '}
                  <span className="font-medium">{pagination.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setFilters({ ...filters, page: pageNum })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          filters.page === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setFilters({ ...filters, page: Math.min(pagination.totalPages, filters.page + 1) })}
                    disabled={filters.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
