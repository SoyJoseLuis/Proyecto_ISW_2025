// src/components/ConfirmAttendanceModal.jsx
import { useState, useEffect } from 'react';
import { Modal, List, Checkbox, Button, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function ConfirmAttendanceModal({
  open,
  pendingList = [],
  onConfirm,
  onConfirmMultiple,
  onClose,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open) setSelected([]);
  }, [open]);

  // Usamos el RUT internamente como key/valor, pero no lo mostramos
  const allKeys = pendingList.map(item => item.estudiante.rutEstudiante);
  const onSelectAll = e =>
    setSelected(e.target.checked ? allKeys : []);

  return (
    <Modal
      open={open}
      title="Confirmar Asistencia"
      onCancel={onClose}
      closeIcon={<CloseOutlined style={{ fontSize: 16 }} />}
      footer={null}
    >
      <Checkbox
        indeterminate={
          selected.length > 0 &&
          selected.length < allKeys.length
        }
        checked={
          selected.length === allKeys.length &&
          allKeys.length > 0
        }
        onChange={onSelectAll}
        style={{ transform: 'scale(1.2)', marginBottom: 12 }}
      >
        Seleccionar todos
      </Checkbox>

      <List
        dataSource={pendingList}
        renderItem={item => {
          const rut = item.estudiante.rutEstudiante;
          const nombre = item.estudiante.nombreEstudiante;
          return (
            <List.Item key={rut}>
              <Space>
                <Checkbox
                  style={{ transform: 'scale(1.2)' }}
                  checked={selected.includes(rut)}
                  onChange={e => {
                    const next = e.target.checked
                      ? [...selected, rut]
                      : selected.filter(r => r !== rut);
                    setSelected(next);
                  }}
                />
                {/* Solo mostramos el nombre */}
                <span>{nombre}</span>
                <Button
                  type="link"
                  onClick={() => onConfirm(rut)}
                >
                  Confirmar
                </Button>
              </Space>
            </List.Item>
          );
        }}
      />

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button
          type="primary"
          disabled={selected.length === 0}
          onClick={() => onConfirmMultiple(selected)}
        >
          Confirmar seleccionados
        </Button>
      </div>
    </Modal>
  );
}
