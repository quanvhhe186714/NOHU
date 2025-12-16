import React, { useState, useEffect } from "react";
import { adminApi, authApi } from "../services/api";
import {
  FiSearch,
  FiDollarSign,
  FiLock,
  FiUsers,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiArrowLeft,
  FiDownload,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import Header from "./Header";
import "./AdminDashboard.css";
import { ToastContainer, toast } from 'react-toastify';

interface User {
  id: number;
  username: string;
  phone: string;
  balance: number;
  role: string;
  createdAt: string;
}

interface AdminDashboardProps {
  onBackToDashboard?: () => void;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToDashboard,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingExportExcel, setLoadingExportExcel] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [addBalanceAmount, setAddBalanceAmount] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers(searchTerm, currentPage, 8);
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error("Lỗi khi tải danh sách user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load users when component mounts or search/page changes
  useEffect(() => {
    loadUsers();
  }, [searchTerm, currentPage]);

  // Load user info
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username || "");
      setBalance(user.balance || 0);
      setCurrentUserRole(user.role || "");
    }
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  // Handle add balance
  const handleAddBalance = async () => {
    if (!selectedUser) return;

    // Validate input
    if (!addBalanceAmount || addBalanceAmount.trim() === "") {
      toast.error("Vui lòng nhập số xu muốn nạp");
      return;
    }

    const amount = parseInt(addBalanceAmount);
    if (isNaN(amount)) {
      toast.error("Số xu phải là số nguyên dương lớn hơn 0");
      return;
    }

    // Validate maximum amount (optional - prevent too large numbers)
    if (amount > 1000000) {
      toast.error("Số xu không được vượt quá 1,000,000");
      return;
    }

    try {
      const response = await adminApi.addBalance(selectedUser.id, amount);
      if (response.success) {
        toast.success(
          `Đã nạp ${amount.toLocaleString()} xu cho ${selectedUser.username}`
        );
        setShowAddBalanceModal(false);
        setAddBalanceAmount("");
        setSelectedUser(null);
        loadUsers(); // Reload users to see updated balance
      }
    } catch (error: any) {
      toast.error("Lỗi khi nạp xu: " + error.message);
    }
  };

  // Handle update password
  const handleUpdatePassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      const response = await adminApi.updateUserPassword(
        selectedUser.id,
        newPassword
      );
      if (response.success) {
        toast.success(`Đã cập nhật mật khẩu cho ${selectedUser.username}`);
        setShowUpdatePasswordModal(false);
        setNewPassword("");
        setSelectedUser(null);
      }
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật mật khẩu: " + error.message);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoadingExportExcel(true);
      const response = await adminApi.getAllUsers("", 1, 1000000);
      if (response.success) {
        const excelData = response.data.users.map((user) => ({
          ID: user.id,
          Username: user.username,
          ...(currentUserRole !== "moderator" && { Phone: user.phone }),
          Xu: user.balance,
          Role: user.role,
          "Ngày tạo": formatDate(user.createdAt),
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        XLSX.utils.book_append_sheet(wb, ws, "Danh sách người dùng");

        const fileName = `danh_sach_nguoi_dung_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success("Đã xuất file Excel thành công!");
        setLoadingExportExcel(false);
      }
    } catch (error: any) {
      toast.error("Lỗi khi xuất file Excel: " + error.message);
      setLoadingExportExcel(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Filter users based on current user role
  const filteredUsers = users.filter((user) => {
    // If current user is moderator, don't show admin users
    if (currentUserRole === "moderator" && user.role === "admin") {
      return false;
    }
    return true;
  });

  const refreshUserData = async () => {
    try {
      const response = await authApi.getProfile();
      if (response.success && response.data.user) {
        const user = response.data.user;
        setBalance(user.balance || 0);
        setUsername(user.username || "");

        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Lỗi khi refresh user data:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Header
        title={
          currentUserRole === "moderator"
            ? "MODERATOR DASHBOARD"
            : "ADMIN DASHBOARD"
        }
        username={username}
        role={currentUserRole}
        showDashboardButton={!!onBackToDashboard}
        onDashboardClick={onBackToDashboard}
        showAdminButton={false}
        showRefreshButton={true}
        onRefresh={refreshUserData}
        balance={balance}
        pageType="admin"
      />

      <div className="admin-content">
        <div className="admin-header">
          <div className="admin-header-icon">
            <FiUsers size={32} />
          </div>
          <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
        </div>

        <div className="admin-header-actions">
          {currentUserRole === "admin" && (
            <button
              onClick={handleExportExcel}
              className="export-excel-button"
              disabled={
                loading || loadingExportExcel || filteredUsers.length === 0
              }
              style={{ opacity: loadingExportExcel ? 0.5 : 1 }}
              title={loadingExportExcel ? "Đang xử lý..." : ""}
            >
              <FiDownload size={16} />
              <span>Xuất Excel</span>
              {loadingExportExcel && <span>Đang xử lý...</span>}
            </button>
          )}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Tìm kiếm theo username hoặc phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                {/* @ts-ignore */}
                <FiSearch size={16} />
                <span>Tìm kiếm</span>
              </button>
            </form>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span>Đang tải...</span>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  {currentUserRole !== "moderator" && <th>Phone</th>}
                  <th>Xu</th>
                  <th>Role</th>
                  <th>Ngày tạo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td style={{ textAlign: "left" }}>{user.username}</td>
                    {currentUserRole !== "moderator" && <td>{user.phone}</td>}
                    <td className="balance">
                      {user.balance}
                      <FiDollarSign size={14} />
                    </td>
                    <td className={`role ${user.role}`}>{user.role}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className="actions">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowAddBalanceModal(true);
                        }}
                        className="action-button add-balance"
                      >
                        {/* @ts-ignore */}
                        <FiDollarSign size={14} />
                        <span>Nạp xu</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUpdatePasswordModal(true);
                        }}
                        className="action-button update-password"
                      >
                        {/* @ts-ignore */}
                        <FiLock size={14} />
                        <span>Sửa mật khẩu</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="pagination-button"
            >
              {/* @ts-ignore */}
              <FiArrowLeft size={14} />
              <span>Trước</span>
            </button>
            <span className="pagination-info">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              className="pagination-button"
            >
              <span>Sau</span>
              {/* @ts-ignore */}
              <FiArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        )}

        {/* Add Balance Modal */}
        {showAddBalanceModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Nạp xu cho {selectedUser.username}</h3>
              <p>
                Xu hiện tại:{" "}
                <span className="current-balance">
                  {selectedUser.balance.toLocaleString()}
                </span>
              </p>
              <div className="input-group">
                <label htmlFor="balance-input">Số xu muốn nạp:</label>
                <input
                  id="balance-input"
                  type="number"
                  min="-1000000"
                  max="1000000"
                  placeholder="Nhập số xu (dương để nạp, âm để trừ)"
                  value={addBalanceAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Cho phép nhập số âm, dương hoặc chuỗi rỗng
                    if (value === "" || !isNaN(parseInt(value))) {
                      setAddBalanceAmount(value);
                    }
                  }}
                  onKeyPress={(e) => {
                    // Cho phép nhập số, dấu trừ và dấu chấm
                    if (!/[0-9\-\.]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="modal-input"
                  autoFocus
                />
                <small className="input-hint">Tối đa: 1,000,000 xu</small>
              </div>
              <div className="modal-actions">
                <button
                  onClick={handleAddBalance}
                  className="modal-button confirm"
                  disabled={!addBalanceAmount}
                >
                  {/* @ts-ignore */}
                  <FiCheck size={16} />
                  <span>Nạp xu</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddBalanceModal(false);
                    setAddBalanceAmount("");
                    setSelectedUser(null);
                  }}
                  className="modal-button cancel"
                >
                  {/* @ts-ignore */}
                  <FiX size={16} />
                  <span>Hủy</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Password Modal */}
        {showUpdatePasswordModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Cập nhật mật khẩu cho {selectedUser.username}</h3>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="modal-input"
              />
              <div className="modal-actions">
                <button
                  onClick={handleUpdatePassword}
                  className="modal-button confirm"
                >
                  {/* @ts-ignore */}
                  <FiCheck size={16} />
                  <span>Cập nhật</span>
                </button>
                <button
                  onClick={() => {
                    setShowUpdatePasswordModal(false);
                    setNewPassword("");
                    setSelectedUser(null);
                  }}
                  className="modal-button cancel"
                >
                  {/* @ts-ignore */}
                  <FiX size={16} />
                  <span>Hủy</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;
