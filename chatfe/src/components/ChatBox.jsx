import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Avatar, Typography, message as AntMessage } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { getToken } from '../utils/tokenHelper';
import { io } from 'socket.io-client';

const { Text } = Typography;
const { TextArea } = Input;

// ⚡ Khởi tạo socket ngoài component để chỉ tạo 1 lần
const socket = io("http://localhost:3000", {
  withCredentials: true
});

export default function ChatBox({ selectedUser }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);
    const currentUserId = useRef(null);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Kết nối socket và fetch dữ liệu ban đầu
    useEffect(() => {
        const token = getToken();
        if (!token || !selectedUser) return;

        const fetchData = async () => {
            const meRes = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const meData = await meRes.json();
            currentUserId.current = meData.data._id;

            socket.emit('user_connected', currentUserId.current);

            const res = await fetch(`/api/messages/${selectedUser._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(data.data);
            }
        };

        fetchData();
    }, [selectedUser]);

    // Nhận tin nhắn realtime từ người khác
    useEffect(() => {
        socket.on('receive_message', (newMessage) => {
            // Chỉ xử lý nếu người gửi không phải là mình
            if (
                selectedUser &&
                newMessage.sender !== currentUserId.current && // 👈 tránh double
                (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)
            ) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });
    
        return () => {
            socket.off('receive_message');
        };
    }, [selectedUser]);    

    const handleSend = async () => {
        const token = getToken();
        if (!token || !content.trim()) return;

        try {
            setLoading(true);
            const res = await fetch('/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    toUserId: selectedUser._id,
                    content: content.trim()
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, data.data]);
                setContent('');

                // Gửi realtime qua socket
                socket.emit('send_message', {
                    toUserId: selectedUser._id,
                    message: data.data
                });
            } else {
                AntMessage.error(data.message || "Lỗi khi gửi tin nhắn");
            }
        } catch (error) {
            console.error('Lỗi gửi tin nhắn:', error);
            AntMessage.error("Lỗi hệ thống");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderLeft: '1px solid #f0f0f0'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fafafa',
            }}>
                <Avatar
                    src={selectedUser.urlImg}
                    icon={!selectedUser.urlImg && <UserOutlined />}
                    size={40}
                    style={{ marginRight: 12 }}
                />
                <Text strong style={{ fontSize: 16 }}>{selectedUser.username}</Text>
            </div>

            {/* Chat content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                minHeight: 500,
            }}>
                {messages.map((msg, index) => {
                    const isMine = msg.sender === currentUserId.current;
                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                marginBottom: 8,
                            }}
                        >
                            <div style={{
                                maxWidth: '70%',
                                padding: '10px 14px',
                                borderRadius: 16,
                                backgroundColor: isMine ? '#1890ff' : '#e4e6eb',
                                color: isMine ? '#fff' : '#000',
                                fontSize: 15,
                                whiteSpace: 'pre-wrap',
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <div style={{
                borderTop: '1px solid #eee',
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>
                <TextArea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    onPressEnter={(e) => {
                        if (!e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    style={{ flex: 1 }}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    loading={loading}
                    disabled={!content.trim()}
                />
            </div>
        </div>
    );
}