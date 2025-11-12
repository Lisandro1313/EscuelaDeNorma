import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FileUpload from '../FileUpload/FileUpload';

const FileManager: React.FC = () => {
  const { usuario } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>();

  // Cursos de demostración
  const demoCourses = [
    { id: 1, name: 'Desarrollo Web Frontend con React' },
    { id: 2, name: 'Diseño UX/UI Profesional' },
    { id: 3, name: 'Marketing Digital Avanzado' },
    { id: 4, name: 'Python para Data Science' },
  ];

  const handleUploadSuccess = (file: any) => {
    console.log('Archivo subido exitosamente:', file);
    // Aquí podrías actualizar el estado global o hacer alguna acción adicional
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-6 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📁 Gestión de Archivos
        </h1>
        <p className="text-gray-600">
          Sube y gestiona archivos para tus cursos. Compatible con documentos, videos e imágenes.
        </p>
      </div>

      {/* Selección de curso (para profesores) */}
      {usuario?.tipo === 'profesor' && (
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            📚 Seleccionar Curso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedCourse(undefined)}
              className={`p-4 border rounded-lg text-center transition duration-200 ${
                selectedCourse === undefined
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">📂</div>
              <div className="font-medium">General</div>
              <div className="text-sm text-gray-500">Sin curso específico</div>
            </button>
            
            {demoCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`p-4 border rounded-lg text-center transition duration-200 ${
                  selectedCourse === course.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-medium text-sm">{course.name}</div>
                <div className="text-xs text-gray-500">Curso #{course.id}</div>
              </button>
            ))}
          </div>
          
          {selectedCourse !== undefined && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-blue-700 text-sm">
                📌 Subiendo archivos para: <strong>
                  {demoCourses.find(c => c.id === selectedCourse)?.name}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Componente de subida de archivos */}
      <div className="bg-white shadow rounded-lg p-6">
        <FileUpload
          courseId={selectedCourse}
          onUploadSuccess={handleUploadSuccess}
          acceptedTypes={['.pdf', '.doc', '.docx', '.mp4', '.avi', '.mov', '.jpg', '.jpeg', '.png', '.zip', '.rar']}
          maxSizeMB={100}
        />
      </div>

      {/* Información de tipos de archivo */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          📋 Tipos de Archivo Soportados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">📄 Documentos</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PDF (.pdf)</li>
              <li>• Word (.doc, .docx)</li>
              <li>• PowerPoint (.ppt, .pptx)</li>
              <li>• Excel (.xls, .xlsx)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">🎥 Videos</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• MP4 (.mp4)</li>
              <li>• AVI (.avi)</li>
              <li>• MOV (.mov)</li>
              <li>• WMV (.wmv)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">🖼️ Imágenes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• JPEG (.jpg, .jpeg)</li>
              <li>• PNG (.png)</li>
              <li>• GIF (.gif)</li>
              <li>• SVG (.svg)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">📦 Archivos</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ZIP (.zip)</li>
              <li>• RAR (.rar)</li>
              <li>• 7Z (.7z)</li>
              <li>• TAR (.tar, .gz)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-blue-500 text-xl mr-3">💡</span>
            <div>
              <h4 className="text-blue-800 font-medium mb-1">Consejos para subir archivos</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Tamaño máximo: 100MB por archivo</li>
                <li>• Los videos se procesan automáticamente para optimizar la reproducción</li>
                <li>• Los PDFs mantienen su calidad original</li>
                <li>• Puedes subir múltiples archivos uno por uno</li>
                <li>• Los archivos se almacenan de forma segura en el servidor</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas para profesores */}
      {usuario?.tipo === 'profesor' && (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            📊 Estadísticas de Archivos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">24</div>
              <div className="text-sm text-blue-700">Archivos Totales</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">2.1GB</div>
              <div className="text-sm text-green-700">Espacio Utilizado</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">856</div>
              <div className="text-sm text-purple-700">Descargas Este Mes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;