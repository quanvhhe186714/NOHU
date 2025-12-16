import React, { useState, useEffect } from 'react';
import '../../css/App.css';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import GameDetail from '../components/GameDetail';
import AdminDashboard from '../components/AdminDashboard';
import ShareButtons from '../components/ShareButton';

type AppState = 'login' | 'register' | 'dashboard' | 'gamedetail' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('login');
  const [selectedGame, setSelectedGame] = useState<{name: string, logo: string, lobbyLogo: string, percent?: string} | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin' || userData.role === 'moderator') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, []);

  const switchToLogin = () => setCurrentPage('login');
  const switchToRegister = () => setCurrentPage('register');
  const switchToDashboard = () => setCurrentPage('dashboard');
  const switchToAdmin = () => setCurrentPage('admin');
  const switchToUserDashboard = () => setCurrentPage('dashboard');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
    setSelectedGame(null);
  };
  
  const handleGameClick = (gameLogo: string, gameName: string, gameLobbyLogo: string, gamePercent?: string) => {
    setSelectedGame({ name: gameName, logo: gameLogo, lobbyLogo: gameLobbyLogo, percent: gamePercent });
    setCurrentPage('gamedetail');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedGame(null);
  };

  return (
    <div className="App">
      <ShareButtons />
      {currentPage === 'gamedetail' ? (
        <GameDetail 
          gameName={selectedGame?.name || ''}
          gameLogo={selectedGame?.logo || ''}
          gameLobbyLogo={selectedGame?.lobbyLogo || ''}
          gamePercent={selectedGame?.percent}
          onBack={handleBackToDashboard}
          onLogout={handleLogout}
          onAdminClick={switchToAdmin}
        />
      ) : currentPage === 'admin' ? (
        <AdminDashboard onBackToDashboard={switchToUserDashboard} />
      ) : currentPage === 'dashboard' ? (
        <Dashboard 
          onLogout={handleLogout} 
          onGameClick={handleGameClick}
          onAdminClick={switchToAdmin}
        />
      ) : (
        <>
          {currentPage === 'login' ? (
            <Login onSwitchToRegister={switchToRegister} onLoginSuccess={switchToDashboard} />
          ) : (
            <Register onSwitchToLogin={switchToLogin} onRegisterSuccess={switchToDashboard} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
