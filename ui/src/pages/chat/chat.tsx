import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useEffect } from "react";
import { message, ChatSession } from "../../interfaces/interfaces";
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from "@/components/custom/sidebar";

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('chat-sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const messageText = text || question;
    if (!messageText.trim()) return;
    
    setIsLoading(true);
    
    const traceId = uuidv4();
    const newUserMsg: message = { content: messageText, role: "user", id: traceId };
    
    let updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setQuestion("");

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = uuidv4();
      setCurrentSessionId(activeSessionId);
      
      const newSession: ChatSession = {
        id: activeSessionId,
        title: messageText,
        updatedAt: Date.now(),
        messages: updatedMessages
      };
      setSessions(prev => [...prev, newSession]);
    } else {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, updatedAt: Date.now(), messages: updatedMessages } : s
      ));
    }

    try {
      const res = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText })
      });
      const data = await res.json();
      data.userPrompt = messageText;
      
      let responseContent = "";
      if (data.conversational) {
          responseContent = data.text;
      } else if (data.ok) {
          responseContent = `I executed the following SQL query to find your answer:\n\`\`\`sql\n${data.sql_executed}\n\`\`\``;
      } else {
          responseContent = `Sorry, there was an error processing your query:\n\n**${data.error}**`;
      }
          
      const newAsstMsg: message = { 
          content: responseContent, 
          role: "assistant", 
          id: uuidv4(),
          data: data
      };
      
      updatedMessages = [...updatedMessages, newAsstMsg];
      setMessages(updatedMessages);

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, updatedAt: Date.now(), messages: updatedMessages } : s
      ));

    } catch (error) {
      console.error("API error:", error);
      const errorMsg: message = { 
          content: "Network error occurred while reaching the backend.", 
          role: "assistant", 
          id: uuidv4(),
          data: { ok: false }
      };
      updatedMessages = [...updatedMessages, errorMsg];
      setMessages(updatedMessages);

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, updatedAt: Date.now(), messages: updatedMessages } : s
      ));
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-row w-full h-dvh bg-background overflow-hidden">
      <Sidebar 
        sessions={sessions} 
        currentSessionId={currentSessionId} 
        onSelectSession={handleSelectSession} 
        onNewChat={handleNewChat} 
        onDeleteSession={handleDeleteSession}
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <div className="flex flex-col min-w-0 flex-1 h-dvh">
        <Header/>
        <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
          {messages.length === 0 && <Overview />}
          {messages.map((msg) => (
            <PreviewMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <ThinkingMessage />}
          <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]"/>
        </div>
        <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <ChatInput  
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            showSuggestions={messages.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
