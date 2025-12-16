import React from "react";
import {
  LogOutIcon,
  ArrowLeftIcon,
  UserIcon,
  RefreshIcon,
  StarIcon,
  MenuIcon,
} from "./icons";
import "../../css/components/Header.css";

interface HeaderProps {
  title: string;
  username?: string;
  role?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showAdminButton?: boolean;
  onAdminClick?: () => void;
  onLogout?: () => void;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  balance?: number;
  pageType?: 'admin' | 'game-detail' | 'default';
  showDashboardButton?: boolean;
  onDashboardClick?: () => void;
}

const Header = ({
  title,
  username,
  role,
  showBackButton = false,
  onBackClick,
  showAdminButton = false,
  onAdminClick,
  onLogout,
  showRefreshButton = false,
  onRefresh,
  balance,
  pageType = 'default',
  showDashboardButton = false,
  onDashboardClick,
}: HeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          {isMobile && username && (
            <button className="header-drawer-button" onClick={toggleDrawer}>
              <MenuIcon size={20} />
            </button>
          )}
          <h1 className="header-title">{title}</h1>
        </div>
        <div className="header-right">
          {!isMobile && username && (
            <div className="header-user-info">
              <span className="header-username">{username}</span>
              {showRefreshButton && onRefresh && (
                <div className="header-balance">
                  <span className="header-balance-amount">{balance} xu</span>
                  <button
                    className="header-refresh-button"
                    onClick={onRefresh}
                    title="Làm mới dữ liệu"
                  >
                    <RefreshIcon size={14} />
                  </button>
                </div>
              )}
              {showDashboardButton && onDashboardClick && (
                <button className="header-dashboard-button" onClick={onDashboardClick}>
                  <ArrowLeftIcon size={16} />
                  <span>Dashboard</span>
                </button>
              )}
              {showAdminButton && (role === "admin" || role === "moderator") && onAdminClick && (
                <button className="header-admin-button" onClick={onAdminClick}>
                  <StarIcon size={16} />
                  <span>Admin</span>
                </button>
              )}
              <button
                className="header-logout-button"
                onClick={onLogout || handleLogout}
              >
                <LogOutIcon size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
          {isMobile && (
            <div className="header-balance-mobile">
              <span className="header-balance-amount">{balance} xu</span>
            </div>
          )}
        </div>
      </div>

      {/* Back Button for Mobile - Position Absolute */}
      {isMobile && showBackButton && onBackClick && (
        <div className="header-back-mobile">
          <button className="header-back-button-mobile" onClick={onBackClick}>
            <ArrowLeftIcon size={16} />
          </button>
        </div>
      )}

      {!isMobile && showBackButton && onBackClick && (
        <div className={`header-back-desktop header-back-${pageType}`}>
          <button className="header-back-button-desktop" onClick={onBackClick}>
            <ArrowLeftIcon size={24} />
          </button>
        </div>
      )}

      {/* Drawer for Mobile */}
      {isMobile && (
        <div
          className={`drawer-overlay ${isDrawerOpen ? "active" : ""}`}
          onClick={closeDrawer}
        >
          <div
            className={`drawer ${isDrawerOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <h3>Menu</h3>
              <button className="drawer-close" onClick={closeDrawer}>
                <ArrowLeftIcon size={20} />
              </button>
            </div>
            <div className="drawer-content">
              {username && (
                <div className="drawer-user-info">
                  <div className="drawer-username">
                    <UserIcon size={16} />
                    <span>{username}</span>
                  </div>
                  {role && (
                    <div className={`drawer-role ${role}`}>
                      {role === "admin" || role === "moderator" ? (
                        <StarIcon size={16} />
                      ) : (
                        <UserIcon size={16} />
                      )}
                      <span>{role.toUpperCase()}</span>
                    </div>
                  )}
                  <div className="drawer-balance">
                    <span>Số xu: {balance}</span>
                    {showRefreshButton && onRefresh && (
                      <button
                        className="drawer-refresh-button"
                        onClick={onRefresh}
                      >
                        <RefreshIcon size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="drawer-actions">
                {showDashboardButton && onDashboardClick && (
                  <button
                    className="drawer-dashboard-button"
                    onClick={() => {
                      onDashboardClick();
                      closeDrawer();
                    }}
                  >
                    <ArrowLeftIcon size={16} />
                    <span>Dashboard</span>
                  </button>
                )}
                {showAdminButton && (role === "admin" || role === "moderator") && onAdminClick && (
                  <button
                    className="drawer-admin-button"
                    onClick={() => {
                      onAdminClick();
                      closeDrawer();
                    }}
                  >
                    <StarIcon size={16} />
                    <span>Admin Panel</span>
                  </button>
                )}
                <button
                  className="drawer-logout-button"
                  onClick={() => {
                    (onLogout || handleLogout)();
                    closeDrawer();
                  }}
                >
                  <LogOutIcon size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
