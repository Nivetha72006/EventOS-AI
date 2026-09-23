import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { API_BASE_URL } from "../../services/api";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
}

interface HistoryThread {
  id: string;
  title: string;
  meta: string;
  section: "TODAY" | "THIS WEEK" | "EARLIER";
  messages: Message[];
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

function getUser(): UserData {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "You" };
  } catch {
    return { name: "You" };
  }
}

function getEvent() {
  try {
    const stored = localStorage.getItem("eventos_event");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function AIAssistant() {
  const [user, setUser] = useState<UserData>(() => getUser());
  const event = getEvent();
  const eventTitle = event?.title || "Your Celebration";
  const eventCity = event?.city || "";
  const eventBudget = event?.budget ? Number(event.budget) : 0;

  // Clean initial conversation for AI Assistant
  const INITIAL_THREADS: HistoryThread[] = [
    {
      id: "t1",
      title: "New Conversation",
      meta: "TODAY · Just now",
      section: "TODAY",
      messages: [
        {
          id: 101,
          sender: "ai",
          text: eventTitle && eventTitle !== "Your Celebration"
            ? `Hello! I'm your EventOS AI Assistant. I'm ready to help you plan "${eventTitle}". How can I assist you today with vendor recommendations, budget planning, timelines, or decor ideas?`
            : `Hello! I'm your EventOS AI Assistant. How can I assist you with your event planning today? Ask me anything about vendors, budgets, guest lists, or decor ideas!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    },
  ];

  const userKey = user?.email || user?.id || "guest";
  const storageKey = `eventos_chat_threads_${userKey}`;

  const [threads, setThreads] = useState<HistoryThread[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey) || localStorage.getItem("eventos_chat_threads");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if parsed stored chats are old default mock threads (e.g. contain t2, t3, t4, t5)
          const isMockHistory = parsed.some((t: HistoryThread) => t.id === "t2" || t.id === "t3" || t.id === "t4");
          if (!isMockHistory) {
            return parsed;
          }
        }
      }
    } catch {}
    return INITIAL_THREADS;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Active thread's messages
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const messages = activeThread?.messages || [];

  // Scroll to bottom when messages update or thread changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeThreadId]);

  useEffect(() => {
    const handleUserChange = () => setUser(getUser());
    window.addEventListener("eventos_user_changed", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("eventos_user_changed", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  // Persist threads to localStorage
  const persistThreads = (updated: HistoryThread[]) => {
    setThreads(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem("eventos_chat_threads", JSON.stringify(updated));
    } catch {}
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
  };

  const handleDeleteThread = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const remaining = threads.filter((t) => t.id !== threadId);
    if (remaining.length === 0) {
      const freshId = `t-${Date.now()}`;
      const freshThread: HistoryThread = {
        id: freshId,
        title: "New Conversation",
        meta: "TODAY · Just now",
        section: "TODAY",
        messages: [
          {
            id: Date.now(),
            sender: "ai",
            text: `Hello! I'm EventOS AI. How can I assist you with "${eventTitle}" today? Ask me anything about vendor negotiations, budgeting, decor themes, or scheduling!`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      };
      persistThreads([freshThread]);
      setActiveThreadId(freshId);
    } else {
      persistThreads(remaining);
      if (activeThreadId === threadId) {
        setActiveThreadId(remaining[0].id);
      }
    }
  };

  const handleNewConversation = () => {
    const newId = `t-${Date.now()}`;
    const newThread: HistoryThread = {
      id: newId,
      title: "New Conversation",
      meta: "TODAY · Just now",
      section: "TODAY",
      messages: [
        {
          id: Date.now(),
          sender: "ai",
          text: `Hello! I'm EventOS AI. How can I assist you with "${eventTitle}" today? Ask me anything about vendor negotiations, budgeting, decor themes, or scheduling!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    const updated = [newThread, ...threads];
    persistThreads(updated);
    setActiveThreadId(newId);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text,
      time: userTime,
    };

    // Update active thread with user message
    const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];
    const updatedMessages = [...(currentThread?.messages || []), userMsg];
    
    // Auto-update thread title if it was "New Conversation"
    const newTitle = currentThread?.title === "New Conversation" 
      ? (text.length > 35 ? text.slice(0, 32) + "…" : text)
      : currentThread?.title || "Event Planning Chat";

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          title: newTitle,
          messages: updatedMessages,
          meta: `TODAY · ${userTime}`,
        };
      }
      return t;
    });

    persistThreads(updatedThreads);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          event: event || undefined,
          history: updatedMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      const json = await res.json();
      const aiText =
        json?.data?.message ||
        json?.message ||
        "I'm here to help! Could you specify what details you need for your celebration?";

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalThreads = threads.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            title: newTitle,
            messages: [...updatedMessages, aiMsg],
          };
        }
        return t;
      });
      persistThreads(finalThreads);
    } catch {
      const fallbackMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: `Here are my top suggestions for "${eventTitle}":\n1. Ensure your catering count is finalized with a 10% buffer.\n2. Mandap setup should begin 12 hours prior to the muhurtham.\n3. Keep in touch with your verified vendors on EventOS to track milestones.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const finalThreads = threads.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            title: newTitle,
            messages: [...updatedMessages, fallbackMsg],
          };
        }
        return t;
      });
      persistThreads(finalThreads);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (label: string) => {
    setInputText(label);
  };

  const chips = [
    eventCity
      ? `What vendors do I need for ${event?.eventType || "my event"} in ${eventCity}?`
      : "What vendors do I need for my celebration in Tamil Nadu?",
    eventBudget > 0
      ? `How should I allocate my ₹${eventBudget.toLocaleString("en-IN")} budget?`
      : "Help me allocate my event budget",
    "Write a negotiation message for caterers",
    "Suggest a royal temple décor theme",
    "Create a week-by-week timeline",
  ];

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main chat-workspace-layout">
        <Header />

        <div className="chat-container-split">
          {/* Chat List Navigation Panel */}
          <section className="chat-history-sidebar">
            <button
              type="button"
              className="new-conversation-btn"
              onClick={handleNewConversation}
            >
              <Plus size={16} />
              <span>New conversation</span>
            </button>

            <div className="conversation-timeline">
              {/* TODAY Section */}
              <div className="timeline-section">
                <span className="section-label">TODAY</span>
                {threads
                  .filter((t) => t.section === "TODAY" || t.id.startsWith("t-"))
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`history-item ${activeThreadId === t.id ? "active" : ""}`}
                      onClick={() => handleSelectThread(t.id)}
                    >
                      <div className="item-title-row">
                        <strong style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {activeThreadId === t.id && <span className="unread-dot" />}
                          <button
                            type="button"
                            title="Delete this chat"
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              padding: "3px",
                              borderRadius: "4px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#ef4444";
                              (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="item-meta">{t.meta}</div>
                    </div>
                  ))}
              </div>

              {/* THIS WEEK Section */}
              <div className="timeline-section">
                <span className="section-label">THIS WEEK</span>
                {threads
                  .filter((t) => t.section === "THIS WEEK")
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`history-item ${activeThreadId === t.id ? "active" : ""}`}
                      onClick={() => handleSelectThread(t.id)}
                    >
                      <div className="item-title-row">
                        <strong style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {activeThreadId === t.id && <span className="unread-dot" />}
                          <button
                            type="button"
                            title="Delete this chat"
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              padding: "3px",
                              borderRadius: "4px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#ef4444";
                              (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="item-meta">{t.meta}</div>
                    </div>
                  ))}
              </div>

              {/* EARLIER Section */}
              <div className="timeline-section">
                <span className="section-label">EARLIER</span>
                {threads
                  .filter((t) => t.section === "EARLIER")
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`history-item ${activeThreadId === t.id ? "active" : ""}`}
                      onClick={() => handleSelectThread(t.id)}
                    >
                      <div className="item-title-row">
                        <strong style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {activeThreadId === t.id && <span className="unread-dot" />}
                          <button
                            type="button"
                            title="Delete this chat"
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              padding: "3px",
                              borderRadius: "4px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#ef4444";
                              (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="item-meta">{t.meta}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="chat-sidebar-banner">
              <strong>EventOS Intelligence</strong>
              <span>Always tailored to "{eventTitle}"</span>
            </div>
          </section>

          {/* Active Chat Conversation Workspace */}
          <section className="chat-active-window">
            <div className="chat-window-header">
              <div className="agent-avatar">
                <Sparkles size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h2>{activeThread?.title || "EventOS AI Assistant"}</h2>
                <p>
                  Active · Context synced with {eventTitle}{eventCity ? ` (${eventCity})` : ""}
                </p>
              </div>

              {/* Delete Active Chat Button */}
              <button
                type="button"
                onClick={() => handleDeleteThread(activeThreadId)}
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                  (e.currentTarget as HTMLElement).style.borderColor = "#f87171";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fef2f2";
                  (e.currentTarget as HTMLElement).style.borderColor = "#fecaca";
                }}
                title="Delete this conversation"
              >
                <Trash2 size={14} />
                <span>Delete Chat</span>
              </button>
            </div>

            <div className="chat-messages-scroll" ref={scrollRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble-wrapper ${
                    msg.sender === "user" ? "user-side" : "ai-side"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="bubble-avatar">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className="message-content-box">
                    <p className="message-text" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                      {msg.text}
                    </p>
                    <span className="message-time">
                      {msg.sender === "ai" ? "EventOS AI" : (user?.name || "You")} · {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-bubble-wrapper ai-side">
                  <div className="bubble-avatar">
                    <Sparkles size={14} />
                  </div>
                  <div className="message-content-box">
                    <p className="message-text" style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                      <Loader2 size={16} className="login-spin" />
                      EventOS AI is preparing recommendations…
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Chips & Input Toolbar */}
            <div className="chat-input-toolbar-area">
              <div className="quick-action-chips">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="chip-btn"
                  >
                    {chip.length > 50 ? chip.slice(0, 48) + "…" : chip}
                  </button>
                ))}
              </div>

              {/* Clean Input Space with Send Button on the Rightmost Side (No Attachment Icon) */}
              <div className="chat-input-bar">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask EventOS AI anything (vendor recommendations, budget breakdown, timelines, negotiations)…"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  className="chat-send-btn"
                  onClick={handleSend}
                  aria-label="Send message"
                  disabled={loading || !inputText.trim()}
                  type="button"
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
