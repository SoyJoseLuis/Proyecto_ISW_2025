import { Modal, Form, Input, DatePicker, Select, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { useCreateTransaccion } from '../hooks/transaccion/useCreateTransaccion';
import { useGetBalancesByPeriod } from '../hooks/balance/useGetBalancesByPeriod.jsx';
import { getBalanceByPeriod } from '../services/balance.service.js';
import { useState, useEffect } from 'react';

export default function ModalCrearTransaccion({ visible, onClose, onSuccess, refreshKey, transacciones, refetchTransacciones }) {
  const [form] = Form.useForm();
  const { createTransaccion, isLoading } = useCreateTransaccion();
  const currentYear = dayjs().year();
  const previousYear = currentYear - 1;
  const { balance } = useGetBalancesByPeriod(currentYear, false, undefined, refreshKey);
  const [previousYearBalance, setPreviousYearBalance] = useState(null);
  const [loadingPrevBalance, setLoadingPrevBalance] = useState(true);

  useEffect(() => {
    async function fetchPrevBalance() {
      setLoadingPrevBalance(true);
      const response = await getBalanceByPeriod(previousYear);
      if (response.status === 'Success') {
        // Puede ser array o objeto
        const prev = Array.isArray(response.data) ? response.data[0] : response.data;
        setPreviousYearBalance(prev?.montoActual || 0);
      } else {
        setPreviousYearBalance(0);
      }
      setLoadingPrevBalance(false);
    }
    fetchPrevBalance();
  }, [previousYear]);

  // Detectar si es la primera transacción del año actual
  const transaccionesActualYear = transacciones.filter(
    t => dayjs(t.fechaTransaccion, 'DD-MM-YYYY').year() === currentYear
  );
  const isFirstTransaction = transaccionesActualYear.length === 0;

  // Tipos de transacción (según tu API)
  const tiposTransaccion = [
    { id: 1, nombre: 'Ingreso' },
    { id: 2, nombre: 'Salida' }
  ];

  // Asegura que si es la primera transacción, el valor sea 1
  useEffect(() => {
    if (isFirstTransaction && !loadingPrevBalance) {
      form.setFieldsValue({ idTipoTransaccion: 1 });
    }
  }, [isFirstTransaction, loadingPrevBalance, form]);

  // Función para validar que la fecha sea del año actual
  const validateFechaAñoActual = (_, value) => {
    if (!value) return Promise.resolve();
    
    const currentYear = dayjs().year();
    const selectedYear = value.year();
    
    if (selectedYear !== currentYear) {
      return Promise.reject(new Error(`La fecha debe ser del año actual (${currentYear})`));
    }
    return Promise.resolve();
  };

  // Función para deshabilitar fechas que no sean del año actual ni posteriores al día actual
  const disabledDate = (current) => {
    const today = dayjs();
    const currentYear = today.year();
    // Deshabilita si no es el año actual o si es después de hoy
    return (
      (current && current.year() !== currentYear) ||
      (current && current.isAfter(today, 'day'))
    );
  };

  // Validación personalizada para el monto según tipo de transacción y balance
  const validateMontoTransaccion = async (_, value) => {
    const tipo = form.getFieldValue('idTipoTransaccion');
    if (isFirstTransaction) {
      if (Number(value) !== Number(previousYearBalance)) {
        return Promise.reject(
          new Error(`Debe ingresar el monto final del balance anterior: $${Number(previousYearBalance).toLocaleString('es-CL')}`)
        );
      }
      if (tipo !== 1) {
        return Promise.reject(new Error('La primera transacción debe ser de tipo Ingreso.'));
      }
      if (Number(value) <= 10) {
        return Promise.reject(new Error('El monto debe ser mayor a 10.'));
      }
      if (!Number.isInteger(Number(value))) {
        return Promise.reject(new Error('El monto debe ser un número entero.'));
      }
      return Promise.resolve();
    }
    if (value && value <= 10) {
      return Promise.reject(new Error('El monto debe ser mayor a 10.'));
    }
    if (value && !Number.isInteger(Number(value))) {
      return Promise.reject(new Error('El monto debe ser un número entero.'));
    }
    // Convertir ambos a número y proteger contra null/undefined/NaN
    const montoActual = Number(balance?.montoActual) || 0;
    const montoSalida = Number(value) || 0;
    if (tipo === 2 && balance && montoSalida > montoActual) {
      return Promise.reject(new Error(`No hay fondos suficientes. El balance disponible es $${montoActual.toLocaleString('es-CL')}`));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      // Obtener RUT desde localStorage
      let rut = '';
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        rut = userData?.student?.rutEstudiante || '';
      } catch {
        rut = '';
      }
      if (!rut) {
        message.error("No se encontró usuario logueado.");
        return;
      }
      // Validación extra por si el usuario manipula el DOM
      const montoActual = Number(balance?.montoActual) || 0;
      const montoSalida = Number(values.montoTransaccion) || 0;
      if (values.idTipoTransaccion === 2 && balance && montoSalida > montoActual) {
        message.error(`No hay fondos suficientes. El monto actual disponible es $${montoActual.toLocaleString('es-CL')}`);
        return;
      }
      const transaccionData = {
        montoTransaccion: values.montoTransaccion,
        fechaTransaccion: values.fechaTransaccion.format('DD-MM-YYYY'),
        rutEstudiante: rut, // Usar el rut obtenido
        idTipoTransaccion: values.idTipoTransaccion,
        motivoTransaccion: values.motivoTransaccion,
        idActividad: values.idActividad || null
      };

      await createTransaccion(transaccionData);
      await refetchTransacciones(); // Fuerza la actualización de la lista
      form.resetFields();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al crear transacción:', error);
    }
  };

  return (
    <Modal
      open={visible}
      title="Crear nueva transacción"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Crear"
      cancelText="Cancelar"
      centered
      destroyOnClose
      confirmLoading={isLoading || loadingPrevBalance}
    >
      <Form
        form={form}
        layout="vertical"
        name="crear_transaccion_form"
        onFinish={handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Form.Item 
          label="Tipo de transacción" 
          name="idTipoTransaccion"
          rules={[{ required: true, message: 'Selecciona el tipo de transacción' }]}
          initialValue={isFirstTransaction ? 1 : undefined}
        >
          <Select placeholder="Selecciona tipo">
            {(isFirstTransaction
              ? tiposTransaccion.filter(t => t.id === 1)
              : tiposTransaccion
            ).map(t => (
              <Select.Option key={t.id} value={t.id}>{t.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Monto" 
          name="montoTransaccion"
          rules={[
            { required: true, message: 'Ingresa el monto' },
            { validator: validateMontoTransaccion }
          ]}
          extra={isFirstTransaction && !loadingPrevBalance ? `Debe ingresar el monto final del balance anterior: $${Number(previousYearBalance).toLocaleString('es-CL')}` : ''}
        >
          <InputNumber
            placeholder={isFirstTransaction && !loadingPrevBalance ? `Monto final del balance anterior` : 'Ingresa el monto'}
            style={{ width: '100%' }}
            min={11}
            step={1}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            disabled={loadingPrevBalance}
          />
        </Form.Item>

        <Form.Item 
          label="Fecha de transacción" 
          name="fechaTransaccion"
          rules={[
            { required: true, message: 'Selecciona la fecha' },
            { validator: validateFechaAñoActual }
          ]}
        >
          <DatePicker 
            format="DD-MM-YYYY" 
            style={{ width: '100%' }} 
            placeholder="Seleccionar fecha"
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item 
          label="Motivo de la transacción" 
          name="motivoTransaccion"
          rules={[
            { required: true, message: 'Describe el motivo' },
            { min: 15, message: 'El motivo debe tener al menos 15 caracteres' },
            { max: 70, message: 'El motivo no puede exceder 70 caracteres' },
            {
              validator: (_, value) => {
                if (value) {
                  if (!/\S+\s+\S+/.test(value.trim())) {
                    return Promise.reject(new Error('El motivo debe contener al menos dos palabras.'));
                  }
                }
                return Promise.resolve();
              }
            }
          ]}
          style={{ marginBottom: 32 }}
        >
          <Input.TextArea 
            placeholder="Describe el motivo de la transacción" 
            rows={2} 
            maxLength={70}
            showCount
          />
        </Form.Item>

        {/* Texto informativo sobre eliminación */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#52c41a'
        }}>
          <strong>💡 Información:</strong> Podrás eliminar esta transacción únicamente durante los primeros 5 minutos después de crearla.
        </div>
      </Form>
      
    </Modal>
  );
} 