
import { Form, Input, Checkbox, Button } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import logo from '@/ui-kit/assets/logo.svg';
import '@/ui-kit/styles/LoginScreen.css';

export default function LoginScreen() {
  return (
    <div className="login-screen">
      {/* COLUMNA IZQUIERDA */}
      <div className="login-left">
        <img src={logo} alt="iDURAR" className="login-logo" />
        <h2 className="login-tagline">Administre su empresa con:</h2>
        <ul className="login-features">
          <li>
            Herramienta todo en uno
            <p className="login-feature-desc">
              Ejecute y amplíe sus aplicaciones de ERP CRM
            </p>
          </li>
          <li>
            Agregue y administre fácilmente sus servicios
            <p className="login-feature-desc">
              Reúne tus facturas, clientes y oportunidades
            </p>
          </li>
        </ul>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="login-right">
        <h1 className="login-title">Iniciar sesión</h1>

        <Form
          name="login"
          layout="vertical"
          className="login-form"
          // onFinish aquí iría la lógica, pero la omitimos
        >
          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* RECÚERDAME + OLVIDASTE */}
          <div className="login-extra">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Recuérdame</Checkbox>
            </Form.Item>
            <a href="/forgetpassword" className="login-forgot">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* BOTÓN */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Iniciar sesión
            </Button>
          </Form.Item>

          {/* LINK A REGISTRO */}
          <div className="login-register">
            O <a href="/register">Registrarse ahora!</a>
          </div>
        </Form>
      </div>
    </div>
  );
}
