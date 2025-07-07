// frontend/src/hooks/asistencia/useAsistencia.js
import { useState, useEffect, useCallback } from "react";
//import * as asistenciaService from "../services/asistencia.service";
import * as asistenciaService from "../../services/asistencia.service";

/**
 * useAsistencia encapsula toda la lógica de llamadas y estado
 * para la página de Asistencia de una actividad.
 */
export function useAsistencia(idActividad) { //Como esto será por sesiones (Arreglar login) solo suaremos ese id obtenido del JWT
  // Estados
  const [token, setToken]             = useState(null);
  const [pendientes, setPendientes]   = useState([]);
  const [asistenciaFinal, setAsistenciaFinal] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // 1) Generar token
  const fetchToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const code = await asistenciaService.generateToken(idActividad);
      setToken(code);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [idActividad]);

  // 2) Enviar token
  const submitToken = useCallback(async (tokenCode) => {
    setLoading(true);
    setError(null);
    try {
      await asistenciaService.submitToken(idActividad, tokenCode);
      // tras enviar, refrescamos pendientes
      await refreshPendientes();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [idActividad]);

  // 3) Listar pendientes
  const refreshPendientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await asistenciaService.listPending(idActividad);
      setPendientes(list);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [idActividad]);

  // 4) Confirmar asistencia
  const confirmAttendance = useCallback(async (rutEstudiante, confirm) => {
    setLoading(true);
    setError(null);
    try {
      const record = await asistenciaService.confirmAttendance(
        idActividad,
        rutEstudiante,
        confirm
      );
      // tras confirmar, refrescamos finales
      await refreshAsistenciaFinal();
      return record;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [idActividad]);

  // 5) Listar asistencias definitivas
  const refreshAsistenciaFinal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await asistenciaService.listAll(idActividad);
      setAsistenciaFinal(list);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [idActividad]);

  // Al montar o cambiar idActividad, cargamos listas
  useEffect(() => {
    refreshPendientes();
    refreshAsistenciaFinal();
  }, [refreshPendientes, refreshAsistenciaFinal]);

  return {
    token,
    pendientes,
    asistenciaFinal,
    loading,
    error,
    fetchToken,
    submitToken,
    refreshPendientes,
    confirmAttendance,
    refreshAsistenciaFinal,
  };
}
