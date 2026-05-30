import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function LiveSelfieScreen() {
  const navigate = useNavigate();
  const { login } = useStore();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [streamError, setStreamError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selfieBlob, setSelfieBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    let activeStream = null;
    const startCamera = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        setStreamError('Camera access denied or unavailable.');
      }
    };
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (streamError || !videoRef.current) return;
    
    setIsCapturing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        setSelfieBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Simulate payload preparation for backend upload
        const formData = new FormData();
        formData.append('document_type', 'SELFIE');
        formData.append('file', blob);
        
        // Simulate network upload
        setTimeout(() => {
          login();
          localStorage.setItem('picker_kyc_version', 'v1');
          localStorage.setItem('picker_kyc_completed', 'true');
          localStorage.setItem('picker_kyc_current_step', 'completed');
          navigate('/home');
        }, 1500);
      } else {
        setIsCapturing(false);
        setStreamError('Failed to capture image.');
      }
    }, 'image/jpeg', 0.85);
  };

  return (
    <div className="onboarding-flow bg-[#03110D] relative overflow-hidden">
      {/* Hidden canvas for extraction */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Actual camera view background */}
      <div className="absolute inset-0 bg-[#071A14]">
        {previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover opacity-80" alt="Selfie Preview" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover opacity-80"
          />
        )}
      </div>

      <div className="absolute top-12 left-6 w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] flex items-center justify-center z-10" onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
        {/* Dashed Oval Frame */}
        <div className="relative w-64 h-80 rounded-[100px] border-4 border-dashed border-[#2FE081] flex items-center justify-center bg-[rgba(255,255,255,0.03)] shadow-[0_0_50px_rgba(47,224,129,0.1)] overflow-hidden">
          {streamError ? (
            <p className="text-red-500 font-bold text-center px-4">{streamError}</p>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
              <p className="text-[15px] font-bold text-white mb-2 shadow-black drop-shadow-md">Align your face inside the frame</p>
              <p className="text-[13px] text-[rgba(255,255,255,0.8)] shadow-black drop-shadow-md">Look straight at the camera</p>
            </div>
          )}
        </div>
      </div>

      <div className="pb-8 pt-4 z-10 shrink-0 w-full flex justify-center mt-auto" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 12px))' }}>
        <button 
          onClick={handleCapture}
          disabled={isCapturing || !!streamError}
          className="w-20 h-20 rounded-full bg-[rgba(47,224,129,0.2)] border-4 border-[#2FE081] flex items-center justify-center transition-transform active:scale-90 shrink-0 disabled:opacity-50 disabled:active:scale-100"
        >
          {isCapturing ? (
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#2FE081] shadow-[0_0_20px_rgba(47,224,129,0.5)]"></div>
          )}
        </button>
      </div>
    </div>
  );
}
