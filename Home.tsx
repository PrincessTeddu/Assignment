import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'

type User = {
  id: string
  email: string
  name: string
  photoURL?: string
}

type Letter = {
  id: string
  title: string
  lastModified: string
  content: string
}

type HomeProps = {
  user: User
}

const Home = ({ user }: HomeProps) => {
  const navigate = useNavigate()
  const [letters, setLetters] = useState<Letter[]>([])

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/letters', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        const data = await response.json();
        const letters = data.map((letter: any) => ({
          id: letter.id,
          title: letter.name,
          lastModified: new Date(letter.modifiedTime).toLocaleDateString(),
          content: ''
        }));
        setLetters(letters);
      } catch (error) {
        console.error('Error fetching letters:', error);
      }
    };

    fetchLetters()
  }, [user.id])

  const handleCreateLetter = () => {
    navigate('/editor')
  }

  const handleEditLetter = (letterId: string) => {
    navigate(`/editor/${letterId}`)
  }

  const handleDeleteLetter = async (letterId: string) => {
    try {
      await fetch(`http://localhost:3000/api/letters/${letterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      setLetters(letters.filter(letter => letter.id !== letterId));
    } catch (error) {
      console.error('Error deleting letter:', error);
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Letters
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateLetter}
        >
          Create New Letter
        </Button>
      </Box>

      <Grid container spacing={3}>
        {letters.map(letter => (
          <Grid item xs={12} sm={6} md={4} key={letter.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" noWrap>
                  {letter.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Last modified: {letter.lastModified}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {letter.content}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEditLetter(letter.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteLetter(letter.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Home