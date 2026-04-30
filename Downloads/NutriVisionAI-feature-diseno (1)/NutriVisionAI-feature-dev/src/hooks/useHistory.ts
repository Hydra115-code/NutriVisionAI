/**
 * src/hooks/useHistory.ts
 * Hook personalizado que carga el progreso nutricional del día y el
 * resumen semanal de 7 días para la pantalla de Registros (explore).
 * Se conecta directamente a la base de datos local SQLite.
 */

import { useCallback, useState } from 'react';
import { obtenerMetasLocal, obtenerProgresoHoyLocal, obtenerProgresoSemanalLocal } from '../database/localDb';
import { DailyProgress, NutritionGoals, WeeklyDay } from '../types';

// Metas nutricionales por defecto cuando el usuario no tiene biometría configurada.
const DEFAULT_GOALS: NutritionGoals = {
    calorias: 2000,
    proteinas: 150,
    carbos: 200,
    grasas: 65,
};

export interface UseHistoryReturn {
    /** Totales de consumo del día y metas calóricas. */
    datosHoy: DailyProgress;
    /** Arreglo de 7 días con pares día-caloría para la gráfica de barras. */
    semana: WeeklyDay[];
    /** Verdadero mientras cualquier solicitud de datos esté en progreso. */
    cargando: boolean;
    /** Vuelve a cargar todos los datos de progreso desde SQLite. Llámalo al enfocar la pantalla. */
    cargarDatos: (usuario_id: number) => Promise<void>;
}

/**
 * Hook para la carga y exposición de datos de progreso nutricional diario y semanal.
 * Al haberse eliminado el backend, depende enteramente de SQLite local.
 */
export function useHistory(): UseHistoryReturn {
    const [cargando, setCargando] = useState(false);
    const [semana, setSemana] = useState<WeeklyDay[]>([]);
    const [datosHoy, setDatosHoy] = useState<DailyProgress>({
        caloriasConsumidas: 0,
        caloriasMeta: DEFAULT_GOALS.calorias,
        proteinas: 0,
        proteinasMeta: DEFAULT_GOALS.proteinas,
        carbos: 0,
        carbosMeta: DEFAULT_GOALS.carbos,
        grasas: 0,
        grasasMeta: DEFAULT_GOALS.grasas,
    });

    const cargarDatos = useCallback(async (usuario_id: number) => {
        if (!usuario_id) return;
        setCargando(true);

        try {
            const [localHoy, localSemana, localMetas] = await Promise.all([
                obtenerProgresoHoyLocal(usuario_id),
                obtenerProgresoSemanalLocal(usuario_id),
                obtenerMetasLocal(usuario_id)
            ]);

            const metas = localMetas || DEFAULT_GOALS;

            setDatosHoy({
                caloriasConsumidas: localHoy.calorias,
                proteinas: localHoy.proteinas,
                carbos: localHoy.carbos,
                grasas: localHoy.grasas,
                caloriasMeta: metas.calorias,
                proteinasMeta: metas.proteinas,
                carbosMeta: metas.carbos,
                grasasMeta: metas.grasas,
            });

            setSemana(localSemana);
        } catch (e) {
            console.error('Error in useHistory:', e);
        } finally {
            setCargando(false);
        }
    }, []);

    return { datosHoy, semana, cargando, cargarDatos };
}
