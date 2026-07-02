# Screenshot Recorder 📸

A modern, browser-based screenshot and screen recording tool that you can run directly from GitHub Pages.

## Features

- 🎥 **Screen Recording**: Record your entire screen with customizable quality and frame rate
- 📷 **Screenshots**: Capture single screenshots instantly
- 🎵 **Audio Recording**: Optional audio track for recordings
- ⚙️ **Quality Settings**: Choose between 480p, 720p, and 1080p
- 🎬 **Frame Rate Control**: Select 30 FPS or 60 FPS for smooth recordings
- 💾 **Local Storage**: All recordings are stored in your browser
- ⬇️ **Download**: Export recordings and screenshots in standard formats
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Usage

### Getting Started

1. Open the application at: https://treatwashere.github.io/Screenshot-Recorder-/
2. Grant screen capture permission when prompted
3. Choose your recording settings:
   - Select video quality (480p, 720p, or 1080p)
   - Choose frame rate (30 FPS or 60 FPS)
   - Enable audio if desired
4. Click "Start Recording" or "Capture Screenshot"
5. Select the screen/window you want to capture
6. Stop recording or capture the screenshot
7. Download or view your recordings

### Recording Screen

1. Click **Start Recording**
2. Select the display, application window, or browser tab you want to record
3. Recording will begin automatically
4. Click **Stop Recording** when done
5. Your recording appears in the "Recordings" section

### Capturing Screenshots

1. Click **Capture Screenshot**
2. Select the area of your screen to capture
3. Screenshot is saved immediately
4. Preview appears above and in the recordings list

### Managing Recordings

- **Play**: Watch your recording or screenshot in the preview area
- **Download**: Export as `.webm` (video) or `.png` (image)
- **Delete**: Remove from local storage

## Technical Details

### Technologies

- HTML5 Canvas for screen capture
- MediaRecorder API for recording
- Screen Capture API for display selection
- Web Storage API for local persistence
- WebM codec for video compression

### Browser Compatibility

- Chrome/Chromium 72+
- Firefox 66+
- Edge 79+
- Safari 13+ (with limited support)

## Privacy

✅ **All recordings are stored locally in your browser** - No data is sent to any server

## Local Development

```bash
# Clone the repository
git clone https://github.com/treatwashere/Screenshot-Recorder-.git
cd Screenshot-Recorder-

# Serve locally (Python 3)
python -m http.server 8000

# Or use Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Go to your repository settings
2. Scroll to "GitHub Pages"
3. Select `main` branch as the source
4. Your site will be available at: `https://yourusername.github.io/Screenshot-Recorder-/`

## Limitations

- Recording size is limited by available browser memory
- Maximum recording quality depends on system capabilities
- Some browsers may have security restrictions
- Audio recording may not work on all systems

## License

MIT License - feel free to use and modify!

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
