import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import SearchCalls from './pages/CallLogs';
import SearchBatches from './pages/BatchList';
import CreateBatchWizard from './pages/CreateBatchWizard';
import EditBatchPage from './pages/EditBatchPage';
import EditTemplate from './pages/EditTemplate';
import Templates from './pages/Templates';
import ContactInsights from './pages/ContactInsights';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Auto-login for testing

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    // Auto-set for testing
    localStorage.setItem('isAuthenticated', 'true');
  }, []);

  const handleLogin = (): void => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="search-calls" element={<SearchCalls />} />
          <Route path="search-batches" element={<SearchBatches />} />
          <Route path="batches/new/:step" element={<CreateBatchWizard />} />
          <Route path="batches/edit/:batchId" element={<EditBatchPage />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/edit/:templateId" element={<EditTemplate />} />
          <Route path="contact-insights" element={<ContactInsights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<HelpCenter />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
