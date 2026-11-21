import React, { useState, useEffect } from 'react';
import { Bell, Sun, Moon, AlertTriangle, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ALERTS } from '../../data/mockData';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [showNotif, setShowNotif] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        setShowUserMenu(false);
        logout();
        navigate('/login', { replace: true });
    };
    const [hasCritical] = useState(ALERTS.some(a => a.type === 'critical' && !a.read));
    const unread = ALERTS.filter(a => !a.read).length;

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.notif-container')) setShowNotif(false);
            if (!e.target.closest('.user-menu-container')) setShowUserMenu(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    return (
        <header className="navbar">
            <div className="navbar-left">
                {hasCritical && (
                    <div className="critical-banner">
                        <span className="blink"><AlertTriangle size={13} /></span>
                        <span>Critical alert on MG Road — immediate action required</span>
                    </div>
                )}
            </div>

            <div className="navbar-right">
                {/* Theme Toggle */}
                <button
                    className="icon-btn theme-toggle-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark'
                        ? <Sun size={17} color="#ffdd57" />
                        : <Moon size={17} color="#6366f1" />
                    }
                </button>

                {/* Notifications */}
                <div className="notif-container">
                    <button
                        className={`icon-btn ${hasCritical ? 'pulse-btn' : ''}`}
                        onClick={() => setShowNotif(s => !s)}
                        aria-label="Notifications"
                    >
                        <Bell size={17} />
                        {unread > 0 && <span className="notif-badge">{unread}</span>}
                    </button>

                    {showNotif && (
                        <div className="notif-dropdown">
                            <div className="notif-header">
                                <span>Notifications</span>
                                <span className="notif-count">{unread} unread</span>
                            </div>
                            <div className="notif-list">
                                {ALERTS.slice(0, 5).map(a => (
                                    <div key={a.id} className={`notif-item ${a.read ? 'read' : ''} ${a.type === 'critical' ? 'notif-critical' : ''}`}>
                                        <span className="notif-icon">{a.icon}</span>
                                        <div>
                                            <p className="notif-title">{a.title}</p>
                                            <p className="notif-time">{a.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Avatar + account menu */}
                <div className="user-menu-container">
                    <button
                        type="button"
                        className="user-pill"
                        onClick={() => setShowUserMenu(s => !s)}
                        aria-haspopup="menu"
                        aria-expanded={showUserMenu}
                        aria-label="Account menu"
                    >
                        <div className="user-avatar">{user?.avatar}</div>
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="user-dropdown" role="menu">
                            <div className="user-dropdown-header">
                                <span className="user-name">{user?.name}</span>
                                <span className="user-email">{user?.email}</span>
                            </div>
                            <button
                                type="button"
                                role="menuitem"
                                className="user-dropdown-item"
                                onClick={() => { setShowUserMenu(false); navigate(`/${user?.role}/settings`); }}
                            >
                                <Settings size={15} /> Settings
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                className="user-dropdown-item logout"
                                onClick={handleLogout}
                            >
                                <LogOut size={15} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
