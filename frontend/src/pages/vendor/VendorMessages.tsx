import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  Pin,
  Receipt,
  Calendar,
  MapPin,
  Users,
  X,
  Sparkles,
  Image as ImageIcon,
  Info,
  CornerUpLeft,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export interface ChatMessage {
  id: string;
  sender: "vendor" | "client";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  replyTo?: {
    id: string;
    sender: "vendor" | "client";
    text: string;
    senderName: string;
  };
  quoteCard?: {
    packageTitle: string;
    amount: number;
    advanceRequired: number;
    inclusions: string[];
    validUntil: string;
    status: "pending" | "accepted" | "negotiating";
  };
  imageAttachment?: {
    url: string;
    caption?: string;
  };
  receiptCard?: {
    receiptNo: string;
    advancePaid: number;
    balanceDue: number;
    eventDate: string;
  };
  isVoiceNote?: boolean;
  voiceDuration?: string;
}

export interface ClientThread {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  avatarBg: string;
  isOnline: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  eventName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  city: string;
  guestCount: number;
  contractAmount: number;
  advancePaid: number;
  status: "pending" | "active" | "completed";
  category: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: "vendor" | "client";
  lastMessageRead?: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  notes?: string;
}

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "USER" | "VENDOR";
  phone?: string;
  vendorProfile?: {
    businessName?: string;
    category?: string;
    categories?: string[];
    city?: string;
    experienceYears?: number | string;
    basePrice?: number;
    phone?: string;
    rating?: number;
  };
}

function getStoredUser(): StoredUser {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Sri Balaji Catering & Decor", role: "VENDOR" };
  } catch {
    return { name: "Sri Balaji Catering & Decor", role: "VENDOR" };
  }
}

