import { useState, useRef, useEffect } from "react";

interface VoiceButtonProps {
  text: string;
}

export function VoiceButton({ text }: VoiceButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const speak = async () => {
    if (!text) return;

    if (speaking && audioRef.current) {
      audioRef.current.pause();
      setSpeaking(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch TTS from backend edge-tts endpoint
      const response = await fetch("http://localhost:8000/api/ai/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("auth_token") && localStorage.getItem("auth_token") !== "guest" ? { "Authorization": `Bearer ${localStorage.getItem("auth_token")}` } : {})
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("TTS failed");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = url;
      audioRef.current.onplay = () => setSpeaking(true);
      audioRef.current.onended = () => setSpeaking(false);
      audioRef.current.onerror = () => {
        setSpeaking(false);
        setLoading(false);
      };
      
      setLoading(false);
      await audioRef.current.play();
    } catch (err) {
      console.error("Audio generation error:", err);
      setSpeaking(false);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={speak}
      disabled={loading}
      className={`px-[16px] py-[10px] rounded-[16px] flex items-center justify-center gap-[8px] text-[14px] font-medium transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] ${
        speaking 
          ? "bg-[#10B981]/20 text-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.3)] border border-[#10B981]/30" 
          : "bg-[#1F2937]/50 text-[#E5E7EB] hover:bg-[#374151]/80 hover:text-white border border-[#374151]/60 backdrop-blur-md"
      }`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : speaking ? (
        <span className="text-[16px] animate-pulse">??</span>
      ) : (
        <span className="text-[16px]">??</span>
      )}
      {speaking ? "Stop Listening" : loading ? "Preparing..." : "Listen to Doctor"}
    </button>
  );
}
