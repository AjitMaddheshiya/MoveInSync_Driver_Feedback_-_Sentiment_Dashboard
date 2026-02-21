import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import FeedbackPage from './pages/FeedbackPage'
import DashboardPage from './pages/DashboardPage'
import DriversPage from './pages/DriversPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/feedback" replace />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/drivers" element={<Layout><DriversPage /></Layout>} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
