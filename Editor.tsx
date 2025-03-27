import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { Editor as DraftEditor, EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'

type User = {
  id: string
  email: string
  name: string
  photoURL?: string
}

type EditorProps = {
  user: User
}

const Editor = ({ user }: EditorProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  useEffect(() => {
    const fetchLetter = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/letters/${id}`, {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        const data = await response.json();
        setTitle(data.title);
        setEditorState(
          EditorState.createWithContent(
            convertFromRaw(data.content)
          )
        );
      } catch (error) {
        console.error('Error fetching letter:', error);
        setNotification({
          open: true,
          message: 'Error loading letter',
          severity: 'error'
        });
      }
    };

    fetchLetter();
  }, [id, user])

  const handleSave = async () => {
    if (!title.trim()) {
      setNotification({
        open: true,
        message: 'Please enter a title for your letter',
        severity: 'error'
      })
      return
    }

    try {
      setSaving(true)
      const content = convertToRaw(editorState.getCurrentContent())
      
      const endpoint = id
        ? `http://localhost:3000/api/letters/${id}`
        : 'http://localhost:3000/api/letters';
      
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) throw new Error('Failed to save letter');
      
      const data = await response.json();
      if (!id) {
        navigate(`/editor/${data.id}`);
      }

      setNotification({
        open: true,
        message: 'Letter saved successfully',
        severity: 'success'
      })
    } catch (error) {
      console.error('Error saving letter:', error)
      setNotification({
        open: true,
        message: 'Error saving letter',
        severity: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    try {
      await fetch(`http://localhost:3000/api/letters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      navigate('/')
    } catch (error) {
      console.error('Error deleting letter:', error)
      setNotification({
        open: true,
        message: 'Error deleting letter',
        severity: 'error'
      })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Tooltip title="Back to Letters">
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {id ? 'Edit Letter' : 'New Letter'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          Save to Drive
        </Button>
        {id && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        label="Letter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Paper className="editor-container">
        <DraftEditor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Start writing your letter..."
        />
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Editor