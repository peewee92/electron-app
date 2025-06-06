import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { generateToken, checkTokenStatus } from '../../services/authService';
import BrandLogo from '../UI/BrandLogo';
import Button from '../UI/Button';
import { FiRefreshCw } from 'react-icons/fi';
import './QRLoginCard.less';

type QRStatus = 
  | 'initial' 
  | 'loading' 
  | 'pending' 
  | 'scanned' 
  | 'success' 
  | 'expired' 
  | 'rejected' 
  | 'error';

const QRLoginCard: React.FC = () => {
  const navigate = useNavigate();
  const [rememberLogin, setRememberLogin] = useState(false);
  const { login } = useAuth();
  
  const [token, setToken] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [status, setStatus] = useState<QRStatus>('initial');
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3分钟有效时间
  
  // 轮询间隔 (秒)
  const POLLING_INTERVAL = 3000; 
  
  // 生成二维码内容
  const generateQRContent = useCallback((token: string) => {
    // 实际生产环境中使用: `ahoy://login?token=${token}`
    return JSON.stringify({ token, action: 'login' });
  }, []);

  // 生成二维码
  const generateQRCode = useCallback(async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // 获取新token
      const newToken = await generateToken();
      setToken(newToken);
      
      // 生成二维码数据
      const qrData = generateQRContent(newToken);
      setQrCodeData(qrData);
      
      // 重置计时器
      setTimeLeft(180);
      setStatus('pending');
    } catch (err) {
      setStatus('error');
      setError('Unable to generate QR code');
      console.error('Generate QR code error:', err);
    }
  }, [generateQRContent]);

  // 初始化登录流程
  const initLoginProcess = useCallback(() => {
    generateQRCode();
  }, [generateQRCode]);

  // 检查token状态
  const checkStatus = useCallback(async () => {
    if (!token || status !== 'pending') return;
    
    try {
      const result = await checkTokenStatus(token);
      
      switch (result.status) {
        case 'pending':
          // 保持当前状态
          break;
        case 'scanned':
          setStatus('scanned');
          break;
        case 'confirmed':
          setStatus('success');
          login('your-auth-token', rememberLogin);
          setTimeout(() => navigate('/dashboard'), 1500);
          break;
        case 'expired':
          setStatus('expired');
          setError('QR code has expired');
          break;
        case 'rejected':
          setStatus('rejected');
          setError('Login request rejected');
          break;
        default:
          setStatus('error');
          setError('Unknown status');
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to check login status');
      console.error('Check token status error:', err);
    }
  }, [token, status, login, navigate, rememberLogin]);

  // 倒计时逻辑
  useEffect(() => {
    let timer;
    
    if (status === 'pending' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && status === 'pending') {
      setStatus('expired');
      setError('QR code has expired');
    }
    
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  // 轮询状态
  useEffect(() => {
    let interval;
    
    if (status === 'pending' && token) {
      // 初始请求
      checkStatus();
      
      // 设置轮询
      interval = setInterval(() => {
        checkStatus();
      }, POLLING_INTERVAL);
    }
    
    return () => clearInterval(interval);
  }, [status, token, checkStatus]);

  // 组件挂载时初始化
  useEffect(() => {
    initLoginProcess();
  }, [initLoginProcess]);

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
            <QRCode 
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
        <FiRefreshCw className={`refresh-icon ${status === 'loading' ? 'spinning' : ''}`} />
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
  );
};

export default QRLoginCard;