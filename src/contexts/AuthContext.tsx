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
//      - isFirstLaunch: true si es la primera vez que se abre la app
//      - login(): verificar credenciales y crear sesión
//      - register(): crear cuenta nueva y crear sesión
//      - logout(): cerrar sesión
//      - isLoading: true mientras se inicializa la BD
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  initDatabase, 
  loginUser, 
  registerUser, 
  updateUserProfile,
  User, 
  RegisterData 
} from '../services/database';

const SESSION_KEY = '@nutrivision_session_user_id';
const FIRST_LAUNCH_KEY = '@nutrivision_first_launch';

// --- DEFINICIÓN DEL TIPO DEL CONTEXTO ---
interface AuthContextType {
  user: User | null;              // Usuario actual (null si no está logueado)
  isAuthenticated: boolean;       // Atajo para saber si hay sesión activa
  isLoading: boolean;             // True mientras se inicializa la BD
  isFirstLaunch: boolean;         // True si es la primera vez que se abre la app
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { nombre?: string; peso?: number; altura?: number; tiene_diabetes?: string; tipo_diabetes?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  markOnboardingDone: () => Promise<void>;
}

// --- CREAR EL CONTEXTO ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// COMPONENTE PROVIDER
// ============================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  // --- INICIALIZACIÓN ---
  // Inicializa la BD, restaura la sesión guardada y detecta primer lanzamiento.
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();

        // Detectar si es la primera vez que se abre la app
        const launched = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
        if (launched === null) {
          setIsFirstLaunch(true);
          // No marcamos como "ya lanzado" aquí; lo hace markOnboardingDone()
        }

        // Restaurar sesión guardada
        const savedId = await AsyncStorage.getItem(SESSION_KEY);
        if (savedId) {
          const { getUserById } = await import('../services/database');
          const savedUser = await getUserById(Number(savedId));
          if (savedUser) {
            setUser(savedUser);
          } else {
            await AsyncStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error('Error inicializando la BD:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setup();
  }, []);

  // ============================================================
  // FUNCIÓN DE LOGIN
  // ============================================================
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const loggedUser = await loginUser(email, password);
      
      if (loggedUser) {
        setUser(loggedUser);
        // Guardar sesión para restaurarla al reiniciar la app
        await AsyncStorage.setItem(SESSION_KEY, String(loggedUser.id));
        return { success: true, message: 'Inicio de sesión exitoso.' };
      } else {
        return { success: false, message: 'Correo o contraseña incorrectos.' };
      }
    } catch (error) {
      console.error('Error en login:', error);
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
          await AsyncStorage.setItem(SESSION_KEY, String(loggedUser.id));
        }
        return { success: true, message: '¡Cuenta creada exitosamente!' };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, message: 'Error al crear la cuenta. Intenta de nuevo.' };
    }
  };

  // ============================================================
  // FUNCIÓN DE ACTUALIZAR PERFIL
  // ============================================================
  const updateProfile = async (data: { nombre?: string; peso?: number; altura?: number; tiene_diabetes?: string; tipo_diabetes?: string }): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No hay sesión activa.' };
    }

    try {
      const result = await updateUserProfile(user.id, data);
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, message: 'Error al actualizar perfil. Intenta de nuevo.' };
    }
  };

  // ============================================================
  // FUNCIÓN DE LOGOUT
  // ============================================================
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  // ============================================================
  // MARCAR ONBOARDING COMO COMPLETADO
  // ============================================================
  const markOnboardingDone = async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'done');
    setIsFirstLaunch(false);
  };

  // --- VALOR DEL CONTEXTO ---
  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    isFirstLaunch,
    login,
    register,
    updateProfile,
    logout,
    markOnboardingDone,
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