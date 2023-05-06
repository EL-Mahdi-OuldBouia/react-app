import React, { useState } from "react";
import ReactPlayer from "react-player";
import './MediaPlayer.css';

function MediaPlayer() {
    const [audioFile, setAudioFile] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setAudioFile(URL.createObjectURL(file));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const controlStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '4px',
        color: '#fff',
        padding: '8px',
    };
    return (
        <div onDrop={handleDrop} onDragOver={handleDragOver} >
            {!audioFile && <input type="file" />}
            {audioFile && <><ReactPlayer url={audioFile} controls className="media-player"

                style={{ backgroundImage: " url('./assets/music_note.jpg')" }}
            />
                <div style={controlStyle}>My custom controls</div>
            </>}
        </div>
    );
}

export default MediaPlayer;
