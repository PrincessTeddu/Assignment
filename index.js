import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

// Google Drive API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new Error('No token provided');

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get all letters
app.get('/api/letters', verifyToken, async (req, res) => {
  try {
    const response = await drive.files.list({
      q: "mimeType='application/json' and trashed=false",
      spaces: 'drive',
      fields: 'files(id, name, modifiedTime)'
    });

    const letters = response.data.files;
    res.json(letters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

// Get a specific letter
app.get('/api/letters/:id', verifyToken, async (req, res) => {
  try {
    const file = await drive.files.get({
      fileId: req.params.id,
      alt: 'media'
    });

    res.json(file.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch letter' });
  }
});

// Create a new letter
app.post('/api/letters', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const fileMetadata = {
      name: title,
      mimeType: 'application/json'
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify({ title, content })
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    res.json({ id: file.data.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create letter' });
  }
});

// Update a letter
app.put('/api/letters/:id', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify({ title, content })
    };

    await drive.files.update({
      fileId: req.params.id,
      media: media
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update letter' });
  }
});

// Delete a letter
app.delete('/api/letters/:id', verifyToken, async (req, res) => {
  try {
    await drive.files.delete({
      fileId: req.params.id
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete letter' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});