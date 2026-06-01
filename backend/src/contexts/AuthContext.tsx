// ============================================================
// CONTEXTO DE AUTENTICACIÓN - AuthContext.tsx
// ============================================================
// Este archivo proporciona un "contexto" de React que permite
// a CUALQUIER pantalla de la app acceder a las funciones de
// autenticación (login, registro, logout) sin pasar props.
//
// ¿Cómo funciona?
//   1. AuthProvider envuelve toda la app en _layout.tsx
//   2. Cualquier componente hijo usa useAuth() para acceder a:
//      - user: datos del usuario logueado (o null)
//      - isAuthenticated: true/false si hay sesión activa
//      - login(): verificar credenciales y crear sesión
//      - register(): crear cuenta nueva y crear sesión
//      - logout(): cerrar sesión
//      - isLoading: true mientras se inicializa la BD
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initDatabase, 
  loginUser, 
  registerUser, 
  updateUserProfile,
  User, 
  RegisterData 
} from '../services/database';

// --- DEFINICIÓN DEL TIPO DEL CONTEXTO ---
// Describe todas las propiedades y funciones que el contexto expone
interface AuthContextType {
  user: User | null;              // Usuario actual (null si no está logueado)
  isAuthenticated: boolean;       // Atajo para saber si hay sesión activa
  isLoading: boolean;             // True mientras se inicializa la BD
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { nombre?: string; peso?: number; altura?: number; tiene_diabetes?: string; tipo_diabetes?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// --- CREAR EL CONTEXTO ---
// Se inicializa con undefined; se llenará cuando AuthProvider se monte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// COMPONENTE PROVIDER
// ============================================================
// Envuelve la app y provee el estado de autenticación a todos
// los componentes hijos. Se coloca en _layout.tsx.
// ============================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado del usuario actual (null = no logueado)
  const [user, setUser] = useState<User | null>(null);
  // Estado de carga (true mientras se inicializa la BD)
  const [isLoading, setIsLoading] = useState(true);

  // --- INICIALIZACIÓN ---
  // Al montar el componente, inicializa la base de datos SQLite.
  // Esto crea la tabla 'users' si no existe.
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase(); // Crear la tabla si no existe
        console.log('️ Base de datos lista');
      } catch (error) {
        console.error(' Error inicializando la BD:', error);
      } finally {
        setIsLoading(false); // Ya terminó la inicialización
      }
    }
    setup();
  }, []); // [] = solo se ejecuta una vez al montar

  // ============================================================
  // FUNCIÓN DE LOGIN
  // ============================================================
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const loggedUser = await loginUser(email, password);
      
      if (loggedUser) {
        setUser(loggedUser);
        return { success: true, message: 'Inicio de sesión exitoso.' };
      } else {
        return { success: false, message: 'Correo o contraseña incorrectos.' };
      }
    } catch (error) {
      console.error(' Error en login:', error);
      return { success: false, message: 'Error al iniciar sesión. Intenta de nuevo.' };
    }
  };

  // ============================================================
  // FUNCIÓN DE REGISTRO
  // ============================================================
  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await registerUser(data);
      
      if (result.success) {
        const loggedUser = await loginUser(data.email, data.password);
        if (loggedUser) {
          setUser(loggedUser);
        }
        return { success: true, message: '¡Cuenta creada exitosamente!' };
      } else {
        return result;
      }
    } catch (error) {
      console.error(' Error en registro:', error);
      return { success: false, message: 'Error al crear la cuenta. Intenta de nuevo.' };
    }
  };

  // ============================================================
  // FUNCIÓN DE ACTUALIZAR PERFIL
  // ============================================================
  // Actualiza los datos del usuario en la BD y refresca el estado.
  // ============================================================
  const updateProfile = async (data: { nombre?: string; peso?: number; altura?: number; tiene_diabetes?: string; tipo_diabetes?: string }): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No hay sesión activa.' };
    }

    try {
      const result = await updateUserProfile(user.id, data);
      
      if (result.success && result.user) {
        setUser(result.user); // Refrescar el estado con los datos actualizados
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error(' Error al actualizar perfil:', error);
      return { success: false, message: 'Error al actualizar perfil. Intenta de nuevo.' };
    }
  };

  // ============================================================
  // FUNCIÓN DE LOGOUT
  // ============================================================
  const logout = () => {
    setUser(null);
    console.log(' Sesión cerrada');
  };

  // --- VALOR DEL CONTEXTO ---
  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    updateProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOK PERSONALIZADO: useAuth()
// ============================================================
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}