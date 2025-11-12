import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../services/api';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  tipo: 'alumno' | 'profesor' | 'admin';
  avatar: string;
  cursosInscritos?: number[];
  cursosDictados?: number[];
  progreso?: { [cursoId: number]: number };
  especialidad?: string;
  permisos?: string[];
  telefono?: string;
  biografia?: string;
  fechaRegistro?: Date | string;
  cursosCompletados?: number;
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, nombre: string, tipo?: string, teacherCode?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  actualizarUsuario: (usuarioActualizado: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { user } = await authService.login(email, password);
      setUsuario(user);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string, tipo: string = 'alumno', teacherCode?: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { user } = await authService.register(email, password, nombre, tipo, teacherCode);
      setUsuario(user);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const actualizarUsuario = (usuarioActualizado: Usuario) => {
    setUsuario(usuarioActualizado);
  };

  // Verificar si hay usuario en localStorage al cargar
  React.useEffect(() => {
    const checkAuth = async () => {
      const usuarioGuardado = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      
      if (usuarioGuardado && token) {
        try {
          // Verificar que el token siga siendo válido
          const currentUser = await authService.getCurrentUser();
          setUsuario(currentUser);
        } catch (error) {
          // Token inválido, limpiar localStorage
          authService.logout();
        }
      }
    };

    checkAuth();
  }, []);

  const value = {
    usuario,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!usuario,
    actualizarUsuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};