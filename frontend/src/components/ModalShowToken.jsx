import React from 'react';
import '../styles/Actividades.css';  // ← para .modal-backdrop / .modal-content

export default function ModalShowToken({ visible, token, onClose }) {
  if (!visible) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Token de asistencia</h2>
        <p style={{ fontSize: 24, margin: '16px 0' }}>{token}</p>
        <button className="btn-primary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
