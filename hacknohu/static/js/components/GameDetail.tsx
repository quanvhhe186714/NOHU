import React from "react";
import "./GameDetail.css";
import { authApi } from "../services/api";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";

interface GameDetailProps {
  gameName: string;
  gameLogo: string;
  gameLobbyLogo: string;
  gamePercent?: string;
  onBack?: () => void;
  onLogout?: () => void;
  onPlayGame?: () => void;
  onAdminClick?: () => void;
}

// Popup component
const InsufficientBalancePopup: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-particles"></div>
        <div className="popup-header"></div>
        <div className="popup-body">
          <p>Bạn đã hết xu</p>
          <p>Vui lòng liên hệ admin để nạp thêm xu.</p>
        </div>
        <div className="popup-footer">
          <button className="popup-button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

const GameDetail: React.FC<GameDetailProps> = ({
  gameName,
  gameLogo,
  gameLobbyLogo,
  gamePercent,
  onBack,
  onLogout,
  onPlayGame,
  onAdminClick,
}) => {
  const isMobile = useIsMobile();

  // State cho loading và số vòng quay
  const [isLoading, setIsLoading] = React.useState(false);
  const [spinCount, setSpinCount] = React.useState<number | null>(null);
  const [spinCountAuto, setSpinCountAuto] = React.useState<number | null>(null);
  const [time, setTime] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [showInsufficientPopup, setShowInsufficientPopup] =
    React.useState(false);
  const [balance, setBalance] = React.useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.balance || 0;
    }
    return 0;
  });

  // Animation states
  const [isButtonAnimating, setIsButtonAnimating] = React.useState(false);
  const [showParticles, setShowParticles] = React.useState(false);
  const [particles, setParticles] = React.useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  const [username, setUsername] = React.useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.username || "";
    }
    return "";
  });

  const [userRole, setUserRole] = React.useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.role || "user";
    }
    return "user";
  });

  // Function để refresh user data từ API
  const refreshUserData = async () => {
    try {
      const response = await authApi.getProfile();
      if (response.success && response.data.user) {
        const user = response.data.user;
        setBalance(user.balance || 0);
        setUsername(user.username || "");

        // Cập nhật localStorage
        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserRole(user.role || "user");
        }
      }
    } catch (error) {
      console.error("Lỗi khi refresh user data:", error);
    }
  };

  // Sync user data from localStorage và refresh từ API
  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setBalance(user.balance || 0);
      setUsername(user.username || "");
    }

    // Refresh data từ API khi component mount
    refreshUserData();
  }, []);

  // Auto refresh user data mỗi 30 giây
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshUserData();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, []);

  const handlePlayGame = () => {
    if (onPlayGame) {
      onPlayGame();
    } else {
      window.open(
        `https://example.com/game/${gameName
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        "_blank"
      );
    }
  };

  const handleReceiveSpin = async () => {
    try {
      if (balance < 5) {
        setShowInsufficientPopup(true);
        return;
      }

      setIsButtonAnimating(true);

      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setShowParticles(true);

      setProgress(0);

      // Gọi API play game
      const response = await authApi.playGame();

      if (response.success) {
        // Cập nhật balance trong localStorage và state
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          user.balance = response.data.balance;
          localStorage.setItem("user", JSON.stringify(user));
          setBalance(response.data.balance);
          setUsername(user.username || "");
        }

        // Giả lập loading từ 1-100 mượt hơn
        const loadingInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + Math.random() * 3 + 1; // Random 1-4 mỗi lần, mượt hơn
            if (newProgress >= 100) {
              clearInterval(loadingInterval);

              const randomSpins =
                Math.floor(Math.random() * (65 - 45 + 1)) + 45;
              const randomSpinsAuto = Math.floor(Math.random() * 30) + 45;
              setSpinCount(randomSpins);
              setSpinCountAuto(randomSpinsAuto);
              const startTime = new Date();
              const endTime = new Date(startTime.getTime() + 1000 * 60 * 15);

              const formatTime = (date: Date) => {
                const hours = date.getHours().toString().padStart(2, "0");
                const minutes = date.getMinutes().toString().padStart(2, "0");
                return `${hours}:${minutes}`;
              };

              setTime(`${formatTime(startTime)} - ${formatTime(endTime)}`);
              setIsLoading(false);
              setProgress(0);

              // Kết thúc animation
              setTimeout(() => {
                setIsButtonAnimating(false);
                setShowParticles(false);
              }, 1000);

              return 100;
            }
            return newProgress;
          });
        }, 50); // Cập nhật mỗi 50ms thay vì 100ms, mượt hơn
      }
    } catch (error: any) {
      setIsLoading(false);
      setProgress(0);
      setIsButtonAnimating(false);
      setShowParticles(false);

      console.error("Lỗi khi gọi API:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Function để refresh data manual
  const handleRefreshData = () => {
    refreshUserData();
  };

  return (
    <div className={`game-detail-container ${isMobile ? "mobile" : "desktop"}`}>
      {/* Insufficient Balance Popup */}
      <InsufficientBalancePopup
        isVisible={showInsufficientPopup}
        onClose={() => setShowInsufficientPopup(false)}
      />

      {/* Particle Effects */}
      <AnimatePresence>
        {showParticles && (
          <div className="particle-container">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="magic-particle"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
                onAnimationComplete={() => {
                  if (particle.id === particles.length - 1) {
                    setShowParticles(false);
                  }
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="game-detail-background">
        {!isMobile && (
          <img
            src="/assets/background.gif"
            alt="BG Desktop"
            className="game-detail-background-image"
          />
        )}
      </div>

      <Header
        title="HACKNOHU79"
        username={username}
        role={userRole}
        showAdminButton={userRole === "admin" || userRole === "moderator"}
        onAdminClick={onAdminClick}
        showBackButton={true}
        onBackClick={onBack}
        onLogout={onLogout}
        showRefreshButton={true}
        onRefresh={handleRefreshData}
        balance={balance}
        pageType="game-detail"
      />

      <div className="game-detail-content">
        {isMobile ? (
          <div className="gift-mobile">
            <img src="/assets/gift-game-mobile.gif" alt="Gift Mobile" />
            <div className="game-lobby-logo">
              <img
                src={gameLobbyLogo}
                alt={gameName}
                className="game-lobby-logo-img"
              />
            </div>
            <div className="game-logo">
              <img src={gameLogo} alt={gameName} className="game-logo-img" />
            </div>
            <div className="game-percent">
              <div className="game-percent-wrapper">
                <h2>{gamePercent}%</h2>
              </div>
            </div>
            <div className="game-name">
              <h2>{gameName}</h2>
            </div>
            <div className="gift-robot">
              {spinCount === null ? (
                <img src="/assets/robot-mobile.gif" alt="" />
              ) : (
                <img src="/assets/robot-mobile-2.gif" alt="" />
              )}
            </div>
            <div className="group-spin">
              {spinCount === null && (
                <motion.button
                  className="receive-spin-button"
                  onClick={handleReceiveSpin}
                  disabled={isLoading}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px #00ff00, 0 0 40px #00ff00",
                  }}
                  whileTap={{
                    scale: 0.95,
                    boxShadow: "0 0 30px #00ff00, 0 0 60px #00ff00",
                  }}
                  animate={
                    isButtonAnimating
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                          boxShadow: [
                            "0 0 20px #00ff00",
                            "0 0 40px #00ff00, 0 0 60px #00ff00",
                            "0 0 20px #00ff00",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  {isLoading ? (
                    <motion.span
                      className="loading-text"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Đang tải {Math.round(progress)}%
                    </motion.span>
                  ) : (
                    <motion.span
                      className="button-text"
                      animate={
                        isButtonAnimating
                          ? {
                              color: ["#00ff00", "#ffff00", "#00ff00"],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      Trick quay
                    </motion.span>
                  )}
                </motion.button>
              )}
              {spinCount !== null && (
              <div className="spin-count-content">
                <div>
                  Quay thủ công:{" "}
                  <span className="spin-count-value">{spinCount}</span>
                </div>
                <div>
                  Quay auto:{" "}
                  <span className="spin-count-value">{spinCountAuto}</span>
                </div>
                <div>
                  Khung giờ: <span className="spin-count-value">{time}</span>
                </div>
              </div>
            )}
            </div>
          </div>
        ) : (
          <div className="gift-desktop">
            <div className="row-1">
              <div className="row-1-content">
                <div className="game-lobby-logo-desktop">
                  <img
                    src={gameLobbyLogo}
                    alt={gameName}
                    className="game-lobby-logo-img"
                    style={{ width: 90, height: 90, border: "1px solid" }}
                  />
                </div>
                <div className="game-logo-desktop">
                  <img
                    src={gameLogo}
                    alt={gameName}
                    className="game-logo-img"
                  />
                </div>
                <div className="game-name-desktop">
                  <h2>{gameName}</h2>
                </div>
              </div>
            </div>
            <div className="row-2">
              <div className="row-2-content">
                <div className="gift-robot">
                  {spinCount === null ? (
                    <img src="/assets/robot.gif" alt="" />
                  ) : (
                    <img src="/assets/robot-2.gif" alt="" />
                  )}
                </div>
                <div className="group-spin-desktop">
                  {spinCount === null && (
                    <motion.button
                      className="receive-spin-button"
                      onClick={handleReceiveSpin}
                      disabled={isLoading}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 20px #00ff00, 0 0 40px #00ff00",
                      }}
                      whileTap={{
                        scale: 0.95,
                        boxShadow: "0 0 30px #00ff00, 0 0 60px #00ff00",
                      }}
                      animate={
                        isButtonAnimating
                          ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                              boxShadow: [
                                "0 0 20px #00ff00",
                                "0 0 40px #00ff00, 0 0 60px #00ff00",
                                "0 0 20px #00ff00",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      {isLoading ? (
                        <motion.span
                          className="loading-text"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          Đang tải {Math.round(progress)}%
                        </motion.span>
                      ) : (
                        <motion.span
                          className="button-text"
                          animate={
                            isButtonAnimating
                              ? {
                                  color: ["#00ff00", "#ffff00", "#00ff00"],
                                }
                              : {}
                          }
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          Trick quay
                        </motion.span>
                      )}
                    </motion.button>
                  )}
                  {spinCount !== null && (
                    <div className="spin-count-content-desktop">
                      <div className="spin-count-content">
                        <div>
                          Quay thủ công:{" "}
                          <span className="spin-count-value">{spinCount}</span>
                        </div>
                        <div>
                          Quay auto:{" "}
                          <span className="spin-count-value">
                            {spinCountAuto}
                          </span>
                        </div>
                        <div>
                          Khung giờ:{" "}
                          <span className="spin-count-value">{time}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="game-countdown-desktop">
                  <div className="game-percent-desktop">
                    <h2>{gamePercent}%</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
