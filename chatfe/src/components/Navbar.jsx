import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../utils/tokenHelper';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        clearToken();
        setUser(null);
        message.success("Đã đăng xuất");
        navigate('/login');
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (!token) return;

            try {
                const res = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin người dùng:', err);
            }
        };

        fetchUser();
    }, []);

    return (
        <Header style={{
            background: '#ffffff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            height: 64
        }}>
            {/* Bên trái: Tên web */}
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                Chap App
            </div>

            {/* Bên phải: Menu hoặc Avatar + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {!user ? (
                    <>
                        <Link to="/">Trang chủ</Link>
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/register">Đăng ký</Link>
                    </>
                ) : (
                    <>
                        <Avatar
                            src={user.urlImg}
                            icon={!user.urlImg && <UserOutlined />}
                        />
                        <span style={{ fontWeight: 500 }}>{user.username}</span>
                        <Button onClick={handleLogout} danger type="primary">
                            Đăng xuất
                        </Button>
                    </>
                )}
            </div>
        </Header>
    );
}