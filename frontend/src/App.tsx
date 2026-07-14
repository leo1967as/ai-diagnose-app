import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/Home'
import Loading from './pages/Loading'
import Analysis from './pages/Analysis'
import Result from './pages/Result'
import Error from './pages/Error'

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/result" element={<Result />} />
          <Route path="/error" element={<Error />} />
          {/* Redirect any unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="app-footer">
          <p>หากมีคำถามหรือต้องการสอบถามเพิ่มเติม สามารถติดต่อได้ที่ <a href="mailto:narawit.j@kkumail.com">narawit.j@kkumail.com</a></p>
        </footer>
      </div>
    </Router>
  )
}

export default App