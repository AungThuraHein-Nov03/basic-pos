import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
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
