import React, { useState, useRef, useEffect } from 'react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(() => {
    return localStorage.getItem('isRecording') == false;
  });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('isRecording', isRecording);
  }, [isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    const media = new MediaRecorder(stream);

    media.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    }

    media.start();
    setMediaRecorder(media);
    setIsRecording(true);
    videoRef.current.srcObject = stream;
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'screen-recording.webm';
    a.click();
    window.URL.revokeObjectURL(url);

    setRecordedChunks([])
    setMediaRecorder(null)
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
      <div>
        {isRecording ? (
          <button onClick={stopRecording}>Detener Grabación</button>
        ) : (
          <button onClick={startRecording}>Iniciar Grabación</button>
        )} 
      </div>
    </div>
  );
};

export default ScreenRecorder;