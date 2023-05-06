import React, { useState, useEffect, useRef } from 'react';
import './RecordAudio.css';
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai';
import axios from 'axios';
import { Buffer } from 'buffer';
import { format } from 'date-fns';



function AudioRecorder() {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [audioLink, setAudioLink] = useState('');
    const [audioMessages, setAudioMessages] = useState([]);
    const [textMessages, setTextMessages] = useState([]);
    const [audioLinks, setAudioLinks] = useState([]);
    const userId = '642a3c59a1f9037b6a6708ac';
    const friendId = '642a32c3af8447a65c3199d6';



    useEffect(() => {
        // Instantiate The audio stream
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                // sourceNode.connect(audioContext.destination);
                // audioRef.current.srcObject = stream;
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = handleDataAvailable;
                console.log(stream);
            })
            .catch(function (err) {
                console.log('Error getting audio from microphone: ' + err);
            });
    }, [])

    const getConversation = async () => {
        axios.get(`http://localhost:8000/api/messages/get-conversation/${userId}/${friendId}`)
            .then((res) => {
                setAudioMessages(res.data);
                const messages = res.data.messages;
                console.log('The conversation has been retrieved', messages);
                setAudioLinks([]);
                setTextMessages([]);
                for (let i = 0; i < messages?.length; i++) {
                    if (messages[i].type === 'buffer') {
                        const buffer = Buffer.from(messages[i].message, 'base64');
                        // Create a Blob object from the Buffer data
                        const blobDB = new Blob([buffer], { type: 'audio/wav' });
                        const audioUrlDB = URL.createObjectURL(blobDB);
                        console.log(audioUrlDB);
                        setAudioLinks(links => [...links, audioUrlDB]);
                        console.log('audioUrlbDB ', audioUrlDB);
                    } else {
                        setTextMessages(textMessages => [...textMessages, messages[i].message])
                    }
                }
                console.log('The audioLinks are: ', audioLinks);
                // base64-encoded string
                // from binary data to Buffer
                const buffer = Buffer.from(messages[6].message, 'base64');

                // Create a Blob object from the Buffer data
                const blobDB = new Blob([buffer], { type: 'audio/wav' });
                const audioUrlDB = URL.createObjectURL(blobDB);
                setAudioLink(audioUrlDB);
            })
            .catch((error) => {
                console.log('An error was occurred while getting the conversation: ', error);
            })

    }

    const handleStartRecording = async () => {

        setRecording(true);
        await mediaRecorderRef.current.start();
    }

    const handleStopRecording = async () => {
        setRecording(false);
        await mediaRecorderRef.current.stop();
    }

    function handleDataAvailable(event) {
        chunksRef.current.push(event.data);
    }

    const handleSaveRecording = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioLink(audioUrl);
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        const currentTimeInMilliseconds = Date.now();
        downloadLink.download = `${currentTimeInMilliseconds}`;
        downloadLink.click();
        console.log('the audio Blob is: ', audioBlob);
        console.log('The chunkRef is: ', chunksRef.current);

        const formData = new FormData();

        // const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
        const Blob2buffer = Buffer.from(await audioBlob.arrayBuffer());
        console.log('From Blob to Buffer: ', Blob2buffer);



        //  From Buffer to Blob
        const buffer2Blob = new Blob([Blob2buffer], { type: 'audio/wav' });

        const audioUrlBlob = URL.createObjectURL(buffer2Blob);
        setAudioLink(audioUrlBlob);
        formData.append('file', buffer2Blob, `${currentTimeInMilliseconds}`);

        const date = new Date(); // create a new Date object with the current date and time
        const formattedDate = format(date, "HH:mm:ss/yyyy-MM-dd");
        formData.append('userInfo', JSON.stringify({
            userId: userId,
            friendId: friendId,
            date: formattedDate
        }));

        axios.post('http://localhost:8000/api/messages/add-audio-message',
            formData
            ,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }
        ).then(res => {
            console.log('The audioBlob in the request: ', formData);
            console.log('The audio message has been saved successfully', res.data);
            chunksRef.current = [];
            // const blobRes = [...res.data];
            // const audioBlob = new Blob(blobRes, { type: 'audio/wav' });
            // const audioUrlBlob = URL.createObjectURL(audioBlob);
            // console.log('Blob ')
            // setAudioLink(audioUrlBlob);
            // console.log('audioUrlBlob', audioUrlBlob);

        }).catch((err) => {
            console.log('An error was occurred while saving the audio message', err);
        })
        console.log('The chunkRef is: ', chunksRef);
    }

    return (
        <div className='audio-recorder'>
            <audio controls src={audioLink}></audio>
            {!recording && <AiOutlineAudio onClick={handleStartRecording}
                className='speak-icon icon' />}
            {!recording && <AiOutlineAudioMuted onClick={handleStopRecording}
                className='mute-icon icon'
            />}
            <button onClick={handleSaveRecording}>Save Recording</button>
            <button className='get-audios' onClick={getConversation}>Get Audio</button>
            <div className="text-messages">
                <h5>Audios</h5>
                {textMessages.map((message, index) =>
                    <span key={index}>
                        <p>{message}</p>
                        <br />
                    </span>
                )}
                {audioLinks.map((audioSrc, index) =>
                    <span key={index}>
                        <audio controls src={audioSrc}></audio>
                        <br />
                    </span>
                )}
            </div>
        </div>
    );
}

export default AudioRecorder;
