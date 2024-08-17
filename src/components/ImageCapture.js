import { useState, useRef } from 'react';

export default function ImageCapture() {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setImage(canvas.toDataURL('image/png'));
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '500px' }}></video>
      <button onClick={startCamera} style={{ marginTop: '10px' }}>Start Camera</button>
      <button onClick={captureImage} style={{ marginTop: '10px', marginLeft: '10px' }}>Capture Image</button>
      {image && <img src={image} alt="Captured" style={{ marginTop: '20px', width: '100%', maxWidth: '500px' }} />}
    </div>
  );
}
