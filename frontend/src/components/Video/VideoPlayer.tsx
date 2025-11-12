import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface VideoNote {
  id: string;
  timestamp: number;
  text: string;
  createdAt: Date;
  userId: number;
  userName: string;
}

interface VideoMarker {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  type: 'chapter' | 'important' | 'exercise' | 'quiz';
}

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  courseId: number;
  classId: number;
  duration?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  description,
  courseId,
  classId,
  duration = 0
}) => {
  const { usuario } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Notas y marcadores
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [markers, setMarkers] = useState<VideoMarker[]>([]);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // Cargar marcadores de demostración
    const demoMarkers: VideoMarker[] = [
      {
        id: '1',
        timestamp: 30,
        title: 'Introducción',
        description: 'Bienvenida al curso',
        type: 'chapter'
      },
      {
        id: '2',
        timestamp: 180,
        title: 'Concepto Importante',
        description: 'Explicación de los fundamentos',
        type: 'important'
      },
      {
        id: '3',
        timestamp: 300,
        title: 'Ejercicio Práctico',
        description: 'Hora de practicar lo aprendido',
        type: 'exercise'
      },
      {
        id: '4',
        timestamp: 450,
        title: 'Quiz Intermedio',
        description: 'Evalúa tu comprensión',
        type: 'quiz'
      }
    ];

    // Cargar notas de demostración
    const demoNotes: VideoNote[] = [
      {
        id: '1',
        timestamp: 45,
        text: 'Esta explicación es muy clara, recordar para el examen',
        createdAt: new Date(),
        userId: usuario?.id || 1,
        userName: usuario?.nombre || 'Usuario'
      },
      {
        id: '2',
        timestamp: 200,
        text: 'Importante: revisar la documentación oficial',
        createdAt: new Date(),
        userId: usuario?.id || 1,
        userName: usuario?.nombre || 'Usuario'
      }
    ];

    setMarkers(demoMarkers);
    setNotes(demoNotes);

    // Configurar video
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setVideoDuration(video.duration);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [usuario]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (newVolume: number) => {
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      if (isMuted) {
        video.volume = volume;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const addNote = () => {
    if (newNote.trim() && usuario) {
      const note: VideoNote = {
        id: Date.now().toString(),
        timestamp: currentTime,
        text: newNote.trim(),
        createdAt: new Date(),
        userId: usuario.id,
        userName: usuario.nombre
      };
      
      setNotes(prev => [...prev, note].sort((a, b) => a.timestamp - b.timestamp));
      setNewNote('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'chapter': return 'bg-blue-500';
      case 'important': return 'bg-red-500';
      case 'exercise': return 'bg-green-500';
      case 'quiz': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'chapter': return '📖';
      case 'important': return '⚠️';
      case 'exercise': return '💻';
      case 'quiz': return '❓';
      default: return '📌';
    }
  };

  const progressPercentage = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setVideoDuration(videoRef.current.duration);
            }
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>

        {/* Video Overlay con controles */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end">
            {/* Barra de progreso con marcadores */}
            <div className="relative mb-4 mx-4">
              <div className="h-2 bg-gray-600 rounded-full cursor-pointer"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const percent = (e.clientX - rect.left) / rect.width;
                     seekTo(percent * videoDuration);
                   }}>
                <div 
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
                
                {/* Marcadores en la barra de progreso */}
                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className={`absolute top-0 w-3 h-3 rounded-full transform -translate-y-0.5 cursor-pointer ${getMarkerColor(marker.type)}`}
                    style={{ left: `${(marker.timestamp / videoDuration) * 100}%` }}
                    onClick={() => seekTo(marker.timestamp)}
                    title={marker.title}
                  />
                ))}
              </div>
            </div>

            {/* Controles principales */}
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300"
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
                
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={playbackSpeed}
                  onChange={(e) => changePlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-black/50 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
                
                <button
                  onClick={() => setShowNotesPanel(!showNotesPanel)}
                  className="text-white hover:text-gray-300"
                >
                  📝
                </button>
                
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="text-white hover:text-gray-300"
                >
                  {fullscreen ? '🗗' : '⛶'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información del video */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>📚 Curso ID: {courseId}</span>
            <span>🎥 Clase ID: {classId}</span>
            <span>⏱️ Duración: {formatTime(videoDuration)}</span>
          </div>
          
          <button
            onClick={() => setShowNotesPanel(!showNotesPanel)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            📝 {showNotesPanel ? 'Ocultar' : 'Mostrar'} Notas
          </button>
        </div>
      </div>

      {/* Panel de notas */}
      {showNotesPanel && (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Marcadores del video */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📍 Marcadores del Video
              </h3>
              
              <div className="space-y-3">
                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition duration-200"
                    onClick={() => seekTo(marker.timestamp)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMarkerIcon(marker.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{marker.title}</h4>
                        <p className="text-sm text-gray-600">{marker.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(marker.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas personales */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📝 Mis Notas
              </h3>
              
              {/* Agregar nueva nota */}
              <div className="bg-white border rounded-lg p-4 mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escribe una nota sobre este momento del video..."
                  className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    Timestamp: {formatTime(currentTime)}
                  </span>
                  
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm transition duration-200"
                  >
                    Agregar Nota
                  </button>
                </div>
              </div>
              
              {/* Lista de notas */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No tienes notas aún. ¡Agrega tu primera nota!
                  </p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition duration-200"
                      onClick={() => seekTo(note.timestamp)}
                    >
                      <p className="text-sm text-gray-900 mb-2">{note.text}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>👤 {note.userName}</span>
                        <span>⏱️ {formatTime(note.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;