import { useEffect } from 'react'
import { Box, Button, Typography, Container } from '@mui/material'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

type LoginProps = {
  setUser: (user: {
    id: string
    email: string
    name: string
    photoURL?: string
  } | null) => void
}

const Login = ({ setUser }: LoginProps) => {
  useEffect(() => {
    initializeApp(firebaseConfig)
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/drive.file')
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      setUser({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        photoURL: user.photoURL || undefined
      })
    } catch (error) {
      console.error('Error during Google sign in:', error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography component="h1" variant="h4">
          Welcome to Letter Writer
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Create, edit, and save your letters directly to Google Drive
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoogleLogin}
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  )
}

export default Login