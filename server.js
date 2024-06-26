const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });
const videosFile = path.join(__dirname, 'videos.json');

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper function to read and write videos.json
const readVideos = () => JSON.parse(fs.readFileSync(videosFile, 'utf8'));
const writeVideos = (videos) => fs.writeFileSync(videosFile, JSON.stringify(videos, null, 2));

// Routes
app.post('/upload', upload.single('video'), (req, res) => {
    const file = req.file;
    const videos = readVideos();

    const newVideo = {
        id: videos.length + 1,
        path: file.path,
        url: `http://localhost:${port}/uploads/${file.filename}`,
        approved: false,
        reports: 0
    };

    videos.push(newVideo);
    writeVideos(videos);

    res.status(201).json({ message: 'Video uploaded and awaiting approval.', video: newVideo });
});

app.get('/videos', (req, res) => {
    const videos = readVideos().filter(video => video.approved);
    res.json(videos);
});

app.post('/approve/:id', (req, res) => {
    const videos = readVideos();
    const video = videos.find(v => v.id == req.params.id);

    if (video) {
        video.approved = true;
        writeVideos(videos);
        res.json({ message: 'Video approved.', video });
    } else {
        res.status(404).json({ message: 'Video not found.' });
    }
});

app.post('/report/:id', (req, res) => {
    const videos = readVideos();
    const video = videos.find(v => v.id == req.params.id);

    if (video) {
        video.reports += 1;
        writeVideos(videos);
        res.json({ message: 'Video reported.', video });
    } else {
        res.status(404).json({ message: 'Video not found.' });
    }
});

// Create videos.json if it doesn't exist
if (!fs.existsSync(videosFile)) {
    fs.writeFileSync(videosFile, '[]');
}

// Create uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});