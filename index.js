const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    // Use Date.now() for a unique file name plus original name
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint for handling file uploads (e.g., PDF uploads)
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Respond with information about the uploaded file
  res.json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

// Example API endpoint (extend this as needed)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from your backend!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
