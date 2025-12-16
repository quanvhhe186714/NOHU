import React, { useState, useEffect } from "react";
import "../../css/components/Dashboard.css";
import { dashboardApi, Lobby, Game, authApi } from "../services/api";
import Header from "./Header";
import LoadingPopup from "./LoadingPopup";

interface DashboardProps {
  onLogout?: () => void;
  onGameClick?: (gameLogo: string, gameName: string, gameLobbyLogo: string, gamePercent?: string) => void;
  onAdminClick?: () => void;
}

const Dashboard = ({ onLogout, onGameClick, onAdminClick }: DashboardProps) => {
  const [selectedLobby, setSelectedLobby] = useState<number | null>(null);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setBalance(user.balance || 0);
    }
    
    // Refresh data từ API khi component mount
    refreshUserData();
  }, []);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem dashboard');
          setLoading(false);
          return;
        }
        
        const response = await dashboardApi.getDashboardData();
        
        if (response.success && response.data && response.data.length > 0) {
          setLobbies(response.data);
          // Select first lobby by default and load its games immediately
          const firstLobbyId = response.data[0].id;
          setSelectedLobby(firstLobbyId);
          
          // Load games for first lobby immediately
          try {
            const gamesResponse = await dashboardApi.getGamesByLobby(firstLobbyId);
            if (gamesResponse.success) {
              setGames(gamesResponse.data);
            }
          } catch (gamesErr) {
            console.error('Error loading games for first lobby:', gamesErr);
          }
        } else {
          setError('Không có dữ liệu sảnh game. Vui lòng chạy: npm run seed trong thư mục backend');
        }
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setError('Vui lòng đăng nhập để xem dashboard');
        } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không (npm start trong thư mục backend)');
        } else {
          setError('Lỗi khi tải dữ liệu dashboard: ' + (err.message || 'Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Load games when selected lobby changes
  useEffect(() => {
    const loadGames = async () => {
      if (selectedLobby !== null) {
        try {
          const response = await dashboardApi.getGamesByLobby(selectedLobby);
          if (response.success) {
            setGames(response.data);
          }
        } catch (err) {
          console.error('Error loading games:', err);
          setGames([]);
        }
      }
    };

    loadGames();
  }, [selectedLobby]);

  // Get selected lobby data
  const getSelectedLobby = () => {
    return lobbies.find(lobby => lobby.id === selectedLobby);
  };

  const handleLobbyClick = (lobbyId: number) => {
    setSelectedLobby(lobbyId);
  };

  const handleGameClick = async (game: Game, lobby: Lobby, winRate: number) => {
    setShowLoadingPopup(true);
    
    const loadingTime = 5000;
    
    setTimeout(() => {
      setShowLoadingPopup(false);
      if (onGameClick) {
        onGameClick(game.image_url, game.name, lobby.image_url, winRate.toString());
      } else {
        console.log("Selected game:", game.name, "from lobby:", lobby.name);
      }
    }, loadingTime);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
  };

  // Function để refresh user data từ API
  const refreshUserData = async () => {
    try {
      const response = await authApi.getProfile();
      if (response.success && response.data.user) {
        const user = response.data.user;
        setBalance(user.balance || 0);
        setUser(user);
        
        // Cập nhật localStorage
        const currentUserData = localStorage.getItem('user');
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Lỗi khi refresh user data:', error);
    }
  };

  // Auto refresh user data mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserData();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-background">
        <img
          src="https://hacknohu79.com/assets/background.gif"
          alt="Background"
          className="dashboard-background-image"
        />
      </div>

      <Header
        title="HACKNOHU79"
        username={user?.username}
        role={user?.role}
        showAdminButton={user?.role === 'admin' || user?.role === 'moderator'}
        onAdminClick={onAdminClick}
        onLogout={handleLogout}
        showRefreshButton={true}
        onRefresh={refreshUserData}
        balance={balance}
      />

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="dashboard-main-content">
          {/* Left Sidebar - Decorative */}
          <div className="dashboard-left-sidebar">
            <div className="dashboard-circuit-pattern">
              <div className="circuit-line circuit-line-1"></div>
              <div className="circuit-line circuit-line-2"></div>
              <div className="circuit-line circuit-line-3"></div>
              <div className="circuit-square circuit-square-1"></div>
              <div className="circuit-square circuit-square-2"></div>
              <div className="circuit-square circuit-square-3"></div>
              <div className="circuit-square circuit-square-4"></div>
              <div className="circuit-square circuit-square-5"></div>
              <div className="circuit-square circuit-square-6"></div>
            </div>
            <div className="dashboard-world-map">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#00ff00" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                <circle cx="12" cy="12" r="2" fill="#00ff00"/>
              </svg>
            </div>
          </div>

          <div className="dashboard-game-container">
            <div className="dashboard-game-list-container">
              <h2 className="dashboard-game-list-title">Chọn Game</h2>
              <div className="dashboard-game-list">
                {loading ? (
                  <div className="loading">Đang tải games...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : games.length > 0 ? (
                  games.slice(0, 8).map((game) => {
                    const selectedLobbyData = getSelectedLobby();
                    const winRate = game.win_rate || Math.floor(Math.random() * (90 - 35 + 1)) + 35;
                    const labelColor = game.label_color || "purple";
                    return selectedLobbyData ? (
                      <div key={game.id} className="dashboard-game-card" onClick={() => handleGameClick(game, selectedLobbyData, winRate)}>
                        {game.label && (
                          <div className={`dashboard-game-label dashboard-game-label-${labelColor}`}>
                            {game.label}
                          </div>
                        )}
                        <div className="dashboard-game-logo-dashboard">
                          <img 
                            src={game.image_url} 
                            alt={game.name} 
                            className="dashboard-game-logo-img"
                            onError={(e) => {
                              // Fallback nếu hình ảnh không load được
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200/000000/00ff00?text=' + encodeURIComponent(game.name);
                            }}
                          />
                        </div>
                        <div className="dashboard-game-name-en">{game.name}</div>
                        <div className="dashboard-game-name-vi">{game.vietnamese_name || game.name}</div>
                        <div className="dashboard-game-percent">
                          <span>Tỉ lệ thắng: </span>{winRate}%
                        </div>
                      </div>
                    ) : null;
                  })
                ) : selectedLobby !== null ? (
                  <div className="no-games">Không có games trong sảnh này</div>
                ) : (
                  <div className="no-games">Vui lòng chọn sảnh game</div>
                )}
              </div>
            </div>
            
            <div className="dashboard-game-lobby-container">
              <h2 className="dashboard-game-lobby-title">Chọn Sảnh Game</h2>
              <div className="dashboard-game-lobby">
                {loading ? (
                  <div className="loading">Đang tải sảnh game...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : lobbies.length > 0 ? (
                  lobbies.map((lobby) => (
                    <div
                      key={lobby.id}
                      className={`dashboard-lobby-card ${selectedLobby === lobby.id ? 'selected' : ''}`}
                      onClick={() => handleLobbyClick(lobby.id)}
                    >
                      <div className="dashboard-lobby-logo">
                        <img
                          src={lobby.image_url}
                          alt={lobby.name}
                          className="dashboard-lobby-logo-img"
                        />
                      </div>
                      <div className="dashboard-lobby-name">{lobby.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-lobbies">Không có sảnh game nào</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="dashboard-social-icons">
        <a
          href="https://t.me/hacknohu79"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon telegram"
          title="Telegram"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.17 1.816-.902 6.223-1.273 8.253-.151.812-.45 1.083-.74 1.11-.63.055-1.108-.417-1.718-.818-.952-.64-1.49-.993-2.414-1.592-1.03-.65-.363-1.008.225-1.592.155-.152 2.828-2.592 2.88-2.81.007-.03.013-.145-.056-.201-.068-.056-.17-.037-.243-.022-.104.023-1.76 1.12-4.97 3.288-.47.31-.896.46-1.28.452-.42-.01-1.23-.237-1.83-.433-.74-.24-1.33-.37-1.28-.78.026-.2.4-.41 1.1-.62 4.24-1.84 7.05-3.05 8.38-3.63 3.95-1.71 4.77-2.01 5.3-2.03.12-.005.39-.028.565.017.22.056.38.184.418.323.06.22.045.345-.03.545z"/>
          </svg>
        </a>
        <a
          href="https://zalo.me/hacknohu79"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon zalo"
          title="Zalo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.5 7.5c.276 0 .5.224.5.5v8c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8c0-.276.224-.5.5-.5h13zM6 9v6h12V9H6zm1 1h10v4H7v-4z"/>
          </svg>
        </a>
      </div>

      {/* Loading Popup */}
      <LoadingPopup 
        isVisible={showLoadingPopup} 
        message="Đang tải dữ liệu game..."
      />
    </div>
  );
};

export default Dashboard;
