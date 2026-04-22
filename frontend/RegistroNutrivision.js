import { useState } from 'react';

export default function RegistroNutrivision() {
    const [form, setForm] = useState({
        nombre: '', correo: '', password: '', edad: '', peso_kg: '', altura_cm: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const enviarRegistro = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            
            // RESULTADO VISIBLE (Requerimiento de la imagen)
            if (res.ok) {
                setStatus(`✅ ${data.mensaje}. ID asignado: ${data.id}`);
            } else {
                setStatus(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            setStatus("❌ No se pudo conectar con el servidor");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Registro Nutrivision</h2>
            <form onSubmit={enviarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <input name="nombre" placeholder="Nombre completo" onChange={handleChange} required />
                <input name="correo" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
                <input name="edad" type="number" placeholder="Edad" onChange={handleChange} />
                <input name="peso_kg" type="number" step="0.1" placeholder="Peso (kg)" onChange={handleChange} />
                <input name="altura_cm" type="number" step="0.1" placeholder="Altura (cm)" onChange={handleChange} />
                <button type="submit">Crear Cuenta</button>
            </form>
            {status && <p><strong>{status}</strong></p>}
        </div>
    );
}