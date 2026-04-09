import { Send, AlertCircle, Eye, Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { useAiChat } from "../../hooks/useAi";
import { useState } from "react";

export function NewAiChat() {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage, error } = useAiChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input;
    setInput("");
    await sendMessage(messageText);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col">
      {/* Header */}
      <header className="h-[56px] px-[24px] flex items-center justify-between bg-white border-b border-[#E5E5E5]">
        <button
          onClick={() => navigate("/")}
          className="text-[16px] font-medium text-[#111111] hover:text-[#1A6BFA] transition-colors"
        >
          MedHistory Lens
        </button>
        <div className="text-[13px] text-[#6B6B6B]">
          Ask AI › Chat
        </div>
        <div className="w-[100px]" /> {/* Spacer for centering */}
      </header>

      {/* Main content - split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left 60% - Chat */}
        <div className="flex-1 flex flex-col" style={{ width: "60%" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-[32px] space-y-[24px]">
            {error && (
              <div className="flex items-start gap-[8px] p-[12px] bg-[#FEE2E2] rounded-[8px] max-w-[600px]">
                <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
                <p className="text-[13px] text-[#991B1B]">Error: {error.message}. Please try again.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-[#1A6BFA] text-white rounded-[12px] px-[20px] py-[12px]"
                      : "bg-white border border-[#E5E5E5] rounded-[12px] px-[20px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <p
                    className={`text-[14px] leading-relaxed whitespace-pre-line ${
                      message.role === "user" ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {message.content}
                  </p>
                  {message.role === "ai" && (
                    <div className="mt-[12px] pt-[12px] border-t border-[#E5E5E5] flex items-center gap-[8px]">
                      <AlertCircle className="w-[12px] h-[12px] text-[#6B6B6B]" strokeWidth={1.5} />
                      <span className="text-[11px] text-[#6B6B6B]">
                        AI-assisted · Not a diagnosis
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E5E5E5] rounded-[12px] px-[20px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center gap-[8px]">
                  <Loader className="w-[16px] h-[16px] text-[#1A6BFA] animate-spin" strokeWidth={1.5} />
                  <span className="text-[14px] text-[#6B6B6B]">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-[24px] border-t border-[#E5E5E5] bg-white">
            <div className="max-w-[900px] mx-auto">
              <div className="flex items-center gap-[12px] bg-white border border-[#E5E5E5] rounded-[24px] px-[24px] py-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your results…"
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#111111] placeholder:text-[#6B6B6B] disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-[32px] h-[32px] rounded-full bg-[#1A6BFA] flex items-center justify-center hover:bg-[#1557CC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-[16px] h-[16px] text-white" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
