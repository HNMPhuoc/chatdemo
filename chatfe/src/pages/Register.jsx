import { useState } from 'react';
import { Form, Input, Button, Typography, message as antdMessage } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include'
            });

            const data = await res.json();
            if (res.ok) {
                antdMessage.success('Đăng ký thành công!');
                navigate('/login');
            } else {
                throw new Error(data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            antdMessage.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <Title level={2}>Đăng ký tài khoản</Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
