import React, { useState, useRef, useEffect } from 'react';
import { notification } from 'antd';
import { useTheme } from "@mui/material";
import { tokens } from '../../theme';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(() => {
    return localStorage.getItem('isRecording') == false;
  });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    localStorage.setItem('isRecording', isRecording);
  }, [isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    const media = new MediaRecorder(stream);
    streamRef.current = stream;

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
    if (streamRef.current && streamRef.current.active) {
      notification.warning({
        message: 'Acción Requerida',
        description: 'Por favor, deja de compartir la pantalla antes de detener la grabación.',
      });
      return;
    }

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
    <div className="flex flex-col items-center p-4 space-y-4 min-h-screen">
      <video 
      ref={videoRef} 
      autoPlay 
      className="w-full max-w-2xl rounded shadow-lg border-2"
      style={{ border: `4px solid ${colors.greenAccent[500]}`}}
      ></video>
      <div>
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md shadow"
          >
            Detener Grabación
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md shadow"
          >
            Iniciar Grabación
          </button>
        )}
      </div>
    </div>
  );
};

export default ScreenRecorder;