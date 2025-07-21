// src/components/ConfirmAttendanceModal.jsx

import { Modal, Checkbox } from 'antd';

export default function ConfirmAttendanceModal({
  visible,
  list = [],
  checked = {},
  onCheckChange,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      title="Confirmar asistencia"
      visible={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Confirmar asistencia"
    >
      {list.map((p) => (
        <Checkbox
          key={p.rutEstudiante}
          checked={checked[p.rutEstudiante]}
          onChange={e =>
            onCheckChange(p.rutEstudiante, e.target.checked)
          }
        >
          {p.estudiante.nombreEstudiante}
        </Checkbox>
      ))}
    </Modal>
  );
}
