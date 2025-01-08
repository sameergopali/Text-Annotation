import { useState } from 'react'
import { Navigate, Route , Routes} from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import reactLogo from './assets/react.svg'
import './components/LoginForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import { PrivateRoute } from './components/PrivateRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AnnotationTool from './pages/AnnotationTool.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DiffTool from './pages/DiffTool.jsx'
import Labels from './pages/Labels.jsx'
import LoginPage from './pages/LoginPage.jsx'
import viteLogo from '/vite.svg'


function App() {
  return (
    <div>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/'  element={<Navigate to="/dashboard"/> }/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute>} />
          <Route path='/annotViewer/:folder' element={<PrivateRoute><AnnotationTool /></PrivateRoute>} />
          <Route path='/labels/:name' element={<PrivateRoute><Labels /></PrivateRoute>} />
          <Route path='/difftool' element={<PrivateRoute><DiffTool /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  )

}

export default App