function getDefaultThreads(vendorName: string, vendorCategories: string[], city: string): ClientThread[] {
  const primaryRole = vendorCategories[0] || "Catering & Feasts";
  const isCatering = primaryRole.toLowerCase().includes("cater");

  return [
    {
      id: "thread-101",
      clientName: "Dr. K. Nambiar",
      clientPhone: "+91 98450 12345",
      clientEmail: "nambiar.wedding@gmail.com",
      avatarBg: "linear-gradient(135deg, #059669, #10b981)",
      isOnline: true,
      isPinned: true,
      eventName: "Rohit & Meenakshi Royal Wedding",
      eventType: "Royal Wedding",
      eventDate: "March 15, 2026",
      venue: "Palakkad Palace Heritage Grounds",
      city: city || "Palakkad",
      guestCount: 650,
      contractAmount: isCatering ? 312000 : 145000,
      advancePaid: isCatering ? 100000 : 50000,
      status: "active",
      category: primaryRole,
      lastMessage: "Advance payment of ₹1,00,000 transferred via NEFT. Please lock the date.",
      lastMessageTime: "10:45 AM",
      lastMessageSender: "client",
      lastMessageRead: true,
      unreadCount: 0,
      messages: [
        {
          id: "m-1",
          sender: "client",
          text: "Namaskaram! We are finalizing arrangements for Rohit & Meenakshi's wedding at Palakkad Palace on March 15. We would love your signature traditional feast service.",
          timestamp: "Yesterday, 04:15 PM",
          status: "read",
        },
        {
          id: "m-2",
          sender: "vendor",
          text: `Namaskaram Dr. Nambiar! Thank you for contacting ${vendorName}. We have checked our calendar and blocked March 15 for your family celebration. Here is our official proposal breakdown:`,
          timestamp: "Yesterday, 05:00 PM",
          status: "read",
          quoteCard: {
            packageTitle: isCatering ? "Grand Traditional 24-Dish Royal Sadhya" : "Royal Lotus Carved Mandap Setup",
            amount: isCatering ? 312000 : 145000,
            advanceRequired: isCatering ? 100000 : 50000,
            inclusions: isCatering
              ? ["24 Traditional items on fresh plantain leaves", "3 Payasam varieties (Ada Pradhaman, Paal Payasam, Parippu)", "Uniformed traditional servers & table supervisors", "VIP seating service for 50 senior elders"]
              : ["40ft Gold carved lotus mandap", "4,000 Fresh red & white lotus stems", "Warm amber chandelier truss lighting", "Deepam welcome entryway"],
            validUntil: "March 01, 2026",
            status: "accepted",
          },
        },
        {
          id: "m-3",
          sender: "client",
          text: "Advance payment of ₹1,00,000 transferred via NEFT. Please lock the date.",
          timestamp: "10:45 AM",
          status: "read",
          replyTo: {
            id: "m-2",
            sender: "vendor",
            text: `Here is our official proposal breakdown: Grand Traditional 24-Dish Royal Sadhya`,
            senderName: vendorName,
          },
        },
        {
          id: "m-4",
          sender: "vendor",
          text: "Received with sincere thanks! We have generated your official GST contract invoice and locked the date on our calendar. We look forward to executing a memorable celebration.",
          timestamp: "10:52 AM",
          status: "read",
          replyTo: {
            id: "m-3",
            sender: "client",
            text: "Advance payment of ₹1,00,000 transferred via NEFT. Please lock the date.",
            senderName: "Dr. K. Nambiar",
          },
          receiptCard: {
            receiptNo: "RCP-2026-904",
            advancePaid: isCatering ? 100000 : 50000,
            balanceDue: isCatering ? 212000 : 95000,
            eventDate: "March 15, 2026",
          },
        },
      ],
      notes: "VIP table reservation for 40 senior family members. Request for extra ghee servings.",
    },
    {
      id: "thread-102",
      clientName: "Ananya & Siddharth",
      clientPhone: "+91 97110 54321",
      clientEmail: "siddharth.ananya@outlook.com",
      avatarBg: "linear-gradient(135deg, #2563eb, #3b82f6)",
      isOnline: true,
      isPinned: false,
      eventName: "Sunset Beach Sangeet Celebration",
      eventType: "Sangeet & Cocktail",
      eventDate: "April 02, 2026",
      venue: "Taj Fisherman's Cove Lawn",
      city: "Kovalam",
      guestCount: 380,
      contractAmount: isCatering ? 220000 : 95000,
      advancePaid: 0,
      status: "pending",
      category: vendorCategories[1] || primaryRole,
      lastMessage: "Could you send a customized proposal for 380 guests with live mocktail counter?",
      lastMessageTime: "02:15 PM",
      lastMessageSender: "client",
      lastMessageRead: false,
      unreadCount: 1,
      messages: [
        {
          id: "m-10",
          sender: "client",
          text: "Hi team! We love your portfolio setups. We are planning our Sangeet on April 2 at Kovalam. Are you available on this date?",
          timestamp: "11:30 AM",
          status: "read",
        },
        {
          id: "m-11",
          sender: "vendor",
          text: "Hello Ananya & Siddharth! Yes, April 2 is currently open on our calendar. Our lead crew is available in the Kovalam region.",
          timestamp: "12:10 PM",
          status: "read",
          replyTo: {
            id: "m-10",
            sender: "client",
            text: "Are you available on this date?",
            senderName: "Ananya & Siddharth",
          },
        },
        {
          id: "m-12",
          sender: "client",
          text: "Could you send a customized proposal for 380 guests with live mocktail counter?",
          timestamp: "02:15 PM",
          status: "delivered",
        },
      ],
      notes: "Client interested in modern Bohemian canopy and LED fairy light tunnel entrance.",
    },
    {
      id: "thread-103",
      clientName: "Vivek & Rashmi",
      clientPhone: "+91 98950 88776",
      clientEmail: "vivek.rashmi@gmail.com",
      avatarBg: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
      isOnline: false,
      isPinned: false,
      eventName: "Vivek & Rashmi Traditional Muhurtham",
      eventType: "Traditional Muhurtham",
      eventDate: "May 10, 2026",
      venue: "Leela Palace Grand Ballroom",
      city: city || "Palakkad",
      guestCount: 800,
      contractAmount: isCatering ? 380000 : 160000,
      advancePaid: 50000,
      status: "active",
      category: primaryRole,
      lastMessage: "We have finalized the guest list to 800 pax. Let's arrange the tasting session.",
      lastMessageTime: "Yesterday",
      lastMessageSender: "client",
      lastMessageRead: true,
      unreadCount: 0,
      messages: [
        {
          id: "m-20",
          sender: "client",
          text: "Hello! We have finalized the guest list to 800 pax. Let's arrange the tasting session.",
          timestamp: "Yesterday, 06:20 PM",
          status: "read",
        },
        {
          id: "m-21",
          sender: "vendor",
          text: "Wonderful! We have reserved Saturday 4:00 PM for the exclusive family tasting at our central facility.",
          timestamp: "Yesterday, 07:15 PM",
          status: "read",
          replyTo: {
            id: "m-20",
            sender: "client",
            text: "Let's arrange the tasting session.",
            senderName: "Vivek & Rashmi",
          },
        },
      ],
      notes: "Full coordination with lead event planner Mr. Rajesh.",
    },
    {
      id: "thread-104",
      clientName: "Priya & Karthik",
      clientPhone: "+91 94460 77889",
      clientEmail: "priya.karthik@wedding.org",
      avatarBg: "linear-gradient(135deg, #db2777, #ec4899)",
      isOnline: false,
      isPinned: false,
      eventName: "Priya & Karthik Golden Reception",
      eventType: "Grand Reception",
      eventDate: "January 20, 2026",
      venue: "Gokulam Convention Center",
      city: "Kochi",
      guestCount: 500,
      contractAmount: 240000,
      advancePaid: 240000,
      status: "completed",
      category: primaryRole,
      lastMessage: "Thank you so much for the flawless execution! The food and arrangements were praised by everyone.",
      lastMessageTime: "Jan 22",
      lastMessageSender: "client",
      lastMessageRead: true,
      unreadCount: 0,
      messages: [
        {
          id: "m-30",
          sender: "client",
          text: "Thank you so much for the flawless execution! The food and arrangements were praised by everyone.",
          timestamp: "Jan 22, 11:00 AM",
          status: "read",
        },
        {
          id: "m-31",
          sender: "vendor",
          text: "Thank you Priya & Karthik! It was an absolute joy celebrating with your families. Wishing you both a lifetime of happiness! 🙏✨",
          timestamp: "Jan 22, 11:30 AM",
          status: "read",
        },
      ],
      notes: "Full settlement cleared. 5-Star review published on marketplace.",
    },
  ];
}

