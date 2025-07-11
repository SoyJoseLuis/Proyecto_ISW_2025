import { useState } from "react";
import { submitTokenGlobal } from "../../services/asistencia.service";

export function useSubmitToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const send = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const msg = await submitTokenGlobal(code);
      return msg;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}
