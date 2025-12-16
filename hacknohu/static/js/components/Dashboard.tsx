import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { dashboardApi, Lobby, Game, authApi } from "../services/api";
import Header from "./Header";
import LoadingPopup from "./LoadingPopup";

interface DashboardProps {
  onLogout?: () => void;
  onGameClick?: (gameLogo: string, gameName: string, gameLobbyLogo: string, gamePercent?: string) => void;
  onAdminClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onGameClick, onAdminClick }) => {
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
        
        const response = await dashboardApi.getDashboardData();
        
        if (response.success && response.data.length > 0) {
          setLobbies(response.data);
          setSelectedLobby(response.data[0].id); // Select first lobby by default
        } else {
          setError('Không có dữ liệu sảnh game');
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Lỗi khi tải dữ liệu dashboard');
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
          src="/assets/background.gif"
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
          <div className="dashboard-game-container">
            <div className="dashboard-game-list-container">
              <h2 className="dashboard-game-list-title">Chọn Game</h2>
                          <div className="dashboard-game-list">
              {loading ? (
                <div className="loading">Đang tải games...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : games.length > 0 ? (
                games.map((game) => {
                  const selectedLobbyData = getSelectedLobby();
                  const winRate = Math.floor(Math.random() * (90 - 35 + 1)) + 35;
                  return selectedLobbyData ? (
                    <div key={game.id} className="dashboard-game-card" onClick={() => handleGameClick(game, selectedLobbyData, winRate)}>
                      <div className="dashboard-game-logo-dashboard">
                        <img src={game.image_url} alt={game.name} className="dashboard-game-logo-img" />
                      </div>
                      <div className="dashboard-game-name">{game.name}</div>
                      <div className="dashboard-game-percent">
                        <span style={{color: "#ffffff"}}>Tỉ lệ thắng: </span>{winRate}%
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <div className="no-games">Không có games trong sảnh này</div>
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
                    className={`dashboard-game-card ${selectedLobby === lobby.id ? 'selected' : ''}`}
                    onClick={() => handleLobbyClick(lobby.id)}
                  >
                    <div className="dashboard-game-logo-dashboard">
                      <img
                        src={lobby.image_url}
                        alt={lobby.name}
                        className="dashboard-game-logo-img"
                      />
                    </div>
                    <div className="dashboard-game-name">{lobby.name}</div>
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

      {/* Loading Popup */}
      <LoadingPopup 
        isVisible={showLoadingPopup} 
        message="Đang tải dữ liệu game..."
      />
    </div>
  );
};

export default Dashboard;
