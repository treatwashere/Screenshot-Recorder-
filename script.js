class ScreenshotRecorder {
    constructor() {
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordings = this.loadRecordings();
        this.init();
    }

    init() {
        document.getElementById('startBtn').addEventListener('click', () => this.startRecording());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopRecording());
        document.getElementById('captureBtn').addEventListener('click', () => this.captureScreenshot());
        this.renderRecordings();
    }

    async startRecording() {
        try {
            const canvas = await this.getCanvas();
            if (!canvas) return;

            const fps = parseInt(document.getElementById('fps').value);
            const stream = canvas.captureStream(fps);

            // Add audio if checked
            if (document.getElementById('audioCheckbox').checked) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioStream.getAudioTracks().forEach(track => stream.addTrack(track));
                } catch (err) {
                    console.log('Audio permission denied, recording video only');
                }
            }

            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 2500000
            });

            this.recordedChunks = [];
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => this.handleRecordingStop();
            this.mediaRecorder.start();
            this.isRecording = true;
            this.updateStatus('Recording... Click "Stop Recording" to finish');
            this.updateButtonStates();
        } catch (err) {
            alert('Error starting recording: ' + err.message);
        }
    }

    async stopRecording() {
        if (!this.mediaRecorder) return;

        this.mediaRecorder.stop();
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.isRecording = false;
        this.updateStatus('Recording stopped. Processing...');
    }

    handleRecordingStop() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toLocaleString();
        const recording = {
            id: Date.now(),
            name: `Recording ${timestamp}`,
            url,
            blob,
            type: 'video',
            date: timestamp
        };

        this.recordings.unshift(recording);
        this.saveRecordings();
        this.renderRecordings();
        this.updateStatus('Recording saved successfully!');
        this.updateButtonStates();
    }

    async captureScreenshot() {
        try {
            const canvas = await this.getCanvas();
            if (!canvas) return;

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const timestamp = new Date().toLocaleString();
                const screenshot = {
                    id: Date.now(),
                    name: `Screenshot ${timestamp}`,
                    url,
                    blob,
                    type: 'image',
                    date: timestamp
                };

                this.recordings.unshift(screenshot);
                this.saveRecordings();
                this.renderRecordings();
                this.updateStatus('Screenshot captured successfully!');
                this.showPreview(url, 'image');
            });
        } catch (err) {
            alert('Error capturing screenshot: ' + err.message);
        }
    }

    async getCanvas() {
        try {
            this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: false
            });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const video = document.createElement('video');
            video.srcObject = this.mediaStream;
            video.play();

            const quality = parseInt(document.getElementById('quality').value);
            const aspectRatio = video.videoWidth / video.videoHeight;
            canvas.height = quality;
            canvas.width = quality * aspectRatio;

            this.mediaStream.getVideoTracks()[0].onended = () => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            };

            let frameCount = 0;
            const fps = parseInt(document.getElementById('fps').value);
            const frameInterval = 1000 / fps;
            let lastTime = Date.now();

            const drawFrame = () => {
                const now = Date.now();
                if (now - lastTime >= frameInterval) {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    }
                    lastTime = now;
                }
                if (this.isRecording || this.mediaStream.active) {
                    requestAnimationFrame(drawFrame);
                }
            };

            drawFrame();
            return canvas;
        } catch (err) {
            if (err.name !== 'NotAllowedError') {
                alert('Error accessing screen: ' + err.message);
            }
            return null;
        }
    }

    showPreview(url, type) {
        const preview = document.getElementById('preview');
        if (type === 'image') {
            preview.innerHTML = `<img src="${url}" alt="Preview">`;
        } else {
            preview.innerHTML = `<video controls src="${url}" style="width: 100%;"></video>`;
        }
    }

    renderRecordings() {
        const container = document.getElementById('recordingsList');
        if (this.recordings.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="icon">📁</div><p>No recordings yet. Start recording or capture a screenshot!</p></div>';
            return;
        }

        container.innerHTML = this.recordings.map(rec => `
            <div class="recording-item">
                <div class="recording-thumbnail">
                    ${rec.type === 'image' ? '🖼️' : '🎬'}
                </div>
                <div class="recording-info">
                    <div class="recording-name">${rec.name}</div>
                    <div class="recording-meta">${rec.date}</div>
                    <div class="recording-actions">
                        <button onclick="window.recorder.playRecording(${rec.id})">Play</button>
                        <button onclick="window.recorder.downloadRecording(${rec.id})">Download</button>
                        <button class="delete" onclick="window.recorder.deleteRecording(${rec.id})">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    playRecording(id) {
        const recording = this.recordings.find(r => r.id === id);
        if (recording) {
            this.showPreview(recording.url, recording.type);
        }
    }

    downloadRecording(id) {
        const recording = this.recordings.find(r => r.id === id);
        if (recording) {
            const a = document.createElement('a');
            a.href = recording.url;
            a.download = `${recording.name}.${recording.type === 'image' ? 'png' : 'webm'}`;
            a.click();
        }
    }

    deleteRecording(id) {
        if (confirm('Delete this recording?')) {
            this.recordings = this.recordings.filter(r => r.id !== id);
            this.saveRecordings();
            this.renderRecordings();
            this.updateStatus('Recording deleted');
        }
    }

    updateStatus(message) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.classList.toggle('recording', this.isRecording);
    }

    updateButtonStates() {
        document.getElementById('startBtn').disabled = this.isRecording;
        document.getElementById('stopBtn').disabled = !this.isRecording;
        document.getElementById('captureBtn').disabled = this.isRecording;
    }

    saveRecordings() {
        const data = this.recordings.map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            date: r.date
        }));
        localStorage.setItem('recordings_meta', JSON.stringify(data));
    }

    loadRecordings() {
        const data = localStorage.getItem('recordings_meta');
        return data ? JSON.parse(data) : [];
    }
}

window.recorder = new ScreenshotRecorder();
