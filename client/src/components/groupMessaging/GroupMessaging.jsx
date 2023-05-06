import React, { useState, useRef, useEffect } from 'react';
import './GroupMessaging.css';
import { MdOutlineAttachFile } from "react-icons/md";
import { CiMicrophoneOn, CiMicrophoneOff } from 'react-icons/ci';
import { BsEmojiSmile, BsRecordCircle } from 'react-icons/bs';
import { motion } from "framer-motion";
import { Buffer } from 'buffer';
import { format } from 'date-fns';
// import Recorder from 'recorder-js';
import axios from 'axios';


const GroupMessaging = ({ allMsgGivenGroup, setAllMsgGivenGroup }) => {
  const scrollRef = useRef(0);
  const [isRecording, setIsRecording] = useState(false);
  const [oneTextMsg, setOneTextMsg] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);


  useEffect(() => {
    // Instantiate The audio stream
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      })
      .catch(function (err) {
        console.log('Error getting audio from microphone: ' + err);
      });
  }, [])




  const handleStartRecording = async () => {
    setIsRecording(true);
    chunksRef.current = [];
    await mediaRecorderRef.current.start();
  }
  const handleStopRecording = async () => {
    await mediaRecorderRef.current.stop()
  }

  const handleDataAvailable = async (event) => {
    chunksRef.current.push(event.data);
  }

  const handleSaveRecording = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    

    const date = new Date(); // create a new Date object with the current date and time
    const formattedDate = format(date, "HH:mm:ss/yyyy-MM-dd");
    const newMsg = {
      sender: 'steve',
      msg: audioUrl,
      date: formattedDate,
      type: 'audio',
      groupName: 'my group',
    }
    const buffer = await blobToBuffer(audioBlob);

    setAllMsgGivenGroup(msgs => [...msgs, newMsg]);
    setIsRecording(false);

    await axios.post('http://localhost:8000/api/groups/add-message',
      JSON.stringify({
        sender: 'steve',
        msg: buffer,
        date: formattedDate,
        type: 'audio',
        groupName: 'my group'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

  }

  const saveAudio = async () => {
    await handleStopRecording();
    setTimeout(async () => {
      await handleSaveRecording();
    }, 1);

  }

  async function blobToBuffer(blob) {
    const buffer = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result
        const buffer = Buffer.from(arrayBuffer)
        resolve(buffer)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })

    return buffer;
  }



  const writeNewGroupMessage = async () => {
    if (oneTextMsg.trim() !== '') {
      const date = new Date(); // create a new Date object with the current date and time
      const formattedDate = format(date, "HH:mm:ss/yyyy-MM-dd");
      const newMsg = {
        sender: 'steve',
        msg: oneTextMsg,
        date: formattedDate,
        type: 'text',
        groupName: 'my group',
      }
      setAllMsgGivenGroup(msgs => [...msgs, newMsg]);

      setOneTextMsg('');
      await axios.post('http://localhost:8000/api/groups/add-message',
        JSON.stringify(newMsg),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

  }

  const sendViaKey = (e) => {
    if (e.code === 'Enter' && oneTextMsg !== '') {
      writeNewGroupMessage();
    }
  }


  return (
    <div className='group-messaging'>
      <div ref={scrollRef} className="group-conversation">
        {/* {allMsgGivenGroup.map((msg, index) => <audio key={index} controls src={`${msg.msg}`} />)} */}
        {allMsgGivenGroup && allMsgGivenGroup.map((msg, index) => <MsgFromUser key={index}
          msg={msg} />)}
      </div>
      <div className="writing-file-sharing">
        <textarea onChange={e => setOneTextMsg(e.target.value)}
          value={oneTextMsg}
          onKeyDown={sendViaKey}
          name="message" id="" cols="38" rows="8"></textarea>
        <div className="attach-voice-emoji-send">
          <div className="attach-voice-emoji">
            {!isRecording ? (
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 3, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                exit={{ y: -20 }}
              >
                <CiMicrophoneOn onClick={handleStartRecording}
                  className='mic-icon icon' />
              </motion.div>
            )
              :
              <motion.div
                initial={{ y: -25 }}
                animate={{
                  opacity: 1,
                  scale: [1, 0.89, 1],
                  transition: { duration: 1.5, repeat: Infinity, repeatType: "loop" },
                }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
              ><CiMicrophoneOff onClick={() => setIsRecording(false)}
                className='cancel-recording-icon icon' /></motion.div>}

            {isRecording && <motion.div
              initial={{ y: 0 }}
              animate={{ x: -27, y: 3 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            ><BsRecordCircle onClick={saveAudio}
              className='recording-icon icon' /></motion.div>}

            <motion.div
              initial={{ y: 0 }}
              animate={isRecording ? { x: -27, y: 3 } : { y: 3 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <MdOutlineAttachFile className='attach-icon icon' />

              <BsEmojiSmile className='emoji-icon icon' />
            </motion.div>


          </div>
          <button onClick={writeNewGroupMessage}
            className='send-msg'>send</button>
        </div>
      </div>
    </div>
  )
}

const MsgFromUser = ({ msg }) => {

  return (
    msg.type === 'text' ? <div className={`one-msg${msg.sender === 'steve' ? '-right' : ''}`}>
      <div className="name-pic">
        <img src="./assets/pic-1.png" alt="" />
        <h6>friend name</h6>
      </div>
      <div className="msg-container">
        <p className='msg'>{msg.msg}</p>
        <p className='msg-date'>{msg.date}</p>
      </div>
    </div>
      :
      <audio className='right' controls src={msg.msg} />

  )
}

export default GroupMessaging;