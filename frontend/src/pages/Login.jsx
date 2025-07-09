import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import animationData from '../assets/Animacion-login.json';
import Lottie from 'lottie-react';
import '../styles/LoginScreen.css';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://146.83.198.35:1293/api";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Nuevo login real
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/estudiantes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correoEstudiante: values.email,
          passEstudiante: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar en localStorage lo que corresponda (ej: token)
        localStorage.setItem('isLogged', '1');
        // Si el backend devuelve token, puedes guardarlo también:
        // localStorage.setItem('token', data.token);

        message.success('¡Login exitoso!');
        navigate('/home');
      } else {
        // Manejar error del backend
        message.error(data.message || 'Correo o contraseña incorrectos');
      }
    } catch {
      message.error('Error de red o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* IZQUIERDA: animación */}
      <div className="login-left">
        <div className="login-animation">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            autoplay={true} 
          />
        </div>
      </div>

      {/* DERECHA: formulario */}
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
            rules={[{ required: true, message: 'Ingresa tu correo' }, { type: 'email' }]}
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
            rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="login-extra">
            <a href="/forgetpassword" className="login-forgot">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Iniciar sesión
            </Button>
          </Form.Item>

          <div className="login-register">
            O <a href="/register">Registrarse ahora!</a>
          </div>
        </Form>
      </div>
    </div>
  );
}