export default function VendorMessages() {
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const vp = user.vendorProfile || {};
  const vendorCategories: string[] =
    vp.categories && vp.categories.length > 0
      ? vp.categories
      : vp.category
      ? [vp.category]
      : ["Catering & Feasts", "Stage & Mandap Decorators"];

  const vendorName = user.name || "Sri Balaji Catering & Decor";
  const vendorKey = (user.email || user.name || "vendor_default").toLowerCase().replace(/[^a-z0-9]/g, "_");

  // Threads State
  const [threads, setThreads] = useState<ClientThread[]>(() => {
    try {
      const stored = localStorage.getItem(`eventos_vendor_messages_${vendorKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultThreads(vendorName, vendorCategories, vp.city || "Palakkad");
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>("thread-101");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "active" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Quick Quote Proposal Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePackageTitle, setQuotePackageTitle] = useState("Custom Celebration Package");
  const [quoteAmount, setQuoteAmount] = useState("180000");
  const [quoteAdvance, setQuoteAdvance] = useState("50000");
  const [quoteInclusions, setQuoteInclusions] = useState("Custom service execution\nFull team coordination\n100% On-time delivery guarantee");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = activeThreadId ? threads.find((t) => t.id === activeThreadId) || null : null;

  useEffect(() => {
    const handleUserChange = () => {
      const u = getStoredUser();
      setUser(u);
    };
    window.addEventListener("eventos_user_changed", handleUserChange);
    return () => window.removeEventListener("eventos_user_changed", handleUserChange);
  }, []);

  // Keyboard Escape Handler to exit active chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveThreadId(null);
        setShowRightDrawer(false);
        setReplyingTo(null);
        setShowEmojiPicker(false);
        setShowAttachMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages]);

  const saveThreadsToStorage = (updated: ClientThread[]) => {
    setThreads(updated);
    localStorage.setItem(`eventos_vendor_messages_${vendorKey}`, JSON.stringify(updated));
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setReplyingTo(null);
    // Mark messages as read
    const updated = threads.map((t) => {
      if (t.id === threadId && t.unreadCount > 0) {
        return { ...t, unreadCount: 0, lastMessageRead: true };
      }
      return t;
    });
    saveThreadsToStorage(updated);
  };

  // Automated simulated customer reply
  const triggerCustomerReply = (currentThreadId: string, replyText: string) => {
    // 1. Show typing indicator
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) => (t.id === currentThreadId ? { ...t, isTyping: true } : t))
      );
    }, 800);

    // 2. Deliver message
    setTimeout(() => {
      const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      const clientMsg: ChatMessage = {
        id: `msg-client-${Date.now()}`,
        sender: "client",
        text: replyText,
        timestamp: timeStr,
        status: "read",
      };

      setThreads((prev) => {
        const updated = prev.map((t) => {
          if (t.id === currentThreadId) {
            return {
              ...t,
              isTyping: false,
              lastMessage: replyText,
              lastMessageTime: timeStr,
              lastMessageSender: "client" as const,
              lastMessageRead: true,
              messages: [...t.messages, clientMsg],
            };
          }
          return t;
        });
        localStorage.setItem(`eventos_vendor_messages_${vendorKey}`, JSON.stringify(updated));
        return updated;
      });
    }, 2200);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = messageInput.trim();
    if (!text || !activeThread) return;

    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "vendor",
      text,
      timestamp: timeStr,
      status: "read",
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            sender: replyingTo.sender,
            text: replyingTo.text,
            senderName: replyingTo.sender === "vendor" ? "You" : activeThread.clientName,
          }
        : undefined,
    };

    const threadId = activeThread.id;

    const updated = threads.map((t) => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text,
          lastMessageTime: timeStr,
          lastMessageSender: "vendor" as const,
          lastMessageRead: true,
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    saveThreadsToStorage(updated);
    setMessageInput("");
    setReplyingTo(null);
    setShowEmojiPicker(false);

    // Simulate smart customer reply
    if (text.toLowerCase().includes("tasting") || text.toLowerCase().includes("sample")) {
      triggerCustomerReply(threadId, "Sounds wonderful! We will arrive with our family for the tasting session.");
    } else if (text.toLowerCase().includes("quotation") || text.toLowerCase().includes("proposal") || text.toLowerCase().includes("₹")) {
      triggerCustomerReply(threadId, "Thank you for the proposal! We are reviewing the deliverables and will confirm shortly.");
    } else {
      triggerCustomerReply(threadId, "Noted with sincere thanks! We appreciate your quick response. 🙏");
    }
  };

  const handleSendVoiceNote = () => {
    if (!activeThread) return;
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      const voiceMsg: ChatMessage = {
        id: `voice-${Date.now()}`,
        sender: "vendor",
        text: "🎤 Voice Note (0:24)",
        timestamp: timeStr,
        status: "read",
        isVoiceNote: true,
        voiceDuration: "0:24",
      };

      const threadId = activeThread.id;
      const updated = threads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: "🎤 Voice Note (0:24)",
            lastMessageTime: timeStr,
            lastMessageSender: "vendor" as const,
            messages: [...t.messages, voiceMsg],
          };
        }
        return t;
      });
      saveThreadsToStorage(updated);
      triggerCustomerReply(threadId, "Listened to your voice message. Everything sounds clear and well aligned!");
    }, 1500);
  };

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeThread) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

      const imgMsg: ChatMessage = {
        id: `img-${Date.now()}`,
        sender: "vendor",
        text: "Sent an image preview",
        timestamp: timeStr,
        status: "read",
        imageAttachment: {
          url: base64,
          caption: "Celebration Setup & Layout Preview",
        },
      };

      const threadId = activeThread.id;
      const updated = threads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: "📷 Photo Attachment",
            lastMessageTime: timeStr,
            lastMessageSender: "vendor" as const,
            messages: [...t.messages, imgMsg],
          };
        }
        return t;
      });
      saveThreadsToStorage(updated);
      setShowAttachMenu(false);
      triggerCustomerReply(threadId, "This setup look absolutely stunning! Exactly what we envisioned for our celebration.");
    };
    reader.readAsDataURL(file);
  };

  const handleSendOfficialQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread) return;

    const incList = quoteInclusions
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    const quoteMsg: ChatMessage = {
      id: `msg-q-${Date.now()}`,
      sender: "vendor",
      text: `Here is our formal customized proposal for ${activeThread.eventName}:`,
      timestamp: timeStr,
      status: "read",
      quoteCard: {
        packageTitle: quotePackageTitle.trim() || "Custom Service Scope",
        amount: Number(quoteAmount) || 150000,
        advanceRequired: Number(quoteAdvance) || 50000,
        inclusions: incList.length > 0 ? incList : ["Complete customized service execution", "On-site supervision", "Quality certified ingredients"],
        validUntil: "Valid for 7 days",
        status: "pending",
      },
    };

    const threadId = activeThread.id;
    const updated = threads.map((t) => {
      if (t.id === threadId) {
        return {
          ...t,
          contractAmount: Number(quoteAmount) || t.contractAmount,
          lastMessage: `📋 Proposal: ₹${Number(quoteAmount).toLocaleString("en-IN")}`,
          lastMessageTime: timeStr,
          lastMessageSender: "vendor" as const,
          messages: [...t.messages, quoteMsg],
        };
      }
      return t;
    });

    saveThreadsToStorage(updated);
    setIsQuoteModalOpen(false);
    triggerCustomerReply(threadId, "Thank you for the official proposal! We are going through the details with family and will transfer the advance shortly.");
  };

  const handleTogglePinThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = threads.map((t) => (t.id === threadId ? { ...t, isPinned: !t.isPinned } : t));
    saveThreadsToStorage(updated);
  };

  // Role-calibrated smart quick replies
  const primaryRole = vendorCategories[0] || "Catering & Feasts";
  const smartReplies: string[] = primaryRole.toLowerCase().includes("cater")
    ? [
        "Here is our 24-dish Sadhya menu sample with 3 payasams. We can arrange a food tasting this weekend.",
        "We use 100% pure cow ghee and authentic Kerala heritage recipes with uniformed servers.",
        "Our team will arrive 4 hours in advance to set up the banana leaf banquet tables.",
        "Yes, we accommodate pure Jain, gluten-free, and North Indian live chaat counters as well.",
      ]
    : primaryRole.toLowerCase().includes("decor")
    ? [
        "Attached is our 3D lotus mandap render with warm amber lighting and floral stage truss.",
        "The mandap setup will be fully completed and inspected 6 hours before the muhurtham.",
        "We can customize the color palette to match the bride and groom's attire perfectly.",
        "All fresh floral garlands and deepam walkways are included in this package.",
      ]
    : [
        "Our cinematography package includes 2 traditional videographers, 1 drone operator, and 4K same-day teaser edit.",
        "We deliver 1,000+ color-corrected high-res photos and an interactive cloud gallery within 14 days.",
        "Yes, our team is available for both the morning Muhurtham and evening Cocktail Reception.",
        "We would be delighted to schedule a brief video consultation to discuss your vision.",
      ];

  const celebrationEmojis = ["✨", "🙏", "🎉", "💐", "🍛", "⭐", "📸", "💍", "🌺", "❤️", "👍", "🔥", "🤝", "✅"];

  // Filtering
  const q = searchQuery.toLowerCase().trim();
  const filteredThreads = threads.filter((t) => {
    let matchTab = true;
    if (filterTab === "unread") matchTab = t.unreadCount > 0;
    else if (filterTab === "active") matchTab = t.status === "active";
    else if (filterTab === "pending") matchTab = t.status === "pending";
    else if (filterTab === "completed") matchTab = t.status === "completed";

    const matchQ =
      !q ||
      t.clientName.toLowerCase().includes(q) ||
      t.eventName.toLowerCase().includes(q) ||
      t.venue.toLowerCase().includes(q) ||
      t.clientPhone.includes(q);
    return matchTab && matchQ;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="app-shell">
      <Sidebar />

      <main
        className="dashboard-main"
        style={{
          padding: "16px 24px",
          height: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header placeholder="Search client conversations, phone numbers, quotes..." />

        {/* Hidden File Input for Device Photo Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleDeviceImageUpload}
          style={{ display: "none" }}
        />

        {/* Client Communications Master Frame */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "row",
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #d1d7db",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN: CLIENT CONVERSATIONS LIST (Fixed 340px)
          ═══════════════════════════════════════════════════════════════ */}
          <div
            style={{
              width: "340px",
              minWidth: "340px",
              maxWidth: "340px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              borderRight: "1px solid #e9edef",
              background: "#ffffff",
              height: "100%",
            }}
          >
            {/* Top Profile Header */}
            <div
              style={{
                padding: "12px 14px",
                background: "#f0f2f5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #d1d7db",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#00a884",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "15px",
                    flexShrink: 0,
                  }}
                >
                  {vendorName.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      fontSize: "13.5px",
                      color: "#111b21",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {vendorName}
                  </strong>
                  <span style={{ fontSize: "11px", color: "#008069", fontWeight: 700 }}>
                    Verified Business Lead ✓
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  background: "#d9fdd3",
                  color: "#008069",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  flexShrink: 0,
                }}
              >
                {threads.length} Chats
              </span>
            </div>

            {/* Search Box */}
            <div style={{ padding: "8px 12px", background: "#ffffff", borderBottom: "1px solid #f0f2f5" }}>
              <div
                style={{
                  position: "relative",
                  background: "#f0f2f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Search size={14} style={{ position: "absolute", left: "10px", color: "#54656f" }} />
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    background: "transparent",
                    border: "none",
                    fontSize: "12.5px",
                    outline: "none",
                    color: "#111b21",
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{ background: "none", border: "none", marginRight: "6px", cursor: "pointer", color: "#54656f" }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                padding: "6px 10px",
                background: "#ffffff",
                overflowX: "auto",
                borderBottom: "1px solid #f0f2f5",
              }}
            >
              {[
                { id: "all", label: "All" },
                { id: "unread", label: "Unread" },
                { id: "active", label: "Active" },
                { id: "pending", label: "Inquiries" },
                { id: "completed", label: "Done" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id as any)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "14px",
                    fontSize: "11.5px",
                    fontWeight: filterTab === tab.id ? 700 : 500,
                    border: "none",
                    background: filterTab === tab.id ? "#e7fce3" : "#f0f2f5",
                    color: filterTab === tab.id ? "#008069" : "#54656f",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.1s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Customer Threads List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {sortedThreads.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center", color: "#8696a0", fontSize: "13px" }}>
                  No customer conversations found
                </div>
              ) : (
                sortedThreads.map((t) => {
                  const isActive = t.id === activeThread?.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectThread(t.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        gap: "10px",
                        background: isActive ? "#f0f2f5" : "#ffffff",
                        borderBottom: "1px solid #f0f2f5",
                        cursor: "pointer",
                        transition: "background 0.1s",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = "#f7f8f8";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      {/* Customer Initials Avatar */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: t.avatarBg,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "14.5px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          {t.clientName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        {t.isOnline && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: "1px",
                              right: "1px",
                              width: "11px",
                              height: "11px",
                              borderRadius: "50%",
                              background: "#25d366",
                              border: "2px solid #ffffff",
                            }}
                          />
                        )}
                      </div>

                      {/* Content Preview */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                          <strong
                            style={{
                              fontSize: "13.5px",
                              color: "#111b21",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t.clientName}
                          </strong>
                          <span
                            style={{
                              fontSize: "11px",
                              color: t.unreadCount > 0 ? "#00a884" : "#667781",
                              fontWeight: t.unreadCount > 0 ? 700 : 400,
                              flexShrink: 0,
                              marginLeft: "6px",
                            }}
                          >
                            {t.lastMessageTime}
                          </span>
                        </div>

                        {/* Event Sub-label */}
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#008069",
                            fontWeight: 600,
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "2px",
                          }}
                        >
                          🎉 {t.eventName}
                        </span>

                        {/* Last message snippet & status icons */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: t.isTyping ? "#008069" : "#667781",
                              fontWeight: t.isTyping ? 700 : 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            {t.isTyping ? (
                              <span>typing...</span>
                            ) : (
                              <>
                                {t.lastMessageSender === "vendor" && (
                                  <CheckCheck size={13} color={t.lastMessageRead ? "#53bdeb" : "#8696a0"} />
                                )}
                                <span>{t.lastMessage}</span>
                              </>
                            )}
                          </p>

                          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, marginLeft: "6px" }}>
                            {t.isPinned && <Pin size={11} color="#8696a0" style={{ transform: "rotate(45deg)" }} />}
                            {t.unreadCount > 0 && (
                              <span
                                style={{
                                  background: "#25d366",
                                  color: "#ffffff",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  borderRadius: "50%",
                                  width: "18px",
                                  height: "18px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {t.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CENTER/MAIN COLUMN: ACTIVE CHAT STREAM (flex: 1)
          ═══════════════════════════════════════════════════════════════ */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              background: "#efeae2",
              position: "relative",
            }}
          >
            {activeThread ? (
              <>
                {/* Chat Top Header Bar */}
                <div
                  style={{
                    padding: "10px 16px",
                    background: "#f0f2f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #d1d7db",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background: activeThread.avatarBg,
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        {activeThread.clientName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      {activeThread.isOnline && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#25d366",
                            border: "1.5px solid #ffffff",
                          }}
                        />
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "14.5px",
                          color: "#111b21",
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activeThread.clientName}
                      </h2>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: activeThread.isTyping ? "#008069" : activeThread.isOnline ? "#008069" : "#667781",
                          fontWeight: activeThread.isTyping ? 700 : 400,
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activeThread.isTyping
                          ? "typing..."
                          : activeThread.isOnline
                          ? "online"
                          : `last seen ${activeThread.lastMessageTime}`} · {activeThread.eventName}
                      </span>
                    </div>
                  </div>

                  {/* Header Action Buttons (Without Call Option) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <a
                      href={`https://wa.me/${activeThread.clientPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(activeThread.clientName)},%20this%20is%20${encodeURIComponent(vendorName)}%20regarding%20${encodeURIComponent(activeThread.eventName)}.`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: "#008069",
                        color: "#ffffff",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 2px 6px rgba(0, 128, 105, 0.25)",
                      }}
                    >
                      <MessageSquare size={13} /> Direct Chat
                    </a>

                    <button
                      type="button"
                      onClick={(e) => handleTogglePinThread(activeThread.id, e)}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: activeThread.isPinned ? "#e7fce3" : "#ffffff",
                        border: "1px solid #d1d7db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: activeThread.isPinned ? "#008069" : "#54656f",
                        cursor: "pointer",
                      }}
                      title={activeThread.isPinned ? "Unpin Chat" : "Pin Chat"}
                    >
                      <Pin size={15} style={{ transform: "rotate(45deg)" }} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRightDrawer(!showRightDrawer)}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: showRightDrawer ? "#e7fce3" : "#ffffff",
                        border: "1px solid #d1d7db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: showRightDrawer ? "#008069" : "#54656f",
                        cursor: "pointer",
                      }}
                      title="Customer Details"
                    >
                      <Info size={15} />
                    </button>

                    {/* Exit Chat Button */}
                    <button
                      type="button"
                      onClick={() => setActiveThreadId(null)}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        border: "1px solid #d1d7db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#54656f",
                        cursor: "pointer",
                      }}
                      title="Close Chat (Press Esc)"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Chat Stream with Quoted Replies */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    backgroundImage: `radial-gradient(#d5cbb8 0.75px, transparent 0.75px)`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  {/* Security Notice */}
                  <div style={{ textAlign: "center", margin: "2px 0 8px" }}>
                    <span
                      style={{
                        background: "#ffeecd",
                        color: "#54656f",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "8px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      🔒 Messages and quotes are verified & encrypted by EventOS · Press Esc to exit chat
                    </span>
                  </div>

                  {activeThread.messages.map((m) => {
                    const isVendor = m.sender === "vendor";

                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isVendor ? "flex-end" : "flex-start",
                          maxWidth: "75%",
                          alignSelf: isVendor ? "flex-end" : "flex-start",
                          position: "relative",
                        }}
                      >
                        {/* Message Bubble Container */}
                        <div
                          style={{
                            position: "relative",
                            padding: "8px 12px 6px",
                            borderRadius: isVendor ? "8px 0px 8px 8px" : "0px 8px 8px 8px",
                            background: isVendor ? "#d9fdd3" : "#ffffff",
                            color: "#111b21",
                            boxShadow: "0 1px 2px rgba(11, 20, 26, 0.12)",
                            fontSize: "13px",
                            lineHeight: 1.4,
                            wordBreak: "break-word",
                          }}
                        >
                          {/* Quoted Reply Preview Inside Bubble */}
                          {m.replyTo && (
                            <div
                              style={{
                                background: isVendor ? "#c5edbc" : "#f0f2f5",
                                borderLeft: "3.5px solid #00a884",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                marginBottom: "6px",
                                fontSize: "11px",
                              }}
                            >
                              <strong style={{ color: "#008069", display: "block", fontSize: "10.5px" }}>
                                {m.replyTo.senderName}
                              </strong>
                              <span style={{ color: "#54656f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                                {m.replyTo.text}
                              </span>
                            </div>
                          )}

                          {/* Image Attachment (If Any) */}
                          {m.imageAttachment && (
                            <div style={{ marginBottom: "6px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                              <img src={m.imageAttachment.url} alt="Attachment" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }} />
                              {m.imageAttachment.caption && (
                                <div style={{ padding: "6px 8px", fontSize: "11.5px", color: "#54656f", background: "#f0f2f5" }}>
                                  {m.imageAttachment.caption}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message Text */}
                          <div>{m.text}</div>

                          {/* In-Chat Proposal Card */}
                          {m.quoteCard && (
                            <div
                              style={{
                                marginTop: "8px",
                                background: "#ffffff",
                                borderRadius: "10px",
                                padding: "12px",
                                border: "1.5px solid #25d366",
                                boxShadow: "0 2px 8px rgba(37, 211, 102, 0.12)",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#d9fdd3", color: "#008069", padding: "2px 8px", borderRadius: "4px" }}>
                                  📋 OFFICIAL CONTRACT PROPOSAL
                                </span>
                                <span style={{ fontSize: "10.5px", color: "#667781" }}>
                                  {m.quoteCard.validUntil}
                                </span>
                              </div>

                              <strong style={{ fontSize: "13.5px", color: "#111b21", display: "block", marginBottom: "3px" }}>
                                {m.quoteCard.packageTitle}
                              </strong>

                              <div style={{ fontSize: "17px", fontWeight: 800, color: "#008069", marginBottom: "6px" }}>
                                ₹{m.quoteCard.amount.toLocaleString("en-IN")}{" "}
                                <span style={{ fontSize: "11px", color: "#667781", fontWeight: 500 }}>
                                  (Advance Token: ₹{m.quoteCard.advanceRequired.toLocaleString("en-IN")})
                                </span>
                              </div>

                              <div style={{ borderTop: "1px dashed #d1d7db", paddingTop: "6px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "10px", fontWeight: 700, color: "#54656f", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>
                                  Deliverables & Inclusions:
                                </span>
                                <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#334155", lineHeight: 1.35 }}>
                                  {m.quoteCard.inclusions.map((inc, i) => (
                                    <li key={i}>{inc}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Official Payment Receipt Card */}
                          {m.receiptCard && (
                            <div style={{ marginTop: "8px", background: "#f8fafc", borderRadius: "8px", padding: "8px 10px", border: "1px solid #cbd5e1" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                                <Receipt size={13} color="#008069" />
                                <strong style={{ fontSize: "11.5px", color: "#111b21" }}>Official Payment Receipt: #{m.receiptCard.receiptNo}</strong>
                              </div>
                              <div style={{ fontSize: "11px", color: "#475569" }}>
                                Advance Deposited: <strong style={{ color: "#008069" }}>₹{m.receiptCard.advancePaid.toLocaleString("en-IN")}</strong> · Balance Due: <strong style={{ color: "#2563eb" }}>₹{m.receiptCard.balanceDue.toLocaleString("en-IN")}</strong>
                              </div>
                            </div>
                          )}

                          {/* Timestamp & Status Ticks + Reply Quick Action */}
                          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(m)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "0 2px",
                                cursor: "pointer",
                                color: "#8696a0",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "2px",
                                fontSize: "10px",
                              }}
                              title="Reply to this message"
                            >
                              <CornerUpLeft size={11} /> Reply
                            </button>
                            <span style={{ fontSize: "10px", color: "#667781" }}>{m.timestamp}</span>
                            {isVendor && <CheckCheck size={13} color={m.status === "read" ? "#53bdeb" : "#8696a0"} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* AI Quick Replies Pill Bar */}
                <div
                  style={{
                    padding: "6px 14px",
                    background: "#ffffff",
                    borderTop: "1px solid #e9edef",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    overflowX: "auto",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#008069", display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                    <Sparkles size={12} /> AI Quick Replies:
                  </span>
                  {smartReplies.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessageInput(r)}
                      style={{
                        padding: "3px 9px",
                        borderRadius: "12px",
                        background: "#f0f2f5",
                        border: "1px solid #d1d7db",
                        fontSize: "11px",
                        color: "#111b21",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00a884";
                        e.currentTarget.style.color = "#008069";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#d1d7db";
                        e.currentTarget.style.color = "#111b21";
                      }}
                    >
                      {r.length > 34 ? `${r.slice(0, 34)}...` : r}
                    </button>
                  ))}
                </div>

                {/* Replying Banner (If replying to a message) */}
                {replyingTo && (
                  <div
                    style={{
                      background: "#f0f2f5",
                      borderLeft: "4px solid #008069",
                      padding: "6px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #d1d7db",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#008069", display: "block" }}>
                        Replying to {replyingTo.sender === "vendor" ? "Your Message" : activeThread.clientName}
                      </span>
                      <p style={{ margin: 0, fontSize: "11.5px", color: "#54656f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {replyingTo.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f", padding: "4px" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Emoji Bar Picker (If Open) */}
                {showEmojiPicker && (
                  <div style={{ padding: "6px 12px", background: "#f0f2f5", borderTop: "1px solid #d1d7db", display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
                    {celebrationEmojis.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setMessageInput((prev) => prev + em)}
                        style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Composer Bar */}
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    padding: "8px 14px",
                    background: "#f0f2f5",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderTop: "1px solid #d1d7db",
                    flexShrink: 0,
                  }}
                >
                  {/* Emoji Button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: showEmojiPicker ? "#008069" : "#54656f", padding: "4px" }}
                    title="Emoji"
                  >
                    <Smile size={20} />
                  </button>

                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: showAttachMenu ? "#008069" : "#54656f", padding: "4px", position: "relative" }}
                    title="Attach"
                  >
                    <Paperclip size={18} />
                    {showAttachMenu && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "38px",
                          left: "0",
                          background: "#ffffff",
                          borderRadius: "12px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                          padding: "6px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px",
                          width: "190px",
                          zIndex: 999,
                          border: "1px solid #e9edef",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#111b21", textAlign: "left" }}
                        >
                          <ImageIcon size={15} color="#00a884" /> Photos / Setup Render
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setQuotePackageTitle(`${primaryRole} Custom Package`);
                            setQuoteAmount(String(activeThread.contractAmount || 150000));
                            setQuoteAdvance(String(activeThread.advancePaid || 50000));
                            setIsQuoteModalOpen(true);
                            setShowAttachMenu(false);
                          }}
                          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#111b21", textAlign: "left" }}
                        >
                          <Receipt size={15} color="#2563eb" /> Send Official Quote
                        </button>
                      </div>
                    )}
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#ffffff",
                      fontSize: "13px",
                      outline: "none",
                      color: "#111b21",
                    }}
                  />

                  {/* Send Button or Voice Note */}
                  {messageInput.trim() ? (
                    <button
                      type="submit"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#00a884",
                        color: "#ffffff",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0, 168, 132, 0.3)",
                      }}
                    >
                      <Send size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendVoiceNote}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isRecordingVoice ? "#ef4444" : "#ffffff",
                        color: isRecordingVoice ? "#ffffff" : "#54656f",
                        border: "1px solid #d1d7db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Send Voice Note"
                    >
                      <Mic size={16} />
                    </button>
                  )}
                </form>
              </>
            ) : (
              /* No Active Chat Selected Screen (Clean State) */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: "40px 20px",
                  textAlign: "center",
                  background: "#f0f2f5",
                  borderBottom: "6px solid #00a884",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#e7fce3",
                    color: "#008069",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <MessageSquare size={38} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: "20px", color: "#111b21", fontWeight: 700 }}>
                  EventOS Client Communications
                </h2>
                <p style={{ margin: "0 0 18px", fontSize: "13.5px", color: "#667781", maxWidth: "420px", lineHeight: 1.5 }}>
                  Select a client conversation from the left to view messages, send formal proposal cards, and track celebration deliverables.
                </p>
                <span style={{ fontSize: "11.5px", color: "#54656f", background: "#ffffff", padding: "6px 14px", borderRadius: "14px", border: "1px solid #d1d7db" }}>
                  ⌨️ Tip: Press <strong style={{ color: "#008069" }}>Esc</strong> anytime to exit and hide active chat
                </span>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT DRAWER: CUSTOMER DOSSIER & FINANCIALS (300px Fixed)
          ═══════════════════════════════════════════════════════════════ */}
          {showRightDrawer && activeThread && (
            <div
              style={{
                width: "300px",
                minWidth: "300px",
                maxWidth: "300px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid #e9edef",
                background: "#f0f2f5",
                height: "100%",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{ padding: "12px 14px", background: "#ffffff", borderBottom: "1px solid #e9edef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#111b21" }}>Customer Info</span>
                <button
                  type="button"
                  onClick={() => setShowRightDrawer(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f" }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Profile Card */}
              <div style={{ padding: "16px 14px", background: "#ffffff", textAlign: "center", borderBottom: "1px solid #e9edef" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: activeThread.avatarBg,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "20px",
                    margin: "0 auto 8px",
                  }}
                >
                  {activeThread.clientName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <h3 style={{ margin: "0 0 2px", fontSize: "15px", color: "#111b21" }}>
                  {activeThread.clientName}
                </h3>
                <span style={{ fontSize: "12px", color: "#54656f", display: "block" }}>
                  {activeThread.clientPhone}
                </span>
                <span style={{ fontSize: "10.5px", fontWeight: 700, background: activeThread.status === "active" ? "#d9fdd3" : "#fef3c7", color: activeThread.status === "active" ? "#008069" : "#b45309", padding: "2px 8px", borderRadius: "10px", display: "inline-block", marginTop: "5px" }}>
                  {activeThread.status === "active" ? "🟢 Confirmed Contract" : "⏳ Inquiry Phase"}
                </span>
              </div>

              {/* Celebration Details */}
              <div style={{ padding: "14px", background: "#ffffff", marginTop: "6px", borderTop: "1px solid #e9edef", borderBottom: "1px solid #e9edef" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#54656f", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Celebration Details
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                  <strong style={{ fontSize: "12.5px", color: "#111b21" }}>{activeThread.eventName}</strong>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#54656f" }}>
                    <Calendar size={12} color="#00a884" /> {activeThread.eventDate}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#54656f" }}>
                    <MapPin size={12} color="#00a884" /> {activeThread.venue}, {activeThread.city}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#54656f" }}>
                    <Users size={12} color="#00a884" /> {activeThread.guestCount} Guests Scale
                  </div>
                </div>
              </div>

              {/* Contract Financials */}
              <div style={{ padding: "14px", background: "#ffffff", marginTop: "6px", borderTop: "1px solid #e9edef", borderBottom: "1px solid #e9edef" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#54656f", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Contract Financials
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span>Base Contract:</span>
                  <strong style={{ color: "#111b21" }}>₹{activeThread.contractAmount.toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span>Advance Deposited:</span>
                  <span style={{ color: "#008069", fontWeight: 700 }}>₹{activeThread.advancePaid.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", borderTop: "1px dashed #d1d7db", paddingTop: "5px", fontWeight: 800 }}>
                  <span>Balance Due:</span>
                  <span style={{ color: "#008069" }}>₹{Math.max(0, activeThread.contractAmount - activeThread.advancePaid).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Notes */}
              <div style={{ padding: "14px", background: "#ffffff", marginTop: "6px", borderTop: "1px solid #e9edef", borderBottom: "1px solid #e9edef" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#54656f", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Private Notes
                </span>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#54656f", lineHeight: 1.4 }}>
                  {activeThread.notes || "No special diet or setup requirements noted."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── SEND OFFICIAL QUOTATION MODAL ─── */}
      {isQuoteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 20, 26, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
              border: "1px solid #d1d7db",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f2f5", paddingBottom: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Receipt size={18} color="#00a884" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#111b21" }}>
                  Create In-Chat Proposal Card
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                style={{ background: "#f0f2f5", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} color="#54656f" />
              </button>
            </div>

            <form onSubmit={handleSendOfficialQuote} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Package / Service Title
                </label>
                <input
                  type="text"
                  value={quotePackageTitle}
                  onChange={(e) => setQuotePackageTitle(e.target.value)}
                  placeholder="e.g. Royal Traditional 24-Dish Sadhya Feast"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Total Quotation (₹)
                  </label>
                  <input
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="180000"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Advance Token Required (₹)
                  </label>
                  <input
                    type="number"
                    value={quoteAdvance}
                    onChange={(e) => setQuoteAdvance(e.target.value)}
                    placeholder="50000"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Deliverables & Inclusions (One per line)
                </label>
                <textarea
                  value={quoteInclusions}
                  onChange={(e) => setQuoteInclusions(e.target.value)}
                  rows={3}
                  placeholder="Enter key deliverables, one per line..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 22px", borderRadius: "8px", background: "#00a884", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Send Proposal Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
