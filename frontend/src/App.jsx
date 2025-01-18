import { Navigate, Route , Routes} from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import { PrivateRoute } from './components/PrivateRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AnnotationTool from './pages/AnnotationPage/AnnotationTool.jsx'
import Dashboard from './pages/DashpoardPage/Dashboard.jsx'
import DiffTool from './pages/DiffPage/DiffTool.jsx'
import Labels from './pages/LabelEditorPage/Labels.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'

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
          <Route path='/codebook/:name' element={<PrivateRoute><Labels /></PrivateRoute>} />
          <Route path='/difftool/:folder' element={<PrivateRoute><DiffTool /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  )

}

export default App
