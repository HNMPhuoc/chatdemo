import React, { useEffect, useState } from 'react';
import { List, Avatar, Typography } from 'antd';
import { getToken } from '../utils/tokenHelper';
import { UserOutlined } from '@ant-design/icons';
import './Sidebar.css'; // để style thêm nếu cần

export default function Sidebar({ onSelectUser }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = getToken();
            if (!token) {
                setUsers([]);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/users/others', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                setUsers(data.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        const intervalId = setInterval(fetchUsers, 5000); // Cập nhật danh sách bạn bè mỗi 5 giây
        return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
    }, []);

    if (!getToken()) {
        return (
            <div style={{ padding: 16 }}>
                <Typography.Text type="secondary">Bạn cần đăng nhập để xem danh sách bạn bè.</Typography.Text>
            </div>
        );
    }

    return (
        <div style={{
            height: '100%',
            overflowY: 'auto',
            borderRight: '1px solid #f0f0f0',
            padding: '8px',
            background: '#fff'
        }}>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={users}
                renderItem={user => (
                    <List.Item
                        style={{ cursor: 'pointer', borderRadius: 8, padding: 8 }}
                        onClick={() => onSelectUser(user)}
                        className="chat-item"
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={user.urlImg}
                                    icon={!user.urlImg && <UserOutlined />}
                                    size="large"
                                />
                            }
                            title={<span>{user.username}</span>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}