import { useState, useEffect } from "react";
import {
  CheckSquare,
  Search,
  Plus,
  Share2,
  User,
  Users,
  MapPin,
  Calendar,
  Phone,
  MessageSquare,
  X,
  Check,
  TrendingUp,
  Receipt,
  Trash2,
  RotateCcw,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export interface VendorBooking {
  id: string;
  vendorName: string;
  category: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  city: string;
  venue: string;
  guestCount: number;
  amount: number;
  advancePaid: number;
  status: "pending" | "active" | "completed" | "declined";
  details: string;
  packageTitle?: string;
  milestones: {
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
  notes?: string;
  createdAt: string;
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

function parseEventDateToTimestamp(dateStr: string): number | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  const directParsed = Date.parse(clean);
  if (!isNaN(directParsed)) return directParsed;

  const parts = clean.split(/[-/ ,]+/);
  if (parts.length >= 3) {
    const parsedAgain = Date.parse(parts.join(" "));
    if (!isNaN(parsedAgain)) return parsedAgain;
  }
  return null;
}

export function isEventDateInPast(dateStr: string): boolean {
  const ts = parseEventDateToTimestamp(dateStr);
  if (ts === null) {
    const lower = (dateStr || "").toLowerCase();
    if (lower.includes("january 2026") || lower.includes("jan 2026") || lower.includes("2025") || lower.includes("2024")) {
      return true;
    }
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return ts < today.getTime();
}

export function deduplicateBookings(items: VendorBooking[]): VendorBooking[] {
  const seenIds = new Set<string>();
  const seenSignatures = new Set<string>();
  const result: VendorBooking[] = [];

  for (const b of items) {
    if (!b) continue;
    const cleanId = (b.id || "").trim();
    const sig = `${(b.eventName || "").trim().toLowerCase()}___${(b.clientName || "").trim().toLowerCase()}___${(b.category || "").trim().toLowerCase()}___${(b.eventDate || "").trim().toLowerCase()}`;

    if (cleanId && seenIds.has(cleanId)) continue;
    if (sig.length > 10 && seenSignatures.has(sig)) continue;

    if (cleanId) seenIds.add(cleanId);
    if (sig.length > 10) seenSignatures.add(sig);
    result.push(b);
  }
  return result;
}

function matchesVendorRole(itemCategory: string | undefined, vendorCategories: string[]): boolean {
  if (!itemCategory || vendorCategories.length === 0) return true;
  const ic = itemCategory.toLowerCase();
  return vendorCategories.some((vc) => {
    const v = vc.toLowerCase();
    if (ic === v) return true;
    if (v.includes("cater") && (ic.includes("cater") || ic.includes("food") || ic.includes("sadhya") || ic.includes("feast"))) return true;
    if (v.includes("decor") && (ic.includes("decor") || ic.includes("mandap") || ic.includes("stage") || ic.includes("flower"))) return true;
    if (v.includes("photo") && (ic.includes("photo") || ic.includes("camera") || ic.includes("cinema") || ic.includes("video"))) return true;
    if (v.includes("dj") || v.includes("music") || v.includes("sound")) {
      if (ic.includes("dj") || ic.includes("music") || ic.includes("sound") || ic.includes("audio")) return true;
    }
    if (v.includes("makeup") || v.includes("beauty") || v.includes("hair")) {
      if (ic.includes("makeup") || ic.includes("beauty") || ic.includes("bridal") || ic.includes("hair")) return true;
    }
    if (v.includes("priest") || v.includes("vedic") || v.includes("pandit")) {
      if (ic.includes("priest") || ic.includes("vedic") || ic.includes("pandit") || ic.includes("pooja") || ic.includes("homam")) return true;
    }
    if (v.includes("mehendi") || v.includes("henna")) {
      if (ic.includes("mehendi") || ic.includes("henna")) return true;
    }
    if (v.includes("venue") || v.includes("hall") || v.includes("resort")) {
      if (ic.includes("venue") || ic.includes("hall") || ic.includes("resort") || ic.includes("lawn")) return true;
    }
    if (v.includes("invit") || v.includes("card") || v.includes("gift")) {
      if (ic.includes("invit") || ic.includes("card") || ic.includes("gift") || ic.includes("favor")) return true;
    }
    return false;
  });
}

function getDefaultBookings(vendorName: string, vendorCategories: string[], city: string): VendorBooking[] {
  const primaryRole = vendorCategories[0] || "Catering & Feasts";
  const isCatering = primaryRole.toLowerCase().includes("cater");
  const isDecor = primaryRole.toLowerCase().includes("decor");
  const isPhoto = primaryRole.toLowerCase().includes("photo");

  return [
    {
      id: "v-bk-101",
      vendorName,
      category: primaryRole,
      clientName: "Dr. K. Nambiar",
      clientPhone: "+91 98450 12345",
      clientEmail: "nambiar.wedding@gmail.com",
      eventName: "Rohit & Meenakshi Traditional Wedding",
      eventType: "Royal Wedding",
      eventDate: "March 15, 2026",
      city: city || "Palakkad",
      venue: "Palakkad Palace Heritage Grounds",
      guestCount: 650,
      amount: isCatering ? 312000 : isDecor ? 145000 : isPhoto ? 85000 : 65000,
      advancePaid: isCatering ? 100000 : isDecor ? 50000 : isPhoto ? 30000 : 25000,
      status: "active",
      packageTitle: isCatering ? "Grand Traditional 24-Dish Sadhya" : isDecor ? "Royal Lotus Temple Mandap" : "4K Cinematic Teaser + Drone",
      details: isCatering
        ? "Plantain leaf sadhya feast for 650 guests including 3 artisanal payasams, live hot jalebis, and uniformed servers."
        : "Complete 40ft carved gold mandap with 4,000 lotus stems, warm amber chandelier grid, and deepam walkway.",
      milestones: [
        { title: "Advance Deposit (Paid)", completed: true, dueDate: "Feb 01, 2026" },
        { title: "Menu / Decor Theme Finalized", completed: true, dueDate: "Feb 20, 2026" },
        { title: "Procurement & Team Briefing", completed: false, dueDate: "Mar 10, 2026" },
        { title: "On-site Setup & Readiness", completed: false, dueDate: "Mar 14, 2026" },
        { title: "Event Execution & Final Balance", completed: false, dueDate: "Mar 15, 2026" },
      ],
      notes: "Client requested additional pure ghee for all banana leaf servings. VIP table reservation for 40 elders.",
      createdAt: "2026-02-01T10:00:00Z",
    },
    {
      id: "v-bk-102",
      vendorName,
      category: vendorCategories[1] || primaryRole,
      clientName: "Ananya & Siddharth",
      clientPhone: "+91 97110 54321",
      clientEmail: "siddharth.ananya@outlook.com",
      eventName: "Sunset Beach Sangeet Celebration",
      eventType: "Sangeet & Cocktail",
      eventDate: "April 02, 2026",
      city: "Kovalam",
      venue: "Taj Fisherman's Cove Lawn",
      guestCount: 380,
      amount: isCatering ? 220000 : isDecor ? 95000 : isPhoto ? 65000 : 45000,
      advancePaid: 0,
      status: "pending",
      packageTitle: "Sunset Bohemian Canopy Setup",
      details: "Seeking quotation and confirmation for 380 guests. Requires special LED fairy light tunnel and interactive mocktail station.",
      milestones: [
        { title: "Proposal Review & Client Negotiation", completed: false, dueDate: "Feb 18, 2026" },
        { title: "Advance Token Confirmation", completed: false, dueDate: "Feb 25, 2026" },
        { title: "Site Inspection & Layout Sign-off", completed: false, dueDate: "Mar 15, 2026" },
      ],
      notes: "Client requested quotation breakdown for live Chaat counter and DJ console lights.",
      createdAt: "2026-02-12T14:30:00Z",
    },
  ];
}

export default function VendorBookings() {
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const vp = user.vendorProfile || {};
  const vendorCategories: string[] =
    vp.categories && vp.categories.length > 0
      ? vp.categories
      : vp.category
      ? [vp.category]
      : ["Catering & Feasts", "Stage & Mandap Decorators"];

  const vendorName = user.name || "Sri Balaji Catering & Decor";

  const [bookings, setBookings] = useState<VendorBooking[]>(() => {
    try {
      const stored = localStorage.getItem("eventos_bookings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted: VendorBooking[] = parsed.map((b: any, idx: number) => ({
            id: b.id ? String(b.id) : `v-bk-${idx + 100}`,
            vendorName: b.vendorName || vendorName,
            category: b.category || vendorCategories[0] || "Catering & Feasts",
            clientName: b.clientName || "Event Organizer",
            clientPhone: b.clientPhone || "+91 98765 43210",
            clientEmail: b.clientEmail || "client@eventos.ai",
            eventName: b.eventName || "Grand Wedding Celebration",
            eventType: b.eventType || "Royal Wedding",
            eventDate: b.eventDate || "2026",
            city: b.city || vp.city || "Palakkad",
            venue: b.venue || "Heritage Convention Center",
            guestCount: b.guestCount || 500,
            amount: Number(b.amount || b.vendorPrice || 50000),
            advancePaid: Number(b.advancePaid || (b.status === "completed" ? (b.amount || 50000) : (b.amount ? b.amount * 0.3 : 15000))),
            status: (b.status as any) || "active",
            packageTitle: b.packageTitle || b.title || "Custom Tailored Package",
            details: b.details || "Professional celebration arrangement.",
            milestones: b.milestones || [
              { title: "Advance Deposit", completed: b.status === "active" || b.status === "completed" },
              { title: "Scope & Design Finalized", completed: b.status === "active" || b.status === "completed" },
              { title: "Day-of Event Execution", completed: b.status === "completed" },
              { title: "Final Settlement Cleared", completed: b.status === "completed" },
            ],
            notes: b.notes || "",
            createdAt: b.createdAt || new Date().toISOString(),
          }));

          // Strict Deduplication & Auto-Clear of past completed events
          const deduplicated = deduplicateBookings(formatted);
          const activeOrUpcoming = deduplicated.filter(
            (b) => !(b.status === "completed" && isEventDateInPast(b.eventDate))
          );
          return activeOrUpcoming.length > 0 ? activeOrUpcoming : deduplicated;
        }
      }
    } catch {}
    return getDefaultBookings(vendorName, vendorCategories, vp.city || "Palakkad");
  });

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "completed" | "declined">("all");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<VendorBooking | null>(null);
  const [proposalModalBooking, setProposalModalBooking] = useState<VendorBooking | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [isAddDirectModalOpen, setIsAddDirectModalOpen] = useState(false);

  // New Direct Booking Form
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [newEventType, setNewEventType] = useState("Royal Wedding");
  const [newEventDate, setNewEventDate] = useState("2026-03-20");
  const [newCategory, setNewCategory] = useState(vendorCategories[0] || "Catering & Feasts");
  const [newVenue, setNewVenue] = useState("Heritage Palace Grounds");
  const [newGuestCount, setNewGuestCount] = useState(500);
  const [newAmount, setNewAmount] = useState("125000");
  const [newAdvance, setNewAdvance] = useState("35000");
  const [newDetails, setNewDetails] = useState("");

  const [copiedInvoiceText, setCopiedInvoiceText] = useState(false);

  useEffect(() => {
    const handleUserChange = () => {
      const u = getStoredUser();
      setUser(u);
    };
    window.addEventListener("eventos_user_changed", handleUserChange);
    return () => window.removeEventListener("eventos_user_changed", handleUserChange);
  }, []);

  // Save changes with deduplication and broadcast
  const saveBookingsToStorage = (updated: VendorBooking[]) => {
    const cleanList = deduplicateBookings(updated);
    setBookings(cleanList);
    localStorage.setItem("eventos_bookings", JSON.stringify(cleanList));
    window.dispatchEvent(new CustomEvent("eventos_bookings_changed"));
  };

  // Status Action Handlers
  const handleAcceptBooking = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: "active" as const,
          milestones: [
            { title: "Advance Deposit (25%)", completed: true, dueDate: "Confirmed" },
            { title: "Menu / Style Finalization", completed: false, dueDate: "T-14 Days" },
            { title: "Procurement & Raw Materials", completed: false, dueDate: "T-5 Days" },
            { title: "On-site Setup Readiness", completed: false, dueDate: "T-1 Day" },
            { title: "Grand Celebration Delivery", completed: false, dueDate: b.eventDate },
          ],
        };
      }
      return b;
    });
    saveBookingsToStorage(updated);
  };

  // Allow decline at ANY stage: pending, active, and even after completing
  const handleDeclineBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    const confirmPrompt =
      target?.status === "completed"
        ? "Decline & archive this completed celebration record?"
        : target?.status === "active"
        ? "Cancel and decline this active contract?"
        : "Decline this booking inquiry?";

    if (confirm(confirmPrompt)) {
      const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: "declined" as const } : b));
      saveBookingsToStorage(updated);
    }
  };

  // Permanently delete or clear single booking
  const handlePermanentlyDeleteBooking = (bookingId: string) => {
    if (confirm("Permanently clear this booking record from the page?")) {
      const updated = bookings.filter((b) => b.id !== bookingId);
      saveBookingsToStorage(updated);
    }
  };

  // Restore declined booking
  const handleRestoreBooking = (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: "pending" as const } : b));
    saveBookingsToStorage(updated);
  };

  // Mark as Completed
  const handleMarkCompleted = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: "completed" as const,
          advancePaid: b.amount,
          milestones: b.milestones.map((m) => ({ ...m, completed: true })),
        };
      }
      return b;
    });
    saveBookingsToStorage(updated);
  };

  // Clear completed events once event date is passed, or clear all completed
  const handleClearPastCompletedEvents = () => {
    const pastCompleted = bookings.filter((b) => b.status === "completed" && isEventDateInPast(b.eventDate));
    if (pastCompleted.length > 0) {
      if (confirm(`Found ${pastCompleted.length} completed event(s) whose date has passed. Clear them from the page?`)) {
        const remaining = bookings.filter((b) => !(b.status === "completed" && isEventDateInPast(b.eventDate)));
        saveBookingsToStorage(remaining);
        alert(`Successfully cleared ${pastCompleted.length} past completed event(s)!`);
        return;
      }
    } else {
      const allCompleted = bookings.filter((b) => b.status === "completed");
      if (allCompleted.length > 0) {
        if (confirm(`No past-dated completed events found. Would you like to clear all ${allCompleted.length} completed events from the page?`)) {
          const remaining = bookings.filter((b) => b.status !== "completed");
          saveBookingsToStorage(remaining);
          alert("Completed events cleared from the page.");
          return;
        }
      } else {
        alert("There are no completed events on the page to clear.");
      }
    }
  };

  const handleToggleMilestone = (bookingId: string, milestoneIndex: number) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const nextMilestones = [...b.milestones];
        nextMilestones[milestoneIndex] = {
          ...nextMilestones[milestoneIndex],
          completed: !nextMilestones[milestoneIndex].completed,
        };
        return { ...b, milestones: nextMilestones };
      }
      return b;
    });
    saveBookingsToStorage(updated);
  };

  const handleSendCounterProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalModalBooking) return;
    const updatedAmount = Number(counterAmount) || proposalModalBooking.amount;
    const updated = bookings.map((b) => {
      if (b.id === proposalModalBooking.id) {
        return {
          ...b,
          amount: updatedAmount,
          details: `${b.details}\n[Vendor Counter-Offer: ₹${updatedAmount.toLocaleString("en-IN")} - ${counterNote.trim()}]`,
        };
      }
      return b;
    });
    saveBookingsToStorage(updated);
    setProposalModalBooking(null);
    alert(`Counter-offer of ₹${updatedAmount.toLocaleString("en-IN")} sent successfully to client!`);
  };

  const handleCreateDirectBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: VendorBooking = {
      id: `v-dir-${Date.now()}`,
      vendorName,
      category: newCategory,
      clientName: newClientName.trim() || "Direct Client",
      clientPhone: newClientPhone.trim() || "+91 98765 43210",
      clientEmail: "client@celebrations.com",
      eventName: newEventName.trim() || "Grand Celebration",
      eventType: newEventType,
      eventDate: newEventDate,
      city: vp.city || "Palakkad",
      venue: newVenue.trim() || "Heritage Hall",
      guestCount: Number(newGuestCount) || 500,
      amount: Number(newAmount) || 85000,
      advancePaid: Number(newAdvance) || 25000,
      status: "active",
      packageTitle: "Direct Customized Contract",
      details: newDetails.trim() || "Direct client booking executed with full service scope.",
      milestones: [
        { title: "Advance Deposit (Received)", completed: true, dueDate: "Confirmed" },
        { title: "Scope & Design Finalized", completed: false, dueDate: "T-10 Days" },
        { title: "Event Day Delivery & Final Payment", completed: false, dueDate: newEventDate },
      ],
      createdAt: new Date().toISOString(),
    };

    saveBookingsToStorage([newBooking, ...bookings]);
    setIsAddDirectModalOpen(false);
  };

  const handleCopyInvoice = (b: VendorBooking) => {
    const taxRate = b.category.toLowerCase().includes("cater") ? 0.05 : 0.18;
    const taxAmount = Math.round(b.amount * taxRate);
    const totalAmount = b.amount + taxAmount;
    const balanceDue = Math.max(0, totalAmount - b.advancePaid);

    const invoiceText = `🧾 *OFFICIAL GST TAX INVOICE & CONTRACT RECEIPT*
🏷️ *Provider*: ${b.vendorName} (${b.category})
📍 *Location*: ${b.city} | Phone: ${user.phone || vp.phone || "+91 98765 43210"}
─────────────────────────────────
👤 *Billed To*: ${b.clientName} (${b.clientPhone})
🎉 *Event*: ${b.eventName} (${b.eventType})
📅 *Date & Venue*: ${b.eventDate} at ${b.venue}
👥 *Guest Scale*: ${b.guestCount} Pax
─────────────────────────────────
💰 *Contract Base Value*: ₹${b.amount.toLocaleString("en-IN")}
🧾 *GST/Taxes (${(taxRate * 100).toFixed(0)}%)*: ₹${taxAmount.toLocaleString("en-IN")}
✨ *Grand Total*: ₹${totalAmount.toLocaleString("en-IN")}
💵 *Advance Deposited*: ₹${b.advancePaid.toLocaleString("en-IN")}
⏳ *Balance Due on Event*: ₹${balanceDue.toLocaleString("en-IN")}
─────────────────────────────────
📋 *Scope & Deliverables*:
${b.details}

_Generated via EventOS AI Vendor Contracts Hub._`;

    navigator.clipboard.writeText(invoiceText);
    setCopiedInvoiceText(true);
    setTimeout(() => setCopiedInvoiceText(false), 2500);
  };

  // Filter Bookings by Status, Role, and Search
  const q = searchQuery.toLowerCase().trim();
  const roleFiltered = bookings.filter((b) => {
    const matchRole = roleFilter === "All" || matchesVendorRole(b.category, [roleFilter]);
    const matchStatus = statusFilter === "all" ? b.status !== "declined" : b.status === statusFilter;
    const matchQuery =
      !q ||
      b.clientName.toLowerCase().includes(q) ||
      b.eventName.toLowerCase().includes(q) ||
      b.venue.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);

    return matchRole && matchStatus && matchQuery;
  });

  // Calculate Metrics
  const activeBookingsCount = bookings.filter((b) => b.status === "active").length;
  const pendingInquiriesCount = bookings.filter((b) => b.status === "pending").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const declinedCount = bookings.filter((b) => b.status === "declined").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "active" || b.status === "completed")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main vendor-dashboard-layout">
        <Header placeholder="Search client bookings, events, venues..." />

        {/* Page Top Header */}
        <div className="vendor-welcome-header">
          <span className="eyebrow dark">CONTRACTS & CLIENT PIPELINE</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0 }}>Bookings & Contracts Hub 📋✨</h1>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "12px", border: "1px solid #a7f3d0" }}>
                  ✓ Clean Deduplicated Pipeline
                </span>
              </div>
              <p style={{ margin: "4px 0 0" }}>
                Review incoming requests, decline or negotiate at any stage, track milestones, and manage completed event schedules.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearPastCompletedEvents}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 16px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#dc2626",
                    fontWeight: 700,
                    fontSize: "13px",
                    border: "1px solid #fecaca",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  <Trash2 size={15} color="#dc2626" />
                  <span>Clear Completed Events</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsAddDirectModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "13.5px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                <Plus size={16} />
                <span>Create Direct Booking</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top Financial & Operational Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Total Contract Value</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span style={{ fontSize: "11.5px", color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "4px" }}>
              <TrendingUp size={13} /> Active & Completed
            </span>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Active Contracts</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#2563eb", marginTop: "6px" }}>
              {activeBookingsCount} Events
            </div>
            <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", display: "block" }}>
              In Preparation Pipeline
            </span>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Pending Inquiries</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#d97706", marginTop: "6px" }}>
              {pendingInquiriesCount} Inquiries
            </div>
            <span style={{ fontSize: "11.5px", color: "#d97706", fontWeight: 700, marginTop: "4px", display: "block" }}>
              Needs Review / Response
            </span>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Completed Celebrations</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669", marginTop: "6px" }}>
              {completedCount} Delivered
            </div>
            <span style={{ fontSize: "11.5px", color: "#059669", fontWeight: 700, marginTop: "4px", display: "block" }}>
              100% On-Time Execution
            </span>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          {/* Status Tabs */}
          <div style={{ display: "flex", background: "#f1f5f9", padding: "4px", borderRadius: "12px", gap: "4px", flexWrap: "wrap" }}>
            {[
              { id: "all", label: `All Active (${activeBookingsCount + pendingInquiriesCount + completedCount})` },
              { id: "pending", label: `Inquiries (${pendingInquiriesCount})` },
              { id: "active", label: `Active (${activeBookingsCount})` },
              { id: "completed", label: `Completed (${completedCount})` },
              { id: "declined", label: `Declined (${declinedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: statusFilter === tab.id ? 700 : 500,
                  border: "none",
                  background: statusFilter === tab.id ? "#ffffff" : "transparent",
                  color: statusFilter === tab.id ? "#0f172a" : "#64748b",
                  boxShadow: statusFilter === tab.id ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Role Filter & In-Page Search */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {["All", ...vendorCategories].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "11.5px",
                    fontWeight: roleFilter === r ? 700 : 500,
                    border: roleFilter === r ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                    background: roleFilter === r ? "#eff6ff" : "#ffffff",
                    color: roleFilter === r ? "#1d4ed8" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", width: "220px" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "6px 26px 6px 30px", borderRadius: "18px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}
                >
                  <X size={12} color="#64748b" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings & Contracts List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {roleFiltered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#ffffff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
              <CheckSquare size={42} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>No bookings in this view</h3>
              <p style={{ margin: "6px 0 16px", fontSize: "13px", color: "#64748b" }}>
                {statusFilter === "completed"
                  ? "All completed events have been delivered or cleared."
                  : statusFilter === "declined"
                  ? "No declined bookings in archive."
                  : "When clients request your services or you add a direct contract, it will appear here."}
              </p>
              <button
                type="button"
                onClick={() => setIsAddDirectModalOpen(true)}
                style={{ padding: "8px 20px", borderRadius: "8px", background: "#2563eb", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }}
              >
                Create Direct Booking
              </button>
            </div>
          ) : (
            roleFiltered.map((b) => {
              const balance = Math.max(0, b.amount - b.advancePaid);
              const completedMilestones = b.milestones.filter((m) => m.completed).length;
              const progressPct = b.milestones.length > 0 ? Math.round((completedMilestones / b.milestones.length) * 100) : 100;
              const isPast = isEventDateInPast(b.eventDate);

              return (
                <div
                  key={b.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "20px",
                    border:
                      b.status === "pending"
                        ? "1.5px solid #fde68a"
                        : b.status === "declined"
                        ? "1px solid #fecaca"
                        : "1px solid #e2e8f0",
                    boxShadow: b.status === "pending" ? "0 4px 16px rgba(245, 158, 11, 0.08)" : "0 2px 8px rgba(0,0,0,0.03)",
                    transition: "all 0.2s",
                    opacity: b.status === "declined" ? 0.85 : 1,
                  }}
                >
                  {/* Top Row: Event Name, Category, Status Badge, and Amount */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            background:
                              b.status === "active"
                                ? "#eff6ff"
                                : b.status === "pending"
                                ? "#fef3c7"
                                : b.status === "completed"
                                ? "#ecfdf5"
                                : "#fef2f2",
                            color:
                              b.status === "active"
                                ? "#1d4ed8"
                                : b.status === "pending"
                                ? "#b45309"
                                : b.status === "completed"
                                ? "#059669"
                                : "#dc2626",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                          }}
                        >
                          {b.status === "active"
                            ? "🟢 Confirmed Contract"
                            : b.status === "pending"
                            ? "⏳ New Inquiry"
                            : b.status === "completed"
                            ? "✓ Completed"
                            : "✕ Declined"}
                        </span>
                        <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>
                          {b.category}
                        </span>
                        <span className="bullet-dot">·</span>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                          {b.eventType}
                        </span>
                        {isPast && b.status === "completed" && (
                          <span style={{ fontSize: "10.5px", fontWeight: 700, background: "#f1f5f9", color: "#64748b", padding: "1px 6px", borderRadius: "4px" }}>
                            Past Event
                          </span>
                        )}
                      </div>
                      <h3 style={{ margin: 0, fontSize: "17.5px", color: "#0f172a", fontWeight: 700 }}>
                        {b.eventName}
                      </h3>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>
                        ₹{b.amount.toLocaleString("en-IN")}
                      </strong>
                      <span style={{ display: "block", fontSize: "11.5px", color: "#64748b" }}>
                        {b.advancePaid > 0 ? `Advance: ₹${b.advancePaid.toLocaleString("en-IN")} · Bal: ₹${balance.toLocaleString("en-IN")}` : "Full Amount Due"}
                      </span>
                    </div>
                  </div>

                  {/* Client & Venue Meta Bar */}
                  <div style={{ display: "flex", gap: "16px", padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", marginBottom: "14px", fontSize: "12.5px", color: "#475569", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#0f172a", fontWeight: 600 }}>
                      <User size={13} color="#2563eb" /> {b.clientName}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Phone size={13} color="#64748b" /> {b.clientPhone}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={13} color="#64748b" /> {b.eventDate}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} color="#64748b" /> {b.venue}, {b.city}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Users size={13} color="#64748b" /> {b.guestCount} Guests
                    </span>
                  </div>

                  {/* Scope / Inclusions Details */}
                  <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#334155", lineHeight: 1.45 }}>
                    {b.details}
                  </p>

                  {/* Interactive Milestone Progress Strip (For Active & Completed Bookings) */}
                  {b.status !== "declined" && (
                    <div style={{ marginBottom: "16px", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Execution Milestones ({completedMilestones}/{b.milestones.length})
                        </span>
                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: progressPct === 100 ? "#059669" : "#2563eb" }}>
                          {progressPct}% Completed
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
                        <div style={{ height: "100%", width: `${progressPct}%`, background: progressPct === 100 ? "#10b981" : "#2563eb", transition: "width 0.3s" }} />
                      </div>

                      {/* Milestone Check Pills */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {b.milestones.map((m, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleMilestone(b.id, idx)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "11.5px",
                              fontWeight: m.completed ? 700 : 500,
                              border: m.completed ? "1px solid #10b981" : "1px solid #cbd5e1",
                              background: m.completed ? "#ecfdf5" : "#ffffff",
                              color: m.completed ? "#047857" : "#475569",
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            <Check size={12} color={m.completed ? "#10b981" : "#94a3b8"} />
                            <span>{m.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <a
                        href={`https://wa.me/${b.clientPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(b.clientName)},%20this%20is%20${encodeURIComponent(b.vendorName)}%20regarding%20your%20celebration%20booking.`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "#25d366",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        <MessageSquare size={13} /> WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => setInvoiceModalBooking(b)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Receipt size={13} /> Invoice / Receipt
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      {/* PENDING INQUIRY ACTIONS */}
                      {b.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setProposalModalBooking(b);
                              setCounterAmount(String(b.amount));
                              setCounterNote("Standard package with customized inclusions.");
                            }}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "6px",
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              color: "#1d4ed8",
                              fontSize: "12.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Counter-Offer
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptBooking(b.id)}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "6px",
                              background: "#16a34a",
                              border: "none",
                              color: "#ffffff",
                              fontSize: "12.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Accept & Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeclineBooking(b.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#ffffff",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {/* ACTIVE CONTRACT ACTIONS */}
                      {b.status === "active" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarkCompleted(b.id)}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "6px",
                              background: "#059669",
                              border: "none",
                              color: "#ffffff",
                              fontSize: "12.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Mark Event Delivered ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeclineBooking(b.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#ffffff",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            Cancel / Decline
                          </button>
                        </>
                      )}

                      {/* COMPLETED CELEBRATION ACTIONS */}
                      {b.status === "completed" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handlePermanentlyDeleteBooking(b.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#ffffff",
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            <X size={12} color="#64748b" /> Clear from Page
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeclineBooking(b.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#ffffff",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            Decline / Archive
                          </button>
                        </>
                      )}

                      {/* DECLINED RECORD ACTIONS */}
                      {b.status === "declined" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRestoreBooking(b.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              color: "#1d4ed8",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <RotateCcw size={12} /> Restore Inquiry
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePermanentlyDeleteBooking(b.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#ffffff",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            Delete Permanently
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ─── GST INVOICE & CONTRACT RECEIPT MODAL ─── */}
      {invoiceModalBooking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.8)",
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
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Receipt size={20} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                  Contract Invoice & Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceModalBooking(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} color="#64748b" />
              </button>
            </div>

            {/* Printable Invoice Box */}
            <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "12px" }}>
                <div>
                  <strong style={{ fontSize: "15px", color: "#0f172a", display: "block" }}>{invoiceModalBooking.vendorName}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{invoiceModalBooking.category}</span>
                  <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>{vp.city || "Palakkad, Kerala"}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "4px" }}>
                    OFFICIAL RECEIPT
                  </span>
                  <span style={{ fontSize: "11.5px", color: "#64748b", display: "block", marginTop: "4px" }}>
                    Invoice ID: #{invoiceModalBooking.id}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Client Details:</span>
                <div style={{ color: "#0f172a", fontWeight: 600 }}>{invoiceModalBooking.clientName}</div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>{invoiceModalBooking.clientPhone} · {invoiceModalBooking.eventName}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #e2e8f0" }}>
                <span>Base Service Package:</span>
                <strong style={{ color: "#0f172a" }}>₹{invoiceModalBooking.amount.toLocaleString("en-IN")}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>Taxes & GST ({invoiceModalBooking.category.toLowerCase().includes("cater") ? "5%" : "18%"}):</span>
                <span>₹{Math.round(invoiceModalBooking.amount * (invoiceModalBooking.category.toLowerCase().includes("cater") ? 0.05 : 0.18)).toLocaleString("en-IN")}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px dashed #cbd5e1" }}>
                <span>Advance Paid:</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>₹{invoiceModalBooking.advancePaid.toLocaleString("en-IN")}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", borderTop: "1.5px solid #0f172a", fontSize: "15px", fontWeight: 800 }}>
                <span>Balance Due on Event Day:</span>
                <span style={{ color: "#2563eb" }}>₹{Math.max(0, invoiceModalBooking.amount - invoiceModalBooking.advancePaid).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => handleCopyInvoice(invoiceModalBooking)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: copiedInvoiceText ? "#10b981" : "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {copiedInvoiceText ? (
                  <>
                    <Check size={14} /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Share2 size={14} /> Copy Receipt Text
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setInvoiceModalBooking(null)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── COUNTER-OFFER PROPOSAL MODAL ─── */}
      {proposalModalBooking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.8)",
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
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                Send Counter-Offer to {proposalModalBooking.clientName}
              </h3>
              <button
                type="button"
                onClick={() => setProposalModalBooking(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleSendCounterProposal} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Revised Quotation Price (₹)
                </label>
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  placeholder="e.g. 150000"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Counter-Offer Note / Inclusions
                </label>
                <textarea
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  rows={3}
                  placeholder="Explain your price calibration or complimentary value additions..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setProposalModalBooking(null)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Send Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CREATE DIRECT BOOKING MODAL ─── */}
      {isAddDirectModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.8)",
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
              maxWidth: "540px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                  Record Direct Client Contract
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDirectModalOpen(false)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleCreateDirectBooking} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Suresh Menon"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. Suresh & Lakshmi Muhurtham"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Event Type
                  </label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="Royal Wedding">Royal Wedding</option>
                    <option value="Traditional Muhurtham">Traditional Muhurtham</option>
                    <option value="Sangeet & Cocktail">Sangeet & Cocktail</option>
                    <option value="Grand Reception">Grand Reception</option>
                    <option value="Intimate Engagement">Intimate Engagement</option>
                    <option value="Corporate Gala">Corporate Gala</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Service Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    {vendorCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Heritage Palace Lawn"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Guest Count
                  </label>
                  <input
                    type="number"
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(Number(e.target.value))}
                    placeholder="500"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Total Contract Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="125000"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={newAdvance}
                    onChange={(e) => setNewAdvance(e.target.value)}
                    placeholder="35000"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Contract Inclusions & Details
                </label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  rows={2}
                  placeholder="Key deliverables, menu items, or decor themes..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddDirectModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 22px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
