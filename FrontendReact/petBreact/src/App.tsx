import './index.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUpForm from './components/LoginPage/SignUpForm'
import { DarkModeProvider } from './contexts/DarkModeContext'
import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage/LoginForm'
import Dashboard from './components/PetDashboard/Dashboard'

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  )
}

export default App
