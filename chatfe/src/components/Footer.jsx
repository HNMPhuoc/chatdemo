// src/components/Footer.jsx
import { Layout } from 'antd';

const { Footer } = Layout;

export default function AppFooter() {
    return (
        <Footer style={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} Chat App - React + Ant Design
        </Footer>
    );
}
