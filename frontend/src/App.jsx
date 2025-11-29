import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {

  return (
    <>
    <BrowserRouter>

    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }  
      />

    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />

    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />

      <Route path='*' element={
          <NotFound />
      }  
      />

      <Route path='/logout' element={
          <Logout />
      }  
      />


    </Routes>
    
    
    </BrowserRouter>

    </>
  )
}

export default App
