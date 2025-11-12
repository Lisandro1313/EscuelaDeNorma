import React, { useState, useEffect } from 'react';
import Gamification from '../components/Gamification/Gamification';

interface GamificationPageProps {}

const GamificationPage: React.FC<GamificationPageProps> = () => {
  const [currentStreak] = useState(4);
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 1, title: 'Completa 2 lecciones', progress: 1, target: 2, points: 50, completed: false },
    { id: 2, title: 'Participa en 3 foros', progress: 2, target: 3, points: 30, completed: false },
    { id: 3, title: 'Obtén 80% en un quiz', progress: 0, target: 1, points: 100, completed: false },
    { id: 4, title: 'Mira 2 horas de contenido', progress: 1.5, target: 2, points: 40, completed: false }
  ]);

  const [dailyChallenge, setDailyChallenge] = useState({
    title: 'Desafío Diario: Madrugador',
    description: 'Completa una lección antes de las 10 AM',
    points: 25,
    deadline: '10:00 AM',
    completed: false,
    timeLeft: '2h 30m'
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: '¡Nuevo Logro Desbloqueado!',
      message: 'Has obtenido "Perfeccionista" por sacar 100% en un quiz',
      icon: '🏆',
      time: '5 min',
      isNew: true
    },
    {
      id: 2,
      type: 'streak',
      title: 'Racha en Peligro',
      message: 'No olvides estudiar hoy para mantener tu racha de 4 días',
      icon: '🔥',
      time: '2h',
      isNew: false
    },
    {
      id: 3,
      type: 'challenge',
      title: 'Nuevo Desafío Disponible',
      message: 'Desafío semanal: "Maestro de la Consistencia"',
      icon: '⚡',
      time: '1d',
      isNew: false
    }
  ]);

  const motivationalQuotes = [
    "🌟 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.' - Robert Collier",
    "🚀 'Lo que obtenemos al alcanzar nuestros objetivos no es tan importante como en lo que nos convertimos.' - Zig Ziglar",
    "💪 'La disciplina es elegir entre lo que quieres ahora y lo que quieres más.' - Augusta F. Kantra",
    "🎯 'No se trata de ser perfecto, se trata de ser mejor que ayer.' - Anónimo",
    "⭐ 'El aprendizaje nunca agota la mente.' - Leonardo da Vinci"
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    // Rotar citas motivacionales cada 30 segundos
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [motivationalQuotes.length]);

  const completeGoal = (goalId: number) => {
    setWeeklyGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: true, progress: goal.target }
        : goal
    ));
  };

  const completeDailyChallenge = () => {
    setDailyChallenge(prev => ({ ...prev, completed: true }));
  };

  const dismissNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              🎮 Centro de Gamificación
            </h1>
            <p className="text-xl text-indigo-100 mb-6">
              Convierte tu aprendizaje en una aventura épica. ¡Gana puntos, desbloquea logros y sube de nivel!
            </p>
            
            {/* Cita motivacional */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-lg italic">
                {motivationalQuotes[currentQuote]}
              </p>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal - Gamification Component */}
          <div className="lg:col-span-3">
            <Gamification />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Desafío Diario */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">⚡ Desafío Diario</h3>
                <span className="text-xs text-gray-500">{dailyChallenge.timeLeft} restante</span>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">{dailyChallenge.title}</h4>
                <p className="text-sm text-gray-600">{dailyChallenge.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-600">+{dailyChallenge.points} pts</span>
                  <span className="text-sm text-gray-500">Hasta {dailyChallenge.deadline}</span>
                </div>
                
                {dailyChallenge.completed ? (
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-center text-sm font-medium">
                    ✅ ¡Completado!
                  </div>
                ) : (
                  <button
                    onClick={completeDailyChallenge}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Marcar como Completado
                  </button>
                )}
              </div>
            </div>

            {/* Objetivos Semanales */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Objetivos Semanales</h3>
              
              <div className="space-y-4">
                {weeklyGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-800">{goal.title}</h4>
                      <span className="text-xs text-purple-600">+{goal.points} pts</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(goal.progress, goal.target)}`}
                          style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {goal.progress}/{goal.target}
                      </span>
                    </div>
                    
                    {goal.completed ? (
                      <div className="text-xs text-green-600 font-medium">
                        ✅ Completado
                      </div>
                    ) : goal.progress >= goal.target ? (
                      <button
                        onClick={() => completeGoal(goal.id)}
                        className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition duration-200"
                      >
                        Reclamar Recompensa
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Racha Actual */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 text-white">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="text-xl font-bold">Racha Actual</h3>
                <div className="text-3xl font-bold my-2">{currentStreak} días</div>
                <p className="text-sm text-orange-100">
                  ¡Sigue así! Estudia hoy para mantener tu racha
                </p>
                
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded ${
                        i < currentStreak 
                          ? 'bg-white bg-opacity-80' 
                          : 'bg-white bg-opacity-20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Notificaciones</h3>
              
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay notificaciones nuevas
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border ${
                        notification.isNew ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg flex-shrink-0">{notification.icon}</span>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Acciones Rápidas</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📚</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Estudiar Ahora</h4>
                      <p className="text-xs text-gray-600">Continúa tu curso actual</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🧠</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Hacer Quiz</h4>
                      <p className="text-xs text-gray-600">Pon a prueba tus conocimientos</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">💬</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Participar en Foros</h4>
                      <p className="text-xs text-gray-600">Conecta con la comunidad</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🎥</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Ver Videos</h4>
                      <p className="text-xs text-gray-600">Contenido multimedia</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tips de Gamificación */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">💡 Consejo del Día</h3>
              <p className="text-sm">
                Para maximizar tus puntos, intenta completar actividades en diferentes categorías. 
                ¡La variedad es clave para desbloquear logros especiales!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;