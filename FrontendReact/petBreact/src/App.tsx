import './index.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignUpForm from './components/LoginPage/SignUpForm'

import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage/LoginForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
