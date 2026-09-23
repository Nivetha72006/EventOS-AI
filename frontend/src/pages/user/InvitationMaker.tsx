import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
  Copy,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Palette,
  Eye,
  MessageCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Download,
  Printer,
  Loader2,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

interface EventData {
  id?: string;
  title?: string;
  eventType?: string;
  eventDate?: string;
  city?: string;
  state?: string;
  country?: string;
  guestCount?: number;
  budget?: number;
}

type TemplateTheme =
  | "royal-gold"
  | "rose-floral"
  | "emerald-temple"
  | "midnight-glam"
  | "sunset-violet"
  | "ocean-sapphire"
  | "minimal-serif";

interface InvitationData {
  title: string;
  hosts: string;
  celebrants: string;
  date: string;
  time: string;
  muhurthamTime: string;
  venueName: string;
  address: string;
  message: string;
  dressCode: string;
  rsvpPhone: string;
  rsvpEmail: string;
  theme: TemplateTheme;
  customBgColor: string;
  customTitleColor: string;
  customBorderColor: string;
  customTextColor: string;
}

function getStoredEvent(): EventData | null {
  try {
    const s = localStorage.getItem("eventos_event");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

const THEME_DEFAULTS: Record<
  TemplateTheme,
  {
    bg: string;
    title: string;
    border: string;
    text: string;
    font: string;
    motif: string;
    name: string;
  }
> = {
  "royal-gold": {
    name: "Royal Gold",
    bg: "#3b0c13",
    title: "#fbbf24",
    border: "#d97706",
    text: "#fef3c7",
    font: "'Playfair Display', Georgia, serif",
    motif: "⚜️",
  },
  "rose-floral": {
    name: "Pastel Rose",
    bg: "#fff1f2",
    title: "#9f1239",
    border: "#f43f5e",
    text: "#4c0519",
    font: "'Playfair Display', Georgia, serif",
    motif: "🌸",
  },
  "emerald-temple": {
    name: "Emerald Temple",
    bg: "#064e3b",
    title: "#a7f3d0",
    border: "#10b981",
    text: "#ecfdf5",
    font: "'Playfair Display', Georgia, serif",
    motif: "🪔",
  },
  "midnight-glam": {
    name: "Midnight Glam",
    bg: "#0f172a",
    title: "#93c5fd",
    border: "#38bdf8",
    text: "#f8fafc",
    font: "'Outfit', sans-serif",
    motif: "✨",
  },
  "sunset-violet": {
    name: "Sunset Violet",
    bg: "#2e1065",
    title: "#f472b6",
    border: "#c084fc",
    text: "#fdf4ff",
    font: "'Playfair Display', Georgia, serif",
    motif: "🔮",
  },
  "ocean-sapphire": {
    name: "Ocean Sapphire",
    bg: "#0c2340",
    title: "#7dd3fc",
    border: "#0284c7",
    text: "#f0f9ff",
    font: "'Playfair Display', Georgia, serif",
    motif: "💎",
  },
  "minimal-serif": {
    name: "Minimalist Serif",
    bg: "#fafaf9",
    title: "#292524",
    border: "#a8a29e",
    text: "#1c1917",
    font: "Georgia, serif",
    motif: "✦",
  },
};

const BG_SWATCHES = [
  "#3b0c13", // Royal Maroon
  "#0f172a", // Midnight Dark
  "#064e3b", // Deep Emerald
  "#2e1065", // Royal Violet
  "#0c2340", // Sapphire Blue
  "#fff1f2", // Pastel Rose
  "#fafaf9", // Sand White
  "#ffffff", // Pure White
];

const TITLE_SWATCHES = [
  "#fbbf24", // Gold
  "#38bdf8", // Sky Blue
  "#34d399", // Mint Green
  "#f472b6", // Rose Pink
  "#c084fc", // Lavender
  "#9f1239", // Deep Wine
  "#ffffff", // Crisp White
  "#1c1917", // Obsidian Black
];

const BORDER_SWATCHES = [
  "#d97706", // Amber Gold
  "#38bdf8", // Sky Blue
  "#10b981", // Emerald
  "#f43f5e", // Rose Red
  "#c084fc", // Violet
  "#0284c7", // Ocean Blue
  "#a8a29e", // Stone
  "#e2e8f0", // Subtle Slate
];

const TEXT_SWATCHES = [
  "#fef3c7", // Cream
  "#ffffff", // White
  "#ecfdf5", // Mint Tint
  "#fdf4ff", // Lavender Tint
  "#4c0519", // Deep Burgundy
  "#1c1917", // Jet Black
  "#334155", // Charcoal Slate
];

function getDefaultCardTitle(evt: EventData | null): string {
  if (!evt) return "Celebration Invitation";
  const type = (evt.eventType || "").toLowerCase();
  const title = (evt.title || "").toLowerCase();

  if (type.includes("birthday") || title.includes("birthday")) {
    return "Birthday Celebration";
  }
  if (type.includes("anniversary") || title.includes("anniversary")) {
    return "Anniversary Celebration";
  }
  if (type.includes("engagement") || title.includes("engagement")) {
    return "Engagement Ceremony";
  }
  if (type.includes("reception") || title.includes("reception")) {
    return "Wedding Reception";
  }
  if (type.includes("sangeet") || type.includes("mehendi") || title.includes("sangeet") || title.includes("mehendi")) {
    return "Sangeet & Mehendi Celebration";
  }
  if (type.includes("housewarming") || type.includes("griha") || title.includes("housewarming")) {
    return "Housewarming Ceremony";
  }
  if (type.includes("corporate") || title.includes("gala") || title.includes("conference")) {
    return "Corporate Gala & Banquet";
  }
  if (type.includes("baby") || title.includes("shower")) {
    return "Baby Shower Celebration";
  }
  if (type.includes("wedding") || title.includes("weds") || title.includes("wedding")) {
    return "Wedding Celebration";
  }
  if (evt.eventType) {
    return `${evt.eventType} Celebration`;
  }
  if (evt.title) {
    return `${evt.title} Invitation`;
  }
  return "Celebration Invitation";
}

export default function InvitationMaker() {
  const [event, setEvent] = useState<EventData | null>(() => getStoredEvent());

  const eventTitle = event?.title || "";
  const eventCity = event?.city || "";
  const eventState = event?.state || "";
  const eventDateStr = event?.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const [invitation, setInvitation] = useState<InvitationData>(() => {
    const defaultTitle = getDefaultCardTitle(event);

    try {
      const stored = localStorage.getItem(`eventos_invitation_${event?.id || "default"}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          title: parsed.title || defaultTitle,
          customBgColor: parsed.customBgColor || THEME_DEFAULTS["royal-gold"].bg,
          customTitleColor: parsed.customTitleColor || THEME_DEFAULTS["royal-gold"].title,
          customBorderColor: parsed.customBorderColor || THEME_DEFAULTS["royal-gold"].border,
          customTextColor: parsed.customTextColor || THEME_DEFAULTS["royal-gold"].text,
        };
      }
    } catch {}

    if (event) {
      return {
        title: defaultTitle,
        hosts: "Together with their families",
        celebrants: eventTitle ? eventTitle.replace(/weds/i, "&") : "Bride & Groom",
        date: eventDateStr,
        time: "10:30 AM onwards",
        muhurthamTime: "Muhurtham: 10:45 AM - 11:30 AM",
        venueName: eventCity ? `${eventCity} Grand Convention Center` : "",
        address: eventCity ? `Main Road, ${eventCity}, ${eventState}` : "",
        message:
          "We cordially invite you and your family to bless the auspicious union and celebrate our special day with love and joy.",
        dressCode: "Traditional / Festive Formal",
        rsvpPhone: "",
        rsvpEmail: "",
        theme: "royal-gold",
        customBgColor: THEME_DEFAULTS["royal-gold"].bg,
        customTitleColor: THEME_DEFAULTS["royal-gold"].title,
        customBorderColor: THEME_DEFAULTS["royal-gold"].border,
        customTextColor: THEME_DEFAULTS["royal-gold"].text,
      };
    }

    return {
      title: "Wedding Invitation",
      hosts: "Together with their families",
      celebrants: "Bride & Groom",
      date: "",
      time: "",
      muhurthamTime: "",
      venueName: "",
      address: "",
      message: "We cordially invite you and your family to join us on our special day.",
      dressCode: "",
      rsvpPhone: "",
      rsvpEmail: "",
      theme: "royal-gold",
      customBgColor: THEME_DEFAULTS["royal-gold"].bg,
      customTitleColor: THEME_DEFAULTS["royal-gold"].title,
      customBorderColor: THEME_DEFAULTS["royal-gold"].border,
      customTextColor: THEME_DEFAULTS["royal-gold"].text,
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEventChange = () => {
      const refreshed = getStoredEvent();
      setEvent(refreshed);
      if (refreshed) {
        const newTitle = getDefaultCardTitle(refreshed);
        setInvitation((prev) => ({
          ...prev,
          title: newTitle,
          celebrants: (refreshed.title || "Celebration").replace(/weds/i, "&"),
          venueName: `${refreshed.city || "City"} Heritage Convention Center`,
          address: `Main Road, Near Temple Garden, ${refreshed.city || "City"}, ${refreshed.state || "State"}`,
        }));
      }
    };
    window.addEventListener("eventos_event_changed", handleEventChange);
    window.addEventListener("storage", handleEventChange);
    return () => {
      window.removeEventListener("eventos_event_changed", handleEventChange);
      window.removeEventListener("storage", handleEventChange);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        `eventos_invitation_${event?.id || "default"}`,
        JSON.stringify(invitation)
      );
      showToast("✨ Invitation & E-Card styling saved successfully!");
    } catch {
      showToast("Failed to save invitation.");
    }
  };

  const handleCopyLink = () => {
    const shareUrl =
      window.location.origin +
      `/invitations?event=${encodeURIComponent(eventTitle)}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("📋 Invitation link copied to clipboard!");
  };

  const handleWhatsAppShare = () => {
    const text = `✨ *Wedding & Celebration Invitation* ✨\n\n${invitation.hosts}\nCordially invite you to celebrate the wedding of\n❤️ *${invitation.celebrants}* ❤️\n\n📅 *Date:* ${invitation.date}\n⏰ *Time:* ${invitation.time} (${invitation.muhurthamTime})\n📍 *Venue:* ${invitation.venueName}, ${invitation.address}\n\n"${invitation.message}"\n\nRSVP: ${invitation.rsvpPhone}\nView Digital E-Card: ${window.location.origin}/invitations`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    showToast("⏳ Rendering high-resolution invitation card...");
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: invitation.customBgColor || currentThemeMeta.bg,
        logging: false,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      const safeName = (invitation.celebrants || "Invitation").replace(/[^a-z0-9]/gi, "_");
      link.href = image;
      link.download = `${safeName}_Invitation.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("📥 Invitation PNG card downloaded successfully!");
    } catch (err) {
      console.error("Failed to download invitation card image:", err);
      showToast("Failed to render invitation download.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintPDF = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Please allow popups to open printable invitation.");
      return;
    }

    const cardHtml = cardElement.outerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invitation.celebrants || "Event"} - Digital Invitation</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f8fafc;
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-card-wrapper {
              width: 100%;
              max-width: 580px;
              box-sizing: border-box;
            }
            @media print {
              body { background: transparent; padding: 0; }
              .print-card-wrapper { max-width: 100%; width: 100%; box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-card-wrapper">
            ${cardHtml}
          </div>
          <script>
            setTimeout(() => {
              window.print();
            }, 600);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast("🖨️ Opening invitation print/PDF window...");
  };

  const handleSelectTheme = (tId: TemplateTheme) => {
    const d = THEME_DEFAULTS[tId];
    setInvitation({
      ...invitation,
      theme: tId,
      customBgColor: d.bg,
      customTitleColor: d.title,
      customBorderColor: d.border,
      customTextColor: d.text,
    });
  };

  const currentThemeMeta = THEME_DEFAULTS[invitation.theme] || THEME_DEFAULTS["royal-gold"];

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main" style={{ paddingBottom: "3rem" }}>
        <Header placeholder="Search templates, invitations, celebrations..." />

        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 9999,
              background: "#0f172a",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              fontWeight: 600,
              animation: "fadeIn 0.3s ease",
            }}
          >
            <CheckCircle2 size={18} className="text-green" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Title area */}
        <div
          className="bookings-header"
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p className="eyebrow dark">DIGITAL INVITATION &amp; E-CARD STUDIO</p>
            <h1>Invitation &amp; E-Card Maker</h1>
            <p className="sub-text">
              Design personalized digital wedding invitations, customize color palettes, and share elegant celebration cards with your guests.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              style={{
                background: "linear-gradient(135deg, #059669, #10B981)",
                border: "none",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: isDownloading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                transition: "all 0.2s",
                opacity: isDownloading ? 0.7 : 1,
              }}
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              <span>{isDownloading ? "Downloading..." : "Download Card (PNG)"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPDF}
              style={{
                background: "#ffffff",
                border: "1.5px solid #cbd5e1",
                color: "#334155",
                borderRadius: "10px",
                padding: "10px 16px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "all 0.2s",
              }}
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                background: "#ffffff",
                border: "1.5px solid #cbd5e1",
                color: "#334155",
                borderRadius: "10px",
                padding: "10px 16px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "all 0.2s",
              }}
            >
              <Copy size={16} />
              <span>Copy Link</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                border: "none",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                transition: "all 0.2s",
              }}
            >
              <MessageCircle size={16} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Replaced Banner: Guest Greetings & Celebration Card Status */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)",
            border: "1.5px solid #bae6fd",
            borderRadius: "14px",
            padding: "16px 22px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
              }}
            >
              💌
            </div>
            <div>
              <strong style={{ fontSize: "14.5px", color: "#0369a1", display: "block" }}>
                Personalized Digital Celebration Card
              </strong>
              <span style={{ fontSize: "12.5px", color: "#0284c7" }}>
                Share your digital e-card with family and friends via WhatsApp or instant copy link. Customize fonts, wordings, and colors below.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                fontSize: "12.5px",
                padding: "8px 16px",
                background: "#ffffff",
                border: "1px solid #7dd3fc",
                color: "#0284c7",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 6px rgba(2, 132, 199, 0.1)",
              }}
            >
              <Copy size={14} />
              <span>Copy Invitation Link</span>
            </button>
          </div>
        </div>

        {/* Split Studio Workspace: Left Editor / Right Live Card Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* LEFT: Customizer Form */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "18px",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "12px",
              }}
            >
              <Palette size={20} className="text-blue" />
              <h3 style={{ fontSize: "16px", margin: 0, color: "#0f172a" }}>
                E-Card Customizer &amp; Color Palette
              </h3>
            </div>

            {/* Preset Themes */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                SELECT PRESET THEME
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "8px",
                }}
              >
                {(
                  Object.keys(THEME_DEFAULTS) as TemplateTheme[]
                ).map((tId) => {
                  const t = THEME_DEFAULTS[tId];
                  const isSelected = invitation.theme === tId;
                  return (
                    <button
                      key={tId}
                      type="button"
                      onClick={() => handleSelectTheme(tId)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: isSelected
                          ? `2px solid ${t.border}`
                          : "1px solid #e2e8f0",
                        background: isSelected ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1e293b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <span
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: t.bg,
                          display: "inline-block",
                          border: `1.5px solid ${t.border}`,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Color Palette Customizer */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <strong style={{ fontSize: "13px", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={15} color="#2563eb" />
                  <span>Interactive Color Palette</span>
                </strong>
                <button
                  type="button"
                  onClick={() => handleSelectTheme(invitation.theme)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  title="Reset colors to theme defaults"
                >
                  <RefreshCw size={11} />
                  <span>Reset Colors</span>
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {/* 1. Background Color */}
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Card Background
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="color"
                      value={invitation.customBgColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customBgColor: e.target.value })
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        padding: "2px",
                        background: "#ffffff",
                      }}
                    />
                    <input
                      type="text"
                      value={invitation.customBgColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customBgColor: e.target.value })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                  {/* Quick Color Swatches */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    {BG_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setInvitation({ ...invitation, customBgColor: hex })}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: hex,
                          border: invitation.customBgColor === hex ? "2px solid #2563eb" : "1px solid #94a3b8",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. Title & Celebrants Color */}
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Title / Names Color
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="color"
                      value={invitation.customTitleColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customTitleColor: e.target.value })
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        padding: "2px",
                        background: "#ffffff",
                      }}
                    />
                    <input
                      type="text"
                      value={invitation.customTitleColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customTitleColor: e.target.value })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                  {/* Quick Title Swatches */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    {TITLE_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setInvitation({ ...invitation, customTitleColor: hex })}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: hex,
                          border: invitation.customTitleColor === hex ? "2px solid #2563eb" : "1px solid #94a3b8",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Border & Frame Accent Color */}
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Frame Border / Accent
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="color"
                      value={invitation.customBorderColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customBorderColor: e.target.value })
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        padding: "2px",
                        background: "#ffffff",
                      }}
                    />
                    <input
                      type="text"
                      value={invitation.customBorderColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customBorderColor: e.target.value })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                  {/* Quick Border Swatches */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    {BORDER_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setInvitation({ ...invitation, customBorderColor: hex })}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: hex,
                          border: invitation.customBorderColor === hex ? "2px solid #2563eb" : "1px solid #94a3b8",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. Text / Body Color */}
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Text / Message Color
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="color"
                      value={invitation.customTextColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customTextColor: e.target.value })
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        padding: "2px",
                        background: "#ffffff",
                      }}
                    />
                    <input
                      type="text"
                      value={invitation.customTextColor}
                      onChange={(e) =>
                        setInvitation({ ...invitation, customTextColor: e.target.value })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                  {/* Quick Text Swatches */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    {TEXT_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setInvitation({ ...invitation, customTextColor: hex })}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: hex,
                          border: invitation.customTextColor === hex ? "2px solid #2563eb" : "1px solid #94a3b8",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Top Heading / Celebration Type */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Card Top Heading / Celebration Type
              </label>
              <input
                type="text"
                value={invitation.title}
                onChange={(e) =>
                  setInvitation({ ...invitation, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "13.5px",
                  outline: "none",
                }}
                placeholder="e.g. Birthday Celebration, Wedding Celebration, Anniversary Gala"
              />
            </div>

            {/* Celebrants & Couple Names */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Celebrants / Honoree Names
              </label>
              <input
                type="text"
                value={invitation.celebrants}
                onChange={(e) =>
                  setInvitation({ ...invitation, celebrants: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                }}
                placeholder="e.g. Ram & Seetha, Priya's 25th Birthday"
              />
            </div>

            {/* Hosts Welcome Line */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Host Welcome Line
              </label>
              <input
                type="text"
                value={invitation.hosts}
                onChange={(e) =>
                  setInvitation({ ...invitation, hosts: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "13px",
                  outline: "none",
                }}
                placeholder="e.g. Together with their families"
              />
            </div>

            {/* Date & Times Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "4px",
                  }}
                >
                  Event Date
                </label>
                <input
                  type="text"
                  value={invitation.date}
                  onChange={(e) =>
                    setInvitation({ ...invitation, date: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "4px",
                  }}
                >
                  Time &amp; Muhurtham
                </label>
                <input
                  type="text"
                  value={invitation.muhurthamTime}
                  onChange={(e) =>
                    setInvitation({
                      ...invitation,
                      muhurthamTime: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Venue & Location */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Venue Name &amp; Hall
              </label>
              <input
                type="text"
                value={invitation.venueName}
                onChange={(e) =>
                  setInvitation({ ...invitation, venueName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "13px",
                  outline: "none",
                  marginBottom: "6px",
                }}
                placeholder="Hall or Resort Name"
              />
              <input
                type="text"
                value={invitation.address}
                onChange={(e) =>
                  setInvitation({ ...invitation, address: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "12px",
                  outline: "none",
                  color: "#64748b",
                }}
                placeholder="Full address, City, State"
              />
            </div>

            {/* Custom Invitation Message */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Custom Invitation Message
              </label>
              <textarea
                value={invitation.message}
                onChange={(e) =>
                  setInvitation({ ...invitation, message: e.target.value })
                }
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "13px",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            {/* RSVP Phone & Dress Code */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "4px",
                  }}
                >
                  RSVP Contact (Phone)
                </label>
                <input
                  type="text"
                  value={invitation.rsvpPhone}
                  onChange={(e) =>
                    setInvitation({ ...invitation, rsvpPhone: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "4px",
                  }}
                >
                  Dress Code
                </label>
                <input
                  type="text"
                  value={invitation.dressCode}
                  onChange={(e) =>
                    setInvitation({ ...invitation, dressCode: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            >
              Save E-Card Styling &amp; Template
            </button>
          </div>

          {/* RIGHT: Live Interactive E-Card Preview */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={18} className="text-blue" />
                <strong style={{ fontSize: "14px", color: "#334155" }}>
                  LIVE DIGITAL E-CARD PREVIEW
                </strong>
              </div>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Updates in real-time with your colors
              </span>
            </div>

            {/* The E-Card Presentation Frame */}
            <div
              ref={cardRef}
              style={{
                background: invitation.customBgColor || currentThemeMeta.bg,
                color: invitation.customTextColor || currentThemeMeta.text,
                fontFamily: currentThemeMeta.font,
                borderRadius: "20px",
                border: `3px solid ${invitation.customBorderColor || currentThemeMeta.border}`,
                padding: "36px 28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                minHeight: "560px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              }}
            >
              {/* Top Ornate Motif */}
              <div>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>
                  {currentThemeMeta.motif}
                </div>
                <p
                  style={{
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontSize: "11px",
                    opacity: 0.85,
                    margin: "0 0 10px",
                    fontWeight: 700,
                  }}
                >
                  {invitation.title}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontStyle: "italic",
                    margin: "0 0 18px",
                    opacity: 0.9,
                  }}
                >
                  {invitation.hosts}
                </p>

                <h1
                  style={{
                    fontSize: "2.4rem",
                    margin: "0 0 16px",
                    color: invitation.customTitleColor || currentThemeMeta.title,
                    fontWeight: 700,
                    lineHeight: "1.2",
                    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {invitation.celebrants}
                </h1>

                <div
                  style={{
                    width: "80px",
                    height: "2px",
                    background:
                      invitation.customBorderColor || currentThemeMeta.border,
                    margin: "0 auto 18px",
                    opacity: 0.6,
                  }}
                />

                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.6",
                    maxWidth: "420px",
                    margin: "0 auto 24px",
                    opacity: 0.92,
                    color: invitation.customTextColor || currentThemeMeta.text,
                  }}
                >
                  {invitation.message}
                </p>
              </div>

              {/* Date & Muhurtham Badge */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${invitation.customBorderColor || currentThemeMeta.border}`,
                  borderRadius: "14px",
                  padding: "16px 20px",
                  margin: "0 auto 20px",
                  width: "100%",
                  maxWidth: "400px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  <Calendar
                    size={16}
                    color={invitation.customTitleColor || currentThemeMeta.title}
                  />
                  <span>{invitation.date}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "12px",
                    opacity: 0.9,
                  }}
                >
                  <Clock
                    size={14}
                    color={invitation.customTitleColor || currentThemeMeta.title}
                  />
                  <span>{invitation.muhurthamTime}</span>
                </div>
              </div>

              {/* Venue & Location */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: invitation.customTitleColor || currentThemeMeta.title,
                    marginBottom: "4px",
                  }}
                >
                  <MapPin size={16} />
                  <span>{invitation.venueName}</span>
                </div>
                <p style={{ fontSize: "12px", opacity: 0.85, margin: "0 0 8px" }}>
                  {invitation.address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${invitation.venueName} ${invitation.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color:
                      invitation.customTitleColor || currentThemeMeta.title,
                    fontSize: "11.5px",
                    fontWeight: 700,
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>Open Venue in Google Maps</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Dress Code & Warm Celebration Footer */}
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    opacity: 0.75,
                    margin: "0 0 14px",
                    letterSpacing: "1px",
                  }}
                >
                  DRESS CODE: {invitation.dressCode.toUpperCase()}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255, 255, 255, 0.12)",
                    border: `1.5px solid ${invitation.customBorderColor || currentThemeMeta.border}`,
                    padding: "10px 24px",
                    borderRadius: "24px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Heart
                    size={16}
                    fill={invitation.customTitleColor || currentThemeMeta.title}
                    color={invitation.customTitleColor || currentThemeMeta.title}
                  />
                  <strong style={{ fontSize: "13px", letterSpacing: "0.5px" }}>
                    We look forward to celebrating with you!
                  </strong>
                </div>

                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    opacity: 0.9,
                    marginTop: "12px",
                    fontWeight: 600,
                  }}
                >
                  RSVP &amp; Enquiries: {invitation.rsvpPhone}
                </span>
              </div>
            </div>

            {/* Download Action Buttons */}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                style={{
                  flex: 1,
                  minWidth: "220px",
                  background: "linear-gradient(135deg, #059669, #10B981)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  transition: "all 0.2s",
                  opacity: isDownloading ? 0.7 : 1,
                }}
              >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span>{isDownloading ? "Generating Image..." : "Download HD Invitation (PNG)"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPDF}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  color: "#0f172a",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                }}
              >
                <Printer size={18} />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
