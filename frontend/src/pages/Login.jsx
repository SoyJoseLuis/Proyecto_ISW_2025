import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import animationData from '../assets/Animacion-login.json';
import Lottie from 'lottie-react';
import '../styles/LoginScreen.css';

const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  'http://146.83.198.35:1293/api';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1) Autenticar al estudiante
      const response = await fetch(
        `${BASE_URL}/estudiantes/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            correoEstudiante: values.email,
            passEstudiante: values.password,
          }),
        }
      );
      const data = await response.json();

      if (
        response.ok &&
        data.status === 'Success' &&
        data.data
      ) {
        // 2) Guardar token y datos de usuario
        localStorage.setItem('jwt', data.data.token);
        localStorage.setItem(
          'userData',
          JSON.stringify(data.data)
        );
        localStorage.setItem('isLogged', '1');

        message.success('¡Login exitoso!');

        // 3) Consultar roles del estudiante
        const rut = data.data.student.rutEstudiante;
        const rolesRes = await fetch(
          `${BASE_URL}/roles/estudiante/${rut}`
        );
        const rolesJson = await rolesRes.json();
        const rolesArr = (
          rolesJson.data?.roles || []
        ).map((r) => r.idRol);

        // 4) Redirigir según tenga o no tenga roles
        if (rolesArr.length === 0) {
          navigate('/home-estudiante');
        } else {
          navigate('/home');
        }
      } else {
        message.error(
          data.message || 'Correo o contraseña incorrectos'
        );
      }
    } catch (err) {
      console.error(err);
      message.error('Error de red o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="login-animation">
          <Lottie
            animationData={animationData}
            loop
            autoplay
          />
        </div>
      </div>

      <div className="login-right">
        <h1 className="login-title">Iniciar sesión</h1>
        <Form
          name="login"
          layout="vertical"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Ingresa tu correo' },
              { type: 'email', message: 'Correo no válido' },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="Correo electrónico"
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Ingresa tu contraseña' },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Iniciar sesión
            </Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  );
}
