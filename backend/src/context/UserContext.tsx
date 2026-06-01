import React, { createContext, useContext, useState } from 'react';

// Estructura del usuario ACTUALIZADA
type Usuario = {
  usuario_id: number; // Cambié 'id' por 'usuario_id' para que coincida con tu base de datos
  nombre: string;
  apellido?: string;
  correo: string;
  peso_kg?: number | string | null;
  altura_cm?: number | string | null;
  sexo?: string;
  fecha_nacimiento?: string;
  objetivo?: string;
  tiene_diabetes?: string;
  tipo_diabetes?: string | null;
} | null;

type UserContextType = {
  usuario: Usuario;
  setUsuario: (u: Usuario) => void;
  cerrarSesion: () => void;
};

const UserContext = createContext<UserContextType>({
  usuario: null,
  setUsuario: () => {},
  cerrarSesion: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario>(null);

  const cerrarSesion = () => setUsuario(null);

  return (
    <UserContext.Provider value={{ usuario, setUsuario, cerrarSesion }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);