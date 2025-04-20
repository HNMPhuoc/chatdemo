// src/components/MainContent.jsx
import { Empty } from 'antd';
import { Layout } from 'antd';

const { Content } = Layout;

// src/components/MainContent.jsx
export default function MainContent({ empty, children }) {
    return (
        <div style={{
            height: '100%',
            width: '100%',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: empty ? 'center' : 'stretch',
        }}>
            <div style={{ width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
}