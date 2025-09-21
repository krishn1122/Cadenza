import React, { ReactNode } from 'react';
import Header from './Header';
import SideNav from './SideNav';
import './MainLayout.scss';

interface MainLayoutProps {
  children: ReactNode;
  activePage?: 'home' | 'admin' | 'leads' | 'search';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activePage = 'home' }) => {
  return (
    <div className="main-layout">
      <SideNav activePage={activePage} />
      <div className="content-area">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
