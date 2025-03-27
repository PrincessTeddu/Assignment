import { Outlet } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type User = {
  id: string
  email: string
  name: string
  photoURL?: string
}

type LayoutProps = {
  user: User
  setUser: (user: User | null) => void
}

const Layout = ({ user, setUser }: LayoutProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Letter Writer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/editor')}
            >
              New Letter
            </Button>
            <Avatar
              src={user.photoURL}
              alt={user.name}
              sx={{ width: 32, height: 32 }}
            />
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout