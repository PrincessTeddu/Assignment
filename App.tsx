import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import Layout from './components/Layout'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Login from './pages/Login'

type User = {
  id: string
  email: string
  name: string
  photoURL?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          element={
            user ? <Layout user={user} setUser={setUser} /> : <Navigate to="/login" />
          }
        >
          <Route path="/" element={<Home user={user} />} />
          <Route path="/editor" element={<Editor user={user} />} />
          <Route path="/editor/:id" element={<Editor user={user} />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App