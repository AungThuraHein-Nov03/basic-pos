import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const Layout = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="app-layout">
            {/* Sidebar / Navigation */}
            <aside className="app-sidebar">
                <div className="sidebar-title">
                    BASIC POS
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/journal"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Sales Journal
                    </NavLink>
                </nav>

                <button
                    className="btn theme-toggle-btn"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <div className="sidebar-user">
                    User: Sithu
                </div>
            </aside>

            {/* Main Content */}
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;

