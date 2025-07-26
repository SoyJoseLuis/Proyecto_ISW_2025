import React from 'react';
import { Modal, Button } from 'antd';
import '../styles/ModalConfirmacion.css';

export default function ModalConfirmacion({
  visible,
  title,
  message,
  confirmText = 'Sí',
  cancelText = 'No',
  onConfirm,
  onCancel
}) {
  return (
    <Modal
      visible={visible}
      title={null}
      footer={null}
      closable={false}
      maskClosable={false}
      className="ios-modal"
      bodyStyle={{ padding: 0 }}
      centered
    >
      <div className="ios-modal-header">
        <p className="ios-modal-title">{title}</p>
      </div>
      <div className="ios-modal-body">
        <p>{message}</p>
      </div>
      <div className="ios-modal-footer">
        <Button block onClick={onCancel} shape="round">
          {cancelText}
        </Button>
        <Button block type="primary" onClick={onConfirm} shape="round">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
