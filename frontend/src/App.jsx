import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { AuthProvider } from './auth/AuthContext'


function Dashboard() {
  return <div>Protected dashboard (you'll protect this later)</div>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<div>Home — <a href="/login">Login</a></div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;