/**
 * src/hooks/useAuth.ts
 * Hook personalizado que expone las acciones de autenticación a los componentes de la interfaz.
 * Conecta la capa de authService con el estado global de UserContext.
 * Los componentes llaman a login / logout / register y manejan el resultado.
 */

import { useCallback, useState } from 'react';
import { useUser } from '../context/UserContext';
import { loginUser, logoutUser as logoutService, registerUser } from '../services/authService';
import { AuthResponse } from '../types';

export interface UseAuthReturn {
    /** Verdadero mientras una solicitud de autenticación esté en progreso. */
    loading: boolean;
    /** Autentica al usuario y actualiza el UserContext. Retorna la respuesta de la API local. */
    login: (correo: string, password: string) => Promise<AuthResponse>;
    /** Limpia el contexto de usuario y el caché local. */
    logout: () => Promise<void>;
    /** Registra un nuevo usuario y actualiza el UserContext. Retorna la respuesta de la API local. */
    register: (payload: { nombre: string; apellido: string; correo: string; password: string;[key: string]: any; }) => Promise<AuthResponse>;
}

/**
 * Hook para la gestión del ciclo de vida de la autenticación.
 * Debe ser utilizado dentro de un componente envuelto por UserProvider.
 */
export function useAuth(): UseAuthReturn {
    const { setUsuario, cerrarSesion } = useUser() as any;
    const [loading, setLoading] = useState(false);

    const login = useCallback(
        async (correo: string, password: string): Promise<AuthResponse> => {
            setLoading(true);
            try {
                const response = await loginUser(correo, password);
                if (response.ok && response.usuario) {
                    setUsuario(response.usuario);
                }
                return response;
            } finally {
                setLoading(false);
            }
        },
        [setUsuario]
    );

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await logoutService();
            cerrarSesion();
        } finally {
            setLoading(false);
        }
    }, [cerrarSesion]);

    const register = useCallback(
        async (payload: { nombre: string; apellido: string; correo: string; password: string;[key: string]: any; }): Promise<AuthResponse> => {
            setLoading(true);
            try {
                const response = await registerUser(payload);
                if (response.ok && response.usuario) {
                    setUsuario(response.usuario);
                }
                return response;
            } finally {
                setLoading(false);
            }
        },
        [setUsuario]
    );

    return { loading, login, logout, register };
}
