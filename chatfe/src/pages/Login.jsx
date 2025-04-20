import { Button, Form, Input, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/tokenHelper';
const Login = () => {
    const navigate = useNavigate();

    const onFinish = async ({ username, password }) => {
        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) throw new Error('Login thất bại');
            const data = await res.json();
            saveToken(data.data); // lưu JWT tách 3 phần
            message.success('Đăng nhập thành công');
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/');
        } catch (err) {
            message.error(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <Card title="Đăng nhập" style={{ width: 400 }}>
                <Form name="login" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Nhập username' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Nhập password' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;