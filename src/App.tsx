import { useState } from 'react';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import MarketplaceView from './views/MarketplaceView';
import DashboardView from './views/DashboardView';
import { ViewState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {currentView === 'home' && <HomeView setView={setCurrentView} />}
      {currentView === 'marketplace' && <MarketplaceView />}
      {currentView === 'dashboard' && <DashboardView />}
    </Layout>
  );
}
