// src/layouts/MainLayout.jsx
import { Layout } from 'antd';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import AppFooter from '../components/Footer';
import { useState } from 'react';
import ChatBox from '../components/ChatBox';
import { useEffect, useRef } from 'react';
const { Sider, Header, Content, Footer } = Layout;

export default function MainLayout() {
    const [selectedUser, setSelectedUser] = useState(null);
    const chatRef = useRef();
    useEffect(() => {
        if (selectedUser && chatRef.current) {
            chatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser]);
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Navbar */}
            <Header style={{ padding: 0 }}>
                <Navbar />
            </Header>

            <Layout style={{ flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <Sider width={250} style={{ backgroundColor: '#f4f4f4' }}>
                    <Sidebar onSelectUser={setSelectedUser} />
                </Sider>

                {/* Content + Footer */}
                <Layout style={{ padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
                    <Content style={{ flex: 1, padding: '2px 0', backgroundColor: '#fff' }}>
                        <div ref={chatRef}>
                            <MainContent empty={!selectedUser}>
                                {selectedUser && <ChatBox selectedUser={selectedUser} />}
                            </MainContent>
                        </div>
                    </Content>

                    <Footer style={{ background: '#f0f2f5', padding: '12px 16px' }}>
                        <AppFooter />
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
}
