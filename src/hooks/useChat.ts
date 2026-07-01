import { useState, useRef } from "react";
import { ChatMessage } from "../types";

export function useChat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Здравствуйте! Я ИИ-помощник доктора Анны Сергеевны. Расскажите, сколько месяцев вашему малышу и что вас беспокоит? Я помогу разобраться на принципах доказательной медицины.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendChatMessage = async (inputStr: string) => {
    if (!inputStr.trim()) return;

    const newMsgs = [...chatMessages, { role: "user" as const, text: inputStr.trim() }];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsChatLoading(true);

    // Auto-scroll
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    try {
      const formattedMsgs = newMsgs.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMsgs }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Server Error");
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
          isEmergencyTriage: data.isEmergencyTriage,
          emergencyTriage: data.emergencyTriage,
          isCareRoute: data.isCareRoute,
          careRoute: data.careRoute,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Извините, произошла ошибка сети при связи с сервером.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return {
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isChatLoading,
    chatEndRef,
    sendChatMessage,
  };
}
