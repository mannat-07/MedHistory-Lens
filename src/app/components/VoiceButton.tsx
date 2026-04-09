import { useRef, useState } from "react";

interface VoiceButtonProps {
  text: string;
}

export function VoiceButton({ text }: VoiceButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = () => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      /samantha|google us english|aria|zira|jenny|davis/i.test(v.name)
    );
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="px-3 py-2 rounded-lg bg-[#111827] text-white text-sm hover:bg-[#1f2937] transition-colors"
    >
      {speaking ? "🔊 Speaking..." : "🔊 Listen to Doctor"}
    </button>
  );
}
