import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import animationData from '../assets/Animacion-login.json';
import Lottie from 'lottie-react';
import '../styles/LoginScreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();

  // Función de login falso
  const onFinish = (values) => {
   
    localStorage.setItem('fake_isLogged', '1');
    navigate('/home');
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
            <Button type="primary" htmlType="submit" block size="large">
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
