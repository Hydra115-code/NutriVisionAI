/**
 * src/hooks/useAuthForm.ts
 * Hook para manejar el formulario de registro.
 * Usado por RegisterScreen.
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useRegisterForm() {
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [tieneDiabetes, setTieneDiabetes] = useState<'si' | 'no'>('no');
  const [tipoDiabetes, setTipoDiabetes] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = useCallback((dateStr: string) => {
    setFechaNacimiento(dateStr);
  }, []);

  const handleFinalize = useCallback(
    async (showWarning: (msg: string) => void) => {
      if (!nombre.trim()) {
        showWarning('El nombre es obligatorio.');
        return null;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        showWarning('Ingresa un correo electrónico válido.');
        return null;
      }
      if (password.length < 6) {
        showWarning('La contraseña debe tener al menos 6 caracteres.');
        return null;
      }
      if (password !== confirmPassword) {
        showWarning('Las contraseñas no coinciden.');
        return null;
      }
      if (!aceptaTerminos) {
        showWarning('Debes aceptar los términos y condiciones.');
        return null;
      }

      setIsSubmitting(true);
      try {
        const result = await register({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          password,
          peso: peso ? parseFloat(peso) : undefined,
          altura: altura ? parseFloat(altura) : undefined,
          tiene_diabetes: tieneDiabetes,
          tipo_diabetes: tieneDiabetes === 'si' ? tipoDiabetes : undefined,
          fecha_nacimiento: fechaNacimiento || undefined,
        });
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [nombre, email, password, confirmPassword, aceptaTerminos, peso, altura, tieneDiabetes, tipoDiabetes, fechaNacimiento, register]
  );

  return {
    nombre, setNombre,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    fechaNacimiento,
    peso, setPeso,
    altura, setAltura,
    tieneDiabetes, setTieneDiabetes,
    tipoDiabetes, setTipoDiabetes,
    aceptaTerminos, setAceptaTerminos,
    isSubmitting,
    handleDateChange,
    handleFinalize,
  };
}
