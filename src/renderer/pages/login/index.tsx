import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
// import { useAuth } from '@renderer/contexts/AuthContext';
import { generateToken } from '@renderer/api/authService';
import BrandLogo from '@renderer/components/BrandLogo';
import {QRCodeCanvas} from 'qrcode.react';
import {ReloadOutlined} from '@ant-design/icons';
import './login.less'

const isAuthenticated = false
const login = false

function Login() {
    // 创建路由钩子
    const navigate = useNavigate()
    // const { login, isAuthenticated } = useAuth();
    const [status, setStatus] = useState('生成二维码中...');
    const [timeLeft, setTimeLeft] = useState(60); // 3分钟有效时间
    const timerRef = useRef(null);
    const [rememberLogin, setRememberLogin] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home', { replace: true });
            return;
        }

        generateQRCode();

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isAuthenticated, navigate, login]);

    // 向主进程请求二维码
    const generateQRCode = async () => {
        try {
            const uuid = await generateToken();
            const qrData = 'xxx.com' + uuid;
            setQrCodeData(qrData)
            setStatus('请使用手机应用扫码登录');

            // 开始倒计时
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setStatus('二维码已过期');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // 监听扫码登录状态变化


        } catch (error) {
            console.error('生成二维码失败:', error);
            setStatus('二维码生成失败，请重试');
        }
    };

    const getStatusMessage = () => {
        switch (status) {
          case 'expired':
            return error || 'QR code has expired';
          case 'rejected':
            return error || 'Login request rejected';
          case 'error':
            return error || 'An error occurred';
          case 'loading':
            return 'Loading QR code...';
          case 'pending':
            return 'Waiting for scan...';
          case 'scanned':
            return 'QR code scanned - Confirm in app';
          case 'success':
            return 'Login successful!';
          default:
            return 'Scan this QR code with the mobile app to log in';
        }
      };

    return (
        <div className="qr-login-card">
            <BrandLogo />

            <h1 className="title">Login with QR Code</h1>
            <p className="description">Scan this QR code with the mobile app to log in</p>

            <div className="qr-container">
                {status !== 'loading' && qrCodeData ? (
                    <div className="qr-code-wrapper">
                        <QRCodeCanvas
                            value={qrCodeData}
                            size={200}
                            level="H"
                            includeMargin={true}
                            renderAs="svg"
                        />

                        {(status === 'pending' || status === 'scanned') && (
                            <div className="qr-overlay">
                                {status === 'pending' && (
                                    <div className="qr-timer">
                                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                                    </div>
                                )}
                                {status === 'scanned' && (
                                    <div className="qr-confirmation">Confirm in app</div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="qr-code-loading">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>

            <div className={`status-message ${status}`}>
                {getStatusMessage()}
            </div>

            <Button
                onClick={() => {
                    if (status === 'success') {
                        navigate('/dashboard');
                    } else {
                        generateQRCode();
                    }
                }}
                className="refresh-button"
                variant={status === 'expired' || status === 'rejected' || status === 'error' ? 'primary' : 'secondary'}
            >
                <ReloadOutlined className={`refresh-icon ${status === 'loading' ? 'spinning' : ''}`} />
                {status === 'expired' || status === 'rejected' || status === 'error'
                    ? 'Try Again'
                    : 'Refresh QR Code'}
            </Button>

            <div className="remember-container">
                <input
                    id="remember-login"
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={(e) => setRememberLogin(e.target.checked)}
                />
                <label htmlFor="remember-login">Remember login on this device</label>
            </div>
        </div>
    )
}

export default Login