import React, { useState } from "react";
import type { FormEvent } from "react";
import "../../css/components/Login.css";
import { UserIcon, LockIcon } from "./icons";
import { authApi } from "../services/api";

interface LoginProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

const Login = ({ onSwitchToRegister, onLoginSuccess }: LoginProps) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(identifier, password);

      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(response.message || "Đăng nhập thất bại");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <img
          src="/assets/background.gif"
          alt="Background"
          className="login-background-image"
        />
      </div>

      <div className="login-content">
        <div className="login-form-container">
          <div className="login-form">
            <div className="login-greeting">
              <h2>Chào mừng quay lại</h2>
              <p>Đăng nhập để tiếp tục</p>
            </div>

            <form onSubmit={handleLogin} className="login-form-element">
              <div className="login-input-group">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Tên đăng nhập hoặc số điện thoại"
                  className="login-input"
                  required
                />
                <span className="login-input-icon">
                  <UserIcon size={20} />
                </span>
              </div>

              <div className="login-input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="login-input"
                  required
                />
                <span className="login-input-icon">
                  <LockIcon size={20} />
                </span>
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Chưa có tài khoản?{" "}
                <a
                  href="#"
                  className="register-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSwitchToRegister) onSwitchToRegister();
                  }}
                >
                  Đăng ký
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
