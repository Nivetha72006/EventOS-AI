import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  X,
  Sliders,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export interface DaySlotConfig {
  status: "open" | "booked" | "tentative" | "blocked";
  morningStatus?: "open" | "booked" | "tentative" | "blocked";
  eveningStatus?: "open" | "booked" | "tentative" | "blocked";
  eventName?: string;
  clientName?: string;
  venue?: string;
  notes?: string;
  surgeMultiplier?: number; // e.g. 1.25 for 25% surge
  assignedCrew?: string;
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

// 2026 Auspicious Muhurtham & Peak Wedding Dates Database
const AUSPICIOUS_MUHURTHAM_DATES: Record<string, string> = {
  "2026-02-14": "Valentine & Spring Wedding Muhurtham",
  "2026-02-22": "Shukla Paksha Auspicious Muhurtham",
  "2026-03-02": "Phalguna Purnima Royal Muhurtham",
  "2026-03-15": "Maha Muhurtham (Highest Booking Demand)",
  "2026-03-26": "Spring Navaratri Auspicious Day",
  "2026-04-02": "Chaitra Shukla Tritiya",
  "2026-04-14": "Vishu & Tamil New Year Super Peak",
  "2026-04-20": "Akshaya Tritiya Grand Muhurtham",
  "2026-05-08": "Vaisakhi Auspicious Wedding Day",
  "2026-05-24": "Jyeshtha Shukla Super Muhurtham",
  "2026-06-12": "Mid-Summer Royal Wedding Weekend",
};

export default function VendorAvailability() {
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const vp = user.vendorProfile || {};
  const vendorCategories: string[] =
    vp.categories && vp.categories.length > 0
      ? vp.categories
      : vp.category
      ? [vp.category]
      : ["Catering & Feasts", "Stage & Mandap Decorators"];

  const vendorKey = (user.email || user.name || "vendor_default").toLowerCase().replace(/[^a-z0-9]/g, "_");

  // Current calendar view month and year
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 2, 1)); // March 2026 default

  // Calendar slot mappings: dateKey (YYYY-MM-DD) -> DaySlotConfig
  const [calendarSlots, setCalendarSlots] = useState<Record<string, DaySlotConfig>>(() => {
    try {
      const stored = localStorage.getItem(`eventos_vendor_calendar_${vendorKey}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    // Default calendar slots
    return {
      "2026-03-15": {
        status: "booked",
        morningStatus: "booked",
        eveningStatus: "booked",
        eventName: "Rohit & Meenakshi Royal Wedding",
        clientName: "Dr. K. Nambiar",
        venue: "Palakkad Palace Heritage Grounds",
        notes: "Full team deployed. 650 guests sadhya feast.",
        surgeMultiplier: 1.25,
        assignedCrew: "Lead Team Alpha",
      },
      "2026-04-02": {
        status: "tentative",
        morningStatus: "open",
        eveningStatus: "tentative",
        eventName: "Sunset Beach Sangeet Celebration",
        clientName: "Ananya & Siddharth",
        venue: "Taj Fisherman's Cove Lawn",
        notes: "Client inquiry pending final advance confirmation.",
        surgeMultiplier: 1.15,
        assignedCrew: "Crew Beta",
      },
      "2026-03-08": {
        status: "blocked",
        morningStatus: "blocked",
        eveningStatus: "blocked",
        notes: "Equipment maintenance & team rest day.",
      },
    };
  });

  // Operating Settings
  const [maxEventsPerDay, setMaxEventsPerDay] = useState<number>(2);
  const [enableAutoBuffer, setEnableAutoBuffer] = useState<boolean>(true);
  const [operatingRadius, setOperatingRadius] = useState<string>("Within 75 km radius");

  // Interactive Modal for Editing Date Slot
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<"open" | "booked" | "tentative" | "blocked">("open");
  const [modalMorningStatus, setModalMorningStatus] = useState<"open" | "booked" | "tentative" | "blocked">("open");
  const [modalEveningStatus, setModalEveningStatus] = useState<"open" | "booked" | "tentative" | "blocked">("open");
  const [modalEventName, setModalEventName] = useState("");
  const [modalClientName, setModalClientName] = useState("");
  const [modalVenue, setModalVenue] = useState("");
  const [modalNotes, setModalNotes] = useState("");
  const [modalSurgeMultiplier, setModalSurgeMultiplier] = useState<number>(1.0);
  const [modalAssignedCrew, setModalAssignedCrew] = useState("Team Alpha");

  // Sync with confirmed bookings from eventos_bookings
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem("eventos_bookings");
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        if (Array.isArray(parsed)) {
          setCalendarSlots((prev) => {
            const next = { ...prev };
            parsed.forEach((b: any) => {
              if (b.status === "active" && b.eventDate) {
                // Parse date string into YYYY-MM-DD
                const parsedDate = new Date(b.eventDate);
                if (!isNaN(parsedDate.getTime())) {
                  const y = parsedDate.getFullYear();
                  const m = String(parsedDate.getMonth() + 1).padStart(2, "0");
                  const d = String(parsedDate.getDate()).padStart(2, "0");
                  const key = `${y}-${m}-${d}`;

                  if (!next[key] || next[key].status !== "booked") {
                    next[key] = {
                      status: "booked",
                      morningStatus: "booked",
                      eveningStatus: "booked",
                      eventName: b.eventName || "Confirmed Client Event",
                      clientName: b.clientName || "Event Organizer",
                      venue: b.venue || "Heritage Venue",
                      notes: b.details || "Confirmed contract via EventOS.",
                      surgeMultiplier: 1.2,
                      assignedCrew: "Primary Crew",
                    };
                  }
                }
              }
            });
            return next;
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleUserChange = () => {
      const u = getStoredUser();
      setUser(u);
    };
    window.addEventListener("eventos_user_changed", handleUserChange);
    return () => window.removeEventListener("eventos_user_changed", handleUserChange);
  }, []);

  const saveCalendarSlots = (updated: Record<string, DaySlotConfig>) => {
    setCalendarSlots(updated);
    localStorage.setItem(`eventos_vendor_calendar_${vendorKey}`, JSON.stringify(updated));
  };

  // Month Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date(2026, 2, 1));
  };

  // Calendar Day Generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Handle Opening Modal for a Date
  const handleOpenDateModal = (day: number) => {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    const dateKey = `${year}-${mStr}-${dStr}`;

    setSelectedDateKey(dateKey);
    const existing = calendarSlots[dateKey];
    if (existing) {
      setModalStatus(existing.status || "open");
      setModalMorningStatus(existing.morningStatus || existing.status || "open");
      setModalEveningStatus(existing.eveningStatus || existing.status || "open");
      setModalEventName(existing.eventName || "");
      setModalClientName(existing.clientName || "");
      setModalVenue(existing.venue || "");
      setModalNotes(existing.notes || "");
      setModalSurgeMultiplier(existing.surgeMultiplier || 1.0);
      setModalAssignedCrew(existing.assignedCrew || "Team Alpha");
    } else {
      const isAuspicious = Boolean(AUSPICIOUS_MUHURTHAM_DATES[dateKey]);
      setModalStatus("open");
      setModalMorningStatus("open");
      setModalEveningStatus("open");
      setModalEventName("");
      setModalClientName("");
      setModalVenue("");
      setModalNotes(isAuspicious ? `Auspicious Muhurtham Date: ${AUSPICIOUS_MUHURTHAM_DATES[dateKey]}` : "");
      setModalSurgeMultiplier(isAuspicious ? 1.25 : 1.0);
      setModalAssignedCrew("Team Alpha");
    }
  };

  const handleSaveDateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateKey) return;

    const updated = {
      ...calendarSlots,
      [selectedDateKey]: {
        status: modalStatus,
        morningStatus: modalMorningStatus,
        eveningStatus: modalEveningStatus,
        eventName: modalEventName.trim() || undefined,
        clientName: modalClientName.trim() || undefined,
        venue: modalVenue.trim() || undefined,
        notes: modalNotes.trim() || undefined,
        surgeMultiplier: modalSurgeMultiplier > 1 ? modalSurgeMultiplier : undefined,
        assignedCrew: modalAssignedCrew,
      },
    };

    saveCalendarSlots(updated);
    setSelectedDateKey(null);
  };

  // Metrics for Current Month
  let bookedDaysCount = 0;
  let tentativeDaysCount = 0;
  let blockedDaysCount = 0;
  let openDaysCount = 0;
  let auspiciousCount = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    const k = `${year}-${mStr}-${dStr}`;
    const cfg = calendarSlots[k];
    if (AUSPICIOUS_MUHURTHAM_DATES[k]) auspiciousCount++;

    if (cfg?.status === "booked") bookedDaysCount++;
    else if (cfg?.status === "tentative") tentativeDaysCount++;
    else if (cfg?.status === "blocked") blockedDaysCount++;
    else openDaysCount++;
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main vendor-dashboard-layout">
        <Header placeholder="Search dates, booked clients, venues..." />

        {/* Page Top Header */}
        <div className="vendor-welcome-header">
          <span className="eyebrow dark">AVAILABILITY & SCHEDULE COMMAND CENTER</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0 }}>Availability & Muhurtham Schedule 🗓️✨</h1>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: "12px", border: "1px solid #fde68a" }}>
                  ⭐ Vedic Muhurtham Radar Active
                </span>
              </div>
              <p style={{ margin: "4px 0 0" }}>
                Manage slot capacity, mark auspicious wedding dates, block off-days, and lock client reservations for <strong>{user.name || "Vendor Partner"}</strong> ({vendorCategories.join(" & ")}).
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleOpenDateModal(15)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                }}
              >
                <Plus size={16} />
                <span>Configure Slot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational Availability Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "22px" }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Open Dates Available</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>
              {openDaysCount} Days
            </div>
            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
              Ready for client bookings
            </span>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Booked & Confirmed</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#dc2626", marginTop: "4px" }}>
              {bookedDaysCount} Days
            </div>
            <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>
              Locked with contracts
            </span>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Tentative Holds</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#d97706", marginTop: "4px" }}>
              {tentativeDaysCount} Days
            </div>
            <span style={{ fontSize: "11px", color: "#d97706", fontWeight: 600 }}>
              Under inquiry review
            </span>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Auspicious Muhurthams</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#854d0e", marginTop: "4px" }}>
              {auspiciousCount} Dates
            </div>
            <span style={{ fontSize: "11px", color: "#ca8a04", fontWeight: 700 }}>
              ⭐ High surge pricing potential
            </span>
          </div>
        </div>

        {/* Main Grid: Calendar on Left, Operating Controls & Auspicious Radar on Right */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "22px", alignItems: "start" }}>
          {/* ─── LEFT: INTERACTIVE MONTHLY CALENDAR GRID ─── */}
          <div style={{ background: "#ffffff", borderRadius: "18px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
            {/* Calendar Navigation Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CalendarIcon size={20} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: "19px", color: "#0f172a", fontWeight: 800 }}>
                  {monthName} {year}
                </h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleGoToday}
                  style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Current Season
                </button>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <ChevronLeft size={16} color="#475569" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <ChevronRight size={16} color="#475569" />
                  </button>
                </div>
              </div>
            </div>

            {/* Legend Indicators */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", marginBottom: "16px", fontSize: "12px", color: "#475569" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} /> Open
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} /> Booked (Contract)
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} /> Tentative Hold
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#64748b" }} /> Blocked Off-Day
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#b45309", fontWeight: 700 }}>
                ⭐ Auspicious Muhurtham
              </span>
            </div>

            {/* Weekday Header */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", textAlign: "center", fontWeight: 700, fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} style={{ padding: "6px 0" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Day Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
              {daysArray.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} style={{ minHeight: "90px", borderRadius: "10px", background: "#f8fafc", opacity: 0.4 }} />;
                }

                const mStr = String(month + 1).padStart(2, "0");
                const dStr = String(day).padStart(2, "0");
                const dateKey = `${year}-${mStr}-${dStr}`;
                const cfg = calendarSlots[dateKey];
                const isAuspicious = Boolean(AUSPICIOUS_MUHURTHAM_DATES[dateKey]);

                const isBooked = cfg?.status === "booked";
                const isTentative = cfg?.status === "tentative";
                const isBlocked = cfg?.status === "blocked";

                const bg = isBooked
                  ? "#fef2f2"
                  : isTentative
                  ? "#fffbeb"
                  : isBlocked
                  ? "#f1f5f9"
                  : isAuspicious
                  ? "#fefce8"
                  : "#ffffff";

                const border = isBooked
                  ? "1.5px solid #fca5a5"
                  : isTentative
                  ? "1.5px solid #fde68a"
                  : isBlocked
                  ? "1px solid #cbd5e1"
                  : isAuspicious
                  ? "1.5px solid #fef08a"
                  : "1px solid #e2e8f0";

                return (
                  <div
                    key={dateKey}
                    onClick={() => handleOpenDateModal(day)}
                    style={{
                      minHeight: "95px",
                      borderRadius: "12px",
                      background: bg,
                      border: border,
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Top Row: Date Number + Auspicious Tag */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: 800, color: isBlocked ? "#64748b" : "#0f172a" }}>
                        {day}
                      </span>
                      {isAuspicious && (
                        <span style={{ fontSize: "11px", lineHeight: 1 }} title={AUSPICIOUS_MUHURTHAM_DATES[dateKey]}>
                          ⭐
                        </span>
                      )}
                    </div>

                    {/* Middle: Event or Status Badge */}
                    <div style={{ margin: "4px 0" }}>
                      {isBooked && (
                        <div style={{ background: "#ef4444", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "10.5px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          🔒 {cfg.eventName || "Booked"}
                        </div>
                      )}
                      {isTentative && (
                        <div style={{ background: "#f59e0b", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "10.5px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          ⏳ {cfg.eventName || "Hold / Inquiry"}
                        </div>
                      )}
                      {isBlocked && (
                        <div style={{ background: "#94a3b8", color: "#ffffff", padding: "3px 6px", borderRadius: "5px", fontSize: "10px", fontWeight: 700, textAlign: "center" }}>
                          Off-Day
                        </div>
                      )}
                      {!isBooked && !isTentative && !isBlocked && (
                        <div style={{ fontSize: "10px", color: isAuspicious ? "#b45309" : "#10b981", fontWeight: 700 }}>
                          {isAuspicious ? "✨ Muhurtham Open" : "✓ Open (2 Slots)"}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Surge indicator if any */}
                    <div style={{ fontSize: "9.5px", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                      <span>{cfg?.assignedCrew ? cfg.assignedCrew.split(" ")[1] || "Alpha" : ""}</span>
                      {cfg?.surgeMultiplier && cfg.surgeMultiplier > 1 && (
                        <span style={{ color: "#d97706", fontWeight: 700 }}>+{Math.round((cfg.surgeMultiplier - 1) * 100)}% Surge</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── RIGHT: OPERATING CONTROLS & AUSPICIOUS MUHURTHAM RADAR ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Auspicious Muhurtham Radar Box */}
            <div style={{ background: "linear-gradient(135deg, #fefce8, #fffbeb)", borderRadius: "16px", padding: "20px", border: "1.5px solid #fef08a", boxShadow: "0 4px 14px rgba(245, 158, 11, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Sparkles size={18} color="#d97706" />
                <h3 style={{ margin: 0, fontSize: "15.5px", color: "#92400e", fontWeight: 800 }}>
                  Muhurtham & Peak Surge Radar
                </h3>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "#78350f", lineHeight: 1.45 }}>
                High-demand Vedic & Tamil wedding dates in <strong>{vp.city || "your region"}</strong>. Demand is 4.5x higher than average.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.entries(AUSPICIOUS_MUHURTHAM_DATES)
                  .filter(([d]) => d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
                  .map(([d, name]) => {
                    const cfg = calendarSlots[d];
                    const isBooked = cfg?.status === "booked";

                    return (
                      <div
                        key={d}
                        style={{
                          background: "#ffffff",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: isBooked ? "1px solid #fca5a5" : "1px solid #fed7aa",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
                            {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </strong>
                          <span style={{ fontSize: "11px", color: "#b45309" }}>{name}</span>
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            background: isBooked ? "#fef2f2" : "#ecfdf5",
                            color: isBooked ? "#dc2626" : "#059669",
                            padding: "2px 8px",
                            borderRadius: "12px",
                          }}
                        >
                          {isBooked ? "Locked" : "Open (+25%)"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Operational Buffer & Crew Capacity Settings */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Sliders size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                  Operating Rules & Capacity
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Max Parallel Events Per Day
                  </label>
                  <select
                    value={maxEventsPerDay}
                    onChange={(e) => setMaxEventsPerDay(Number(e.target.value))}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value={1}>1 Event / Day (Exclusive Focus)</option>
                    <option value={2}>2 Events / Day (Morning + Evening Slots)</option>
                    <option value={3}>3 Events / Day (Multi-Crew Operations)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Operating Radius
                  </label>
                  <select
                    value={operatingRadius}
                    onChange={(e) => setOperatingRadius(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="Within 50 km radius">Within 50 km radius (Local Only)</option>
                    <option value="Within 100 km radius">Within 100 km radius (Regional)</option>
                    <option value="Pan-Kerala / Tamil Nadu Outstation">Pan-South Outstation Travel</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <strong style={{ fontSize: "12.5px", color: "#0f172a", display: "block" }}>Auto-Buffer Lead Time</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Blocks 12h rest after heavy sadhyas & grand setups</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAutoBuffer}
                    onChange={(e) => setEnableAutoBuffer(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#2563eb", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── DATE SLOT CONFIGURATION MODAL ─── */}
      {selectedDateKey && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
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
              borderRadius: "18px",
              padding: "24px",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>SLOT CONFIGURATION</span>
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                  {new Date(selectedDateKey).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDateKey(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleSaveDateConfig} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Overall Day Status */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Day Availability Status
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                  {[
                    { id: "open", label: "Open", color: "#10b981" },
                    { id: "booked", label: "Booked", color: "#ef4444" },
                    { id: "tentative", label: "Hold", color: "#f59e0b" },
                    { id: "blocked", label: "Off-Day", color: "#64748b" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setModalStatus(st.id as any);
                        setModalMorningStatus(st.id as any);
                        setModalEveningStatus(st.id as any);
                      }}
                      style={{
                        padding: "8px 4px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: modalStatus === st.id ? 700 : 500,
                        border: modalStatus === st.id ? `2px solid ${st.color}` : "1px solid #cbd5e1",
                        background: modalStatus === st.id ? "#ffffff" : "#f8fafc",
                        color: modalStatus === st.id ? st.color : "#475569",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Granularity: Morning vs Evening */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    🌅 Morning Slot (Muhurtham)
                  </label>
                  <select
                    value={modalMorningStatus}
                    onChange={(e) => setModalMorningStatus(e.target.value as any)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff" }}
                  >
                    <option value="open">Open for Booking</option>
                    <option value="booked">Booked (Locked)</option>
                    <option value="tentative">Tentative Hold</option>
                    <option value="blocked">Blocked / Rest</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    🌙 Evening Slot (Reception)
                  </label>
                  <select
                    value={modalEveningStatus}
                    onChange={(e) => setModalEveningStatus(e.target.value as any)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff" }}
                  >
                    <option value="open">Open for Booking</option>
                    <option value="booked">Booked (Locked)</option>
                    <option value="tentative">Tentative Hold</option>
                    <option value="blocked">Blocked / Rest</option>
                  </select>
                </div>
              </div>

              {/* Attached Event & Client Details */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Event / Client Reference (Optional)
                </label>
                <input
                  type="text"
                  value={modalEventName}
                  onChange={(e) => setModalEventName(e.target.value)}
                  placeholder="e.g. Vivek & Rashmi Muhurtham"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={modalClientName}
                    onChange={(e) => setModalClientName(e.target.value)}
                    placeholder="e.g. Mr. K. Nambiar"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Assigned Crew Team
                  </label>
                  <select
                    value={modalAssignedCrew}
                    onChange={(e) => setModalAssignedCrew(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="Team Alpha">Team Alpha (Master Crew)</option>
                    <option value="Team Beta">Team Beta (Secondary Crew)</option>
                    <option value="Team Gamma">Team Gamma (Setup Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Peak Season Surge Multiplier
                </label>
                <select
                  value={modalSurgeMultiplier}
                  onChange={(e) => setModalSurgeMultiplier(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                >
                  <option value={1.0}>1.0x (Standard Base Price)</option>
                  <option value={1.15}>1.15x (+15% High Demand Surge)</option>
                  <option value={1.25}>1.25x (+25% Auspicious Muhurtham Surge)</option>
                  <option value={1.4}>1.40x (+40% Festival / Akshaya Tritiya Peak)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Internal Notes & Setup Details
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={2}
                  placeholder="Special instructions, travel requirements, equipment check..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedDateKey(null)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 22px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
