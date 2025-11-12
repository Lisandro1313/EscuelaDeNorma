import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CertificateGenerator from '../components/Certificates/CertificateGenerator';

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  grade: number;
  courseHours: number;
  certificateNumber: string;
  institutionName: string;
  status: 'generated' | 'downloaded' | 'verified';
  createdAt: Date;
}

interface CourseCompletion {
  id: number;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  grade: number;
  courseHours: number;
  status: 'completed' | 'pending_certificate';
}

const CertificatesPage: React.FC = () => {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<'generate' | 'my-certificates' | 'manage'>('generate');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [completedCourses, setCompletedCourses] = useState<CourseCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de demostración - cursos completados
      const demoCompletedCourses: CourseCompletion[] = [
        {
          id: 1,
          courseName: 'Desarrollo Web Frontend con React',
          instructorName: 'Dr. María García',
          completionDate: new Date('2024-01-15'),
          grade: 95,
          courseHours: 40,
          status: 'completed'
        },
        {
          id: 2,
          courseName: 'JavaScript Avanzado y TypeScript',
          instructorName: 'Ing. Carlos López',
          completionDate: new Date('2024-02-20'),
          grade: 88,
          courseHours: 35,
          status: 'pending_certificate'
        },
        {
          id: 3,
          courseName: 'Node.js y Express para Backend',
          instructorName: 'Dra. Ana Martín',
          completionDate: new Date('2024-03-10'),
          grade: 92,
          courseHours: 45,
          status: 'completed'
        }
      ];

      // Datos de demostración - certificados generados
      const demoCertificates: Certificate[] = [
        {
          id: 'CERT-1705324800000',
          studentName: usuario?.nombre || 'Juan Pérez',
          courseName: 'Desarrollo Web Frontend con React',
          instructorName: 'Dr. María García',
          completionDate: new Date('2024-01-15'),
          grade: 95,
          courseHours: 40,
          certificateNumber: 'CERT-1705324800000',
          institutionName: 'Campus Virtual Norma',
          status: 'downloaded',
          createdAt: new Date('2024-01-16')
        },
        {
          id: 'CERT-1708387200000',
          studentName: usuario?.nombre || 'Juan Pérez',
          courseName: 'Node.js y Express para Backend',
          instructorName: 'Dra. Ana Martín',
          grade: 92,
          courseHours: 45,
          certificateNumber: 'CERT-1708387200000',
          institutionName: 'Campus Virtual Norma',
          status: 'generated',
          completionDate: new Date('2024-03-10'),
          createdAt: new Date('2024-03-11')
        }
      ];

      setCompletedCourses(demoCompletedCourses);
      setCertificates(demoCertificates);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificateGenerated = (certificate: any) => {
    const newCertificate: Certificate = {
      ...certificate,
      status: 'generated',
      createdAt: new Date()
    };
    
    setCertificates(prev => [...prev, newCertificate]);
    
    // Actualizar estado del curso
    setCompletedCourses(prev => 
      prev.map(course => 
        course.courseName === certificate.courseName
          ? { ...course, status: 'completed' }
          : course
      )
    );
  };

  const downloadCertificate = (certificateId: string) => {
    setCertificates(prev =>
      prev.map(cert =>
        cert.id === certificateId
          ? { ...cert, status: 'downloaded' }
          : cert
      )
    );
  };

  const verifyCertificate = (certificateNumber: string) => {
    const certificate = certificates.find(cert => cert.certificateNumber === certificateNumber);
    if (certificate) {
      alert(`✅ Certificado verificado:\n\nEstudiante: ${certificate.studentName}\nCurso: ${certificate.courseName}\nFecha de finalización: ${certificate.completionDate.toLocaleDateString('es-ES')}\nCalificación: ${certificate.grade}%`);
      return true;
    } else {
      alert('❌ Certificado no encontrado. Verifique el número de certificado.');
      return false;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'generated': 'bg-blue-100 text-blue-800',
      'downloaded': 'bg-green-100 text-green-800',
      'verified': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'pending_certificate': 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      'generated': 'Generado',
      'downloaded': 'Descargado',
      'verified': 'Verificado',
      'completed': 'Completado',
      'pending_certificate': 'Pendiente Certificado'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando certificados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Certificados 🏆</h1>
          <p className="text-gray-600 mt-2">
            Genera, gestiona y verifica certificados de finalización de cursos
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('generate')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'generate'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔨 Generar Certificado
              </button>
              
              <button
                onClick={() => setActiveTab('my-certificates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-certificates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📜 Mis Certificados ({certificates.length})
              </button>
              
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ Gestionar y Verificar
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'generate' && (
          <div>
            {/* Cursos completados disponibles para certificar */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cursos Completados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.courseName}</h3>
                    <p className="text-sm text-gray-600 mb-1">Instructor: {course.instructorName}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      Finalizado: {course.completionDate.toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Calificación: {course.grade}% | {course.courseHours} horas
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {getStatusBadge(course.status)}
                      
                      {course.status === 'pending_certificate' && (
                        <span className="text-blue-600 text-sm font-medium">
                          ⬇️ Disponible para certificar
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generador de certificados */}
            <CertificateGenerator onCertificateGenerated={handleCertificateGenerated} />
          </div>
        )}

        {activeTab === 'my-certificates' && (
          <div>
            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar por curso, estudiante o número de certificado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="generated">Generados</option>
                    <option value="downloaded">Descargados</option>
                    <option value="verified">Verificados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de certificados */}
            <div className="space-y-4">
              {filteredCertificates.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-6xl mb-4">📜</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay certificados
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No se encontraron certificados con los filtros aplicados'
                      : 'Aún no tienes certificados generados. Completa un curso para obtener tu primer certificado.'
                    }
                  </p>
                </div>
              ) : (
                filteredCertificates.map((certificate) => (
                  <div key={certificate.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {certificate.courseName}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Estudiante:</strong> {certificate.studentName}</p>
                            <p><strong>Instructor:</strong> {certificate.instructorName}</p>
                            <p><strong>Institución:</strong> {certificate.institutionName}</p>
                          </div>
                          
                          <div>
                            <p><strong>Finalizado:</strong> {certificate.completionDate.toLocaleDateString('es-ES')}</p>
                            <p><strong>Calificación:</strong> {certificate.grade}%</p>
                            <p><strong>Horas:</strong> {certificate.courseHours} horas académicas</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center space-x-4">
                          {getStatusBadge(certificate.status)}
                          
                          <span className="text-xs text-gray-500">
                            Cert. No. {certificate.certificateNumber}
                          </span>
                          
                          <span className="text-xs text-gray-500">
                            Generado: {certificate.createdAt.toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        <button
                          onClick={() => downloadCertificate(certificate.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-200"
                        >
                          📥 Descargar
                        </button>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(certificate.certificateNumber);
                            alert('Número de certificado copiado al portapapeles');
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition duration-200"
                        >
                          📋 Copiar No.
                        </button>
                        
                        <button
                          onClick={() => verifyCertificate(certificate.certificateNumber)}
                          className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded text-sm transition duration-200"
                        >
                          ✅ Verificar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-8">
            {/* Verificador de certificados */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🔍 Verificador de Certificados
              </h2>
              
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Certificado
                </label>
                
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Ej: CERT-1705324800000"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        verifyCertificate((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="CERT-"]') as HTMLInputElement;
                      if (input?.value) {
                        verifyCertificate(input.value);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                  >
                    Verificar
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Introduce el número de certificado para verificar su autenticidad
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">📜</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {certificates.length}
                    </h3>
                    <p className="text-sm text-gray-600">Certificados Generados</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">📥</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {certificates.filter(c => c.status === 'downloaded').length}
                    </h3>
                    <p className="text-sm text-gray-600">Certificados Descargados</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600">⏳</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {completedCourses.filter(c => c.status === 'pending_certificate').length}
                    </h3>
                    <p className="text-sm text-gray-600">Cursos Pendientes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plantillas disponibles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🎨 Plantillas de Certificados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Moderno', preview: '🎨', color: 'blue' },
                  { name: 'Clásico', preview: '📜', color: 'green' },
                  { name: 'Elegante', preview: '✨', color: 'purple' },
                  { name: 'Minimalista', preview: '⭕', color: 'gray' }
                ].map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">{template.preview}</div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Plantilla {template.color}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;