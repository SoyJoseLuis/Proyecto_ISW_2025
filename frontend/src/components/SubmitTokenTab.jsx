import { useState } from 'react';
import { Input, Button, message/*, Spin*/ } from 'antd';
import { useSubmitToken } from '../hooks/asistencia/useSubmitToken';

export default function SubmitTokenTab() {
  const [code, setCode] = useState('');
  const { send, loading, error } = useSubmitToken();

  const onSubmit = async () => {
    try {
      await send(code);
      message.success("Asistencia registrada con éxito");
      setCode('');
    } catch {
      message.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 300 }}>
      <Input
        placeholder="Ingrese token"
        value={code}
        onChange={e => setCode(e.target.value)}
        disabled={loading}
      />
      <Button
        type="primary"
        onClick={onSubmit}
        loading={loading}
        style={{ marginTop: 8 }}
      >
        Enviar
      </Button>
    </div>
  );
}
