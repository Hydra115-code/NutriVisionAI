import { useState } from 'react';

export default function AppNutrivision() {
    const [registrado, setRegistrado] = useState(false); // Controla qué pantalla ver

    // Si el usuario ya se registró, mostramos la cámara
    if (registrado) {
        return <AnalizadorComida />;
    }

    // Si no, mostramos el formulario de registro
    return <RegistroNutrivision alFinalizar={() => setRegistrado(true)} />;
}

// --- TU NUEVO COMPONENTE DE CÁMARA ---
function AnalizadorComida() {
    const [fotoComida, setFotoComida] = useState(null);

    const capturarComida = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            setFotoComida(URL.createObjectURL(archivo));
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>📸 Analizador de Alimentos</h3>
            {/* Aquí va el resto del código de la cámara que te pasé... */}
        </div>
    );
}