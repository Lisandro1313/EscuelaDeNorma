import React, { useState, useEffect } from 'react';
import { courseService } from '../services/api';

interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  publicado: boolean;
  modulos: Module[];
}

interface Module {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  publicado: boolean;
  lecciones: Lesson[];
}

interface Lesson {
  id: number;
  titulo: string;
  contenido: string;
  tipo: 'texto' | 'video' | 'documento' | 'quiz';
  orden: number;
  duracion: number;
  publicado: boolean;
  recursos: Resource[];
}

interface Resource {
  id: number;
  nombre: string;
  tipo: string;
  url: string;
  tamaño: string;
}

interface CourseContentManagerProps {
  courseId: number;
  onClose: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onClose }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [newModuleForm, setNewModuleForm] = useState(false);
  const [newLessonForm, setNewLessonForm] = useState<number | null>(null);

  // Estados para formularios
  const [moduleForm, setModuleForm] = useState({ titulo: '', descripcion: '' });
  const [lessonForm, setLessonForm] = useState({
    titulo: '',
    contenido: '',
    tipo: 'texto' as const,
    duracion: 0
  });

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  const loadCourseContent = async () => {
    try {
      const response = await courseService.getCourseContent(courseId);
      setCourse(response);
    } catch (error) {
      console.error('Error loading course content:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const createModule = async () => {
    try {
      await courseService.createModule(courseId, moduleForm);
      await loadCourseContent();
      setNewModuleForm(false);
      setModuleForm({ titulo: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const updateModule = async (moduleId: number) => {
    try {
      await courseService.updateModule(moduleId, moduleForm);
      await loadCourseContent();
      setEditingModule(null);
      setModuleForm({ titulo: '', descripcion: '' });
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const publishModule = async (moduleId: number, publicado: boolean) => {
    try {
      await courseService.updateModule(moduleId, { publicado });
      await loadCourseContent();
    } catch (error) {
      console.error('Error publishing module:', error);
    }
  };

  const createLesson = async (moduleId: number) => {
    try {
      await courseService.createLesson(moduleId, lessonForm);
      await loadCourseContent();
      setNewLessonForm(null);
      setLessonForm({ titulo: '', contenido: '', tipo: 'texto', duracion: 0 });
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const publishLesson = async (lessonId: number, publicado: boolean) => {
    try {
      await courseService.updateLesson(lessonId, { publicado });
      await loadCourseContent();
    } catch (error) {
      console.error('Error publishing lesson:', error);
    }
  };

  const publishCourse = async (publicado: boolean) => {
    try {
      await courseService.publishCourse(courseId, publicado);
      await loadCourseContent();
    } catch (error) {
      console.error('Error publishing course:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando contenido del curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-red-600">Error al cargar el curso</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{course.nombre}</h2>
            <p className="opacity-90">{course.descripcion}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => publishCourse(!course.publicado)}
              className={`px-4 py-2 rounded font-medium ${
                course.publicado 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {course.publicado ? 'Despublicar' : 'Publicar'} Curso
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Agregar Módulo */}
          <div className="mb-6">
            {!newModuleForm ? (
              <button
                onClick={() => setNewModuleForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ➕ Agregar Módulo
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold mb-4">Nuevo Módulo</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título del módulo"
                    value={moduleForm.titulo}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, titulo: e.target.value }))}
                    className="w-full p-3 border rounded-lg"
                  />
                  <textarea
                    placeholder="Descripción del módulo"
                    value={moduleForm.descripcion}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full p-3 border rounded-lg h-24"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createModule}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={() => {
                        setNewModuleForm(false);
                        setModuleForm({ titulo: '', descripcion: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Módulos */}
          <div className="space-y-4">
            {course.modulos.map((modulo) => (
              <div key={modulo.id} className="border rounded-lg">
                {/* Header del Módulo */}
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleModule(modulo.id)}
                      className="p-1 hover:bg-gray-200 rounded text-lg"
                    >
                      {expandedModules.includes(modulo.id) ? '🔽' : '▶️'}
                    </button>
                    {editingModule === modulo.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={moduleForm.titulo}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, titulo: e.target.value }))}
                          className="flex-1 p-2 border rounded"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold">{modulo.titulo}</h3>
                        <p className="text-sm text-gray-600">{modulo.descripcion}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      modulo.publicado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {modulo.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                    {editingModule === modulo.id ? (
                      <>
                        <button
                          onClick={() => updateModule(modulo.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          💾
                        </button>
                        <button
                          onClick={() => setEditingModule(null)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingModule(modulo.id);
                            setModuleForm({ titulo: modulo.titulo, descripcion: modulo.descripcion });
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => publishModule(modulo.id, !modulo.publicado)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          ✅
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Contenido del Módulo */}
                {expandedModules.includes(modulo.id) && (
                  <div className="p-4">
                    {/* Agregar Lección */}
                    {newLessonForm !== modulo.id ? (
                      <button
                        onClick={() => setNewLessonForm(modulo.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
                      >
                        ➕ Agregar Lección
                      </button>
                    ) : (
                      <div className="bg-blue-50 p-4 rounded-lg border mb-4">
                        <h4 className="font-semibold mb-4">Nueva Lección</h4>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Título de la lección"
                            value={lessonForm.titulo}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, titulo: e.target.value }))}
                            className="w-full p-3 border rounded-lg"
                          />
                          <textarea
                            placeholder="Contenido de la lección"
                            value={lessonForm.contenido}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, contenido: e.target.value }))}
                            className="w-full p-3 border rounded-lg h-32"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <select
                              value={lessonForm.tipo}
                              onChange={(e) => setLessonForm(prev => ({ ...prev, tipo: e.target.value as any }))}
                              className="p-3 border rounded-lg"
                            >
                              <option value="texto">📝 Texto</option>
                              <option value="video">🎥 Video</option>
                              <option value="documento">📄 Documento</option>
                              <option value="quiz">❓ Quiz</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Duración (minutos)"
                              value={lessonForm.duracion}
                              onChange={(e) => setLessonForm(prev => ({ ...prev, duracion: parseInt(e.target.value) || 0 }))}
                              className="p-3 border rounded-lg"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => createLesson(modulo.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              💾 Guardar
                            </button>
                            <button
                              onClick={() => {
                                setNewLessonForm(null);
                                setLessonForm({ titulo: '', contenido: '', tipo: 'texto', duracion: 0 });
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lista de Lecciones */}
                    <div className="space-y-3">
                      {modulo.lecciones.map((leccion) => (
                        <div key={leccion.id} className="bg-white border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {leccion.tipo === 'video' && '🎥'}
                                  {leccion.tipo === 'texto' && '📝'}
                                  {leccion.tipo === 'documento' && '📄'}
                                  {leccion.tipo === 'quiz' && '❓'}
                                </span>
                                <span className="font-medium">{leccion.titulo}</span>
                              </div>
                              <span className="text-sm text-gray-500">({leccion.duracion} min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                leccion.publicado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {leccion.publicado ? 'Publicado' : 'Borrador'}
                              </span>
                              <button
                                onClick={() => publishLesson(leccion.id, !leccion.publicado)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                              >
                                ✅
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{leccion.contenido}</p>
                          
                          {/* Recursos de la lección */}
                          {leccion.recursos.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <h5 className="text-sm font-semibold mb-2">Recursos:</h5>
                              <div className="space-y-1">
                                {leccion.recursos.map((recurso) => (
                                  <div key={recurso.id} className="flex items-center gap-2 text-sm">
                                    <span>🔗</span>
                                    <span>{recurso.nombre}</span>
                                    <span className="text-gray-500">({recurso.tamaño})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {course.modulos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📚</div>
              <p>Aún no has creado ningún módulo para este curso.</p>
              <p className="text-sm">¡Comienza agregando tu primer módulo!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentManager;