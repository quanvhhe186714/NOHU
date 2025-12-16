import React, { useState } from 'react';
import './Register.css';
import { UserIcon, LockIcon, PhoneIcon, ShieldIcon } from './icons';
import { authApi } from '../services/api';

interface RegisterProps {
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

const isValidVietnamesePhone = (phone: string): boolean => {
  return /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/.test(phone);
};

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPhoneError(null);

    if (!isValidVietnamesePhone(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.register(username, phone, password);
      
      if (response.success) {
        console.log('Registration successful:', response.data.user);
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <img src="/assets/background.gif" alt="Background" className="register-background-image" />
      </div>
      
      <div className="register-content">
        <div className="register-form-container">
          {/* <div className="register-side-effect left">
            <img src="/assets/login.gif" alt="Left Effect" className="register-side-effect-gif" />
          </div> */}
          
          <div className="register-form">
            <div className="register-greeting">
              <h2>Chào mừng bạn</h2>
              <p>Đăng ký tài khoản mới</p>
            </div>
            
            <form onSubmit={handleRegister} className="register-form-element">
              <div className="register-input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tên đăng nhập"
                  className="register-input"
                  required
                />
                <span className="register-input-icon">
                  <UserIcon size={20} />
                </span>
              </div>
              
              <div className="register-input-group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  className="register-input"
                  required
                />
                <span className="register-input-icon">
                  <PhoneIcon size={20} />
                </span>
              </div>
              {phoneError && (
                <div className="register-error">{phoneError}</div>
              )}
              
              <div className="register-input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="register-input"
                  required
                />
                <span className="register-input-icon">
                  <LockIcon size={20} />
                </span>
              </div>
              
              {error && (
                <div className="register-error">
                  {error}
                </div>
              )}
              
              <button type="submit" className="register-button" disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>
            
            <div className="register-footer">
              <p>Đã có tài khoản? <a href="#" className="login-link" onClick={onSwitchToLogin}>Đăng nhập</a></p>
            </div>
          </div>
          
          {/* <div className="register-side-effect right">
            <img src="/assets/login.gif" alt="Right Effect" className="register-side-effect-gif" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Register; 