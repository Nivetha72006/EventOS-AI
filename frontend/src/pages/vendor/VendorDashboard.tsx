import { useState, useEffect } from "react";
import {
  Star,
  CalendarDays,
  DollarSign,
  Award,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Edit3,
  CheckCircle2,
  Sparkles,
  MapPin,
  Briefcase,
  Tag,
  X,
  Check,
  Store,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

const VENDOR_CATEGORIES = [
  "Catering & Feasts",
  "Stage & Mandap Decorators",
  "Photography & Cinematography",
  "Music, DJ & Sound",
  "Banquet Halls & Venues",
  "Bridal Makeup & Styling",
  "Priest, Pandit & Rituals",
  "Mehendi & Henna Art",
  "Invitations & Gifts",
];

function matchesVendorRole(itemCategory?: string, vendorCategories: string[] = []): boolean {
  if (!vendorCategories || vendorCategories.length === 0) return true;
  if (!itemCategory) return true;
  const normItem = itemCategory.toLowerCase();

  return vendorCategories.some((vc) => {
    const normVc = vc.toLowerCase();
    if (normItem.includes(normVc) || normVc.includes(normItem)) return true;

    if ((normItem.includes("cater") || normItem.includes("food") || normItem.includes("feast") || normItem.includes("sadhya") || normItem.includes("balaji")) &&
        (normVc.includes("cater") || normVc.includes("feast"))) return true;

    if ((normItem.includes("decor") || normItem.includes("mandap") || normItem.includes("stage") || normItem.includes("flower") || normItem.includes("petal")) &&
        (normVc.includes("decor") || normVc.includes("mandap"))) return true;

    if ((normItem.includes("photo") || normItem.includes("video") || normItem.includes("camera") || normItem.includes("cinema") || normItem.includes("lens") || normItem.includes("frames")) &&
        (normVc.includes("photo") || normVc.includes("cinema"))) return true;

    if ((normItem.includes("music") || normItem.includes("dj") || normItem.includes("sound") || normItem.includes("strings") || normItem.includes("rhythm")) &&
        (normVc.includes("music") || normVc.includes("sound") || normVc.includes("dj"))) return true;

    if ((normItem.includes("venue") || normItem.includes("hall") || normItem.includes("mandapam") || normItem.includes("convention") || normItem.includes("palace") || normItem.includes("resort")) &&
        (normVc.includes("venue") || normVc.includes("hall") || normVc.includes("banquet"))) return true;

    if ((normItem.includes("makeup") || normItem.includes("bridal") || normItem.includes("styling") || normItem.includes("beauty") || normItem.includes("glam")) &&
        (normVc.includes("makeup") || normVc.includes("styling"))) return true;

    if ((normItem.includes("priest") || normItem.includes("pandit") || normItem.includes("vadhyar") || normItem.includes("ritual")) &&
        (normVc.includes("priest") || normVc.includes("pandit"))) return true;

    if ((normItem.includes("mehendi") || normItem.includes("henna")) &&
        (normVc.includes("mehendi") || normVc.includes("henna"))) return true;

    if ((normItem.includes("invitation") || normItem.includes("card") || normItem.includes("gift")) &&
        (normVc.includes("invitation") || normVc.includes("gift"))) return true;

    return false;
  });
}

interface VendorProfileData {
  businessName?: string;
  category?: string;
  categories?: string[];
  experienceYears?: number | string;
  city?: string;
  basePrice?: number;
  phone?: string;
  bio?: string;
  rating?: number;
  reviewsCount?: number;
}

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "USER" | "VENDOR";
  phone?: string;
  avatarUrl?: string;
  vendorProfile?: VendorProfileData;
}

interface BookingItem {
  id: string;
  vendorName?: string;
  category?: string;
  status?: "pending" | "active" | "completed" | "declined";
  amount?: number;
  vendorPrice?: number;
  eventName?: string;
  eventDate?: string;
  city?: string;
  guestCount?: number;
  details?: string;
  clientName?: string;
}

interface CalendarDateConfig {
  status: "open" | "booked" | "tentative" | "blocked";
  note?: string;
}

interface CustomerReview {
  id: string;
  clientName: string;
  eventTitle: string;
  rating: number;
  date: string;
  comment: string;
  eventType: string;
  category: string;
}

function getStoredUser(): StoredUser {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Sri Balaji Catering", role: "VENDOR" };
  } catch {
    return { name: "Sri Balaji Catering", role: "VENDOR" };
  }
}

function getStoredBookings(): BookingItem[] {
  try {
    const stored = localStorage.getItem("eventos_bookings");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function VendorDashboardPage({ user: passedUser }: { user?: StoredUser }) {
  const [user, setUser] = useState<StoredUser>(() => passedUser || getStoredUser());

  useEffect(() => {
    const handleUserChange = () => {
      setUser(getStoredUser());
    };
    window.addEventListener("eventos_user_changed", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("eventos_user_changed", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  return <VendorDashboard user={user} />;
}

function VendorDashboard({ user }: { user: StoredUser }) {
  const [currentUser, setCurrentUser] = useState<StoredUser>(user);
  const [bookings, setBookings] = useState<BookingItem[]>(() => getStoredBookings());

  const vp = currentUser.vendorProfile || {};
  const vendorCategories: string[] =
    vp.categories && vp.categories.length > 0
      ? vp.categories
      : vp.category
      ? [vp.category]
      : ["Catering & Feasts"];

  const displayName = currentUser.name || vp.businessName || "Sri Balaji Catering";
  const experienceYears = vp.experienceYears || "9";
  const city = vp.city || "Palakkad, Kerala";
  const phone = currentUser.phone || vp.phone || "+91 98765 43210";
  const basePrice = vp.basePrice || 45000;

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: displayName,
    categories: vendorCategories,
    experienceYears: String(experienceYears),
    city,
    basePrice: String(basePrice),
    phone,
    bio: vp.bio || "Delivering authentic, memorable feasts and luxury experiences for grand celebrations.",
  });

  const toggleFormCategory = (cat: string) => {
    if (profileForm.categories.includes(cat)) {
      if (profileForm.categories.length > 1) {
        setProfileForm({
          ...profileForm,
          categories: profileForm.categories.filter((c) => c !== cat),
        });
      }
    } else {
      setProfileForm({
        ...profileForm,
        categories: [...profileForm.categories, cat],
      });
    }
  };

  // Calendar State & Interactive Editing
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026 default
  const [customCalendar, setCustomCalendar] = useState<Record<string, CalendarDateConfig>>(() => {
    const vendorKey = (currentUser.name || "default_vendor").toLowerCase().replace(/\s+/g, "_");
    try {
      const stored = localStorage.getItem(`eventos_vendor_calendar_${vendorKey}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      "2026-08-03": { status: "booked", note: "Priya & Arjun Wedding" },
      "2026-08-11": { status: "booked", note: "TechNova Annual Gala" },
      "2026-08-19": { status: "booked", note: "Lakshmi Baby Shower" },
      "2026-08-07": { status: "tentative", note: "Inquiry hold" },
      "2026-08-15": { status: "blocked", note: "Independence Day / Off-Duty" },
      "2026-12-14": { status: "booked", note: "Ram Weds Seetha (Grand Mandap Feast)" },
    };
  });

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [dateEditStatus, setDateEditStatus] = useState<"open" | "booked" | "tentative" | "blocked">("open");
  const [dateEditNote, setDateEditNote] = useState("");

  // Customer Reviews & Feedback tailored to vendor roles
  const [allReviews] = useState<CustomerReview[]>([
    {
      id: "rev-1",
      clientName: "Ram & Seetha",
      eventTitle: "Ram Weds Seetha Wedding",
      rating: 5,
      date: "August 2026",
      eventType: "Wedding",
      category: "Catering & Feasts",
      comment: "Exceptional sadhya catering arrangements! All 500 guests praised the authentic Palakkad sadhya feast. Seamless coordination and punctual service.",
    },
    {
      id: "rev-2",
      clientName: "Priya Sundaram",
      eventTitle: "Priya & Arjun Reception",
      rating: 5,
      date: "July 2026",
      eventType: "Reception",
      category: "Stage & Mandap Decorators",
      comment: "The floral mandap and stage lighting exceeded our expectations. Photogenic and breathtaking setup.",
    },
    {
      id: "rev-3",
      clientName: "Karthik Narayanan",
      eventTitle: "Corporate Annual Gala",
      rating: 4.9,
      date: "June 2026",
      eventType: "Corporate",
      category: "Photography & Cinematography",
      comment: "Professional execution, candid teaser reels delivered within 48 hours. Highly recommended team!",
    },
    {
      id: "rev-4",
      clientName: "Meenakshi Iyer",
      eventTitle: "Sangeet & Mehendi Night",
      rating: 5,
      date: "May 2026",
      eventType: "Sangeet",
      category: "Music, DJ & Sound",
      comment: "High energy DJ set, perfect sound balance, and great crowd engagement throughout the night.",
    },
  ]);

  // Filter reviews matching active vendor roles
  const reviews = allReviews.filter((r) =>
    matchesVendorRole(r.category, vendorCategories)
  );
  const displayReviews = reviews.length > 0 ? reviews : allReviews.slice(0, 2);

  const refreshAllData = () => {
    const u = getStoredUser();
    setCurrentUser(u);
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    refreshAllData();
    window.addEventListener("eventos_user_changed", refreshAllData);
    window.addEventListener("eventos_bookings_changed", refreshAllData);
    window.addEventListener("storage", refreshAllData);

    return () => {
      window.removeEventListener("eventos_user_changed", refreshAllData);
      window.removeEventListener("eventos_bookings_changed", refreshAllData);
      window.removeEventListener("storage", refreshAllData);
    };
  }, []);

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: StoredUser = {
      ...currentUser,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      vendorProfile: {
        ...currentUser.vendorProfile,
        businessName: profileForm.name.trim(),
        category: profileForm.categories.join(" & "),
        categories: profileForm.categories,
        experienceYears: Number(profileForm.experienceYears) || 8,
        city: profileForm.city.trim(),
        basePrice: Number(profileForm.basePrice) || 45000,
        phone: profileForm.phone.trim(),
        bio: profileForm.bio.trim(),
        rating: currentUser.vendorProfile?.rating || 4.9,
        reviewsCount: currentUser.vendorProfile?.reviewsCount || displayReviews.length,
      },
    };

    setCurrentUser(updatedUser);
    localStorage.setItem("eventos_user", JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent("eventos_user_changed"));
    setIsEditProfileOpen(false);
  };

  // Booking Actions (Accept / Decline)
  const handleAcceptBooking = (bookingId: string, clientOrEventName: string) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: "completed" as const };
      }
      return b;
    });

    setBookings(updatedBookings);
    localStorage.setItem("eventos_bookings", JSON.stringify(updatedBookings));

    // Automatically mark the event date on the schedule as "booked"
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking?.eventDate) {
      const d = new Date(targetBooking.eventDate);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const updatedCalendar = {
        ...customCalendar,
        [dateKey]: {
          status: "booked" as const,
          note: `${targetBooking.eventName || clientOrEventName} (${targetBooking.category || vendorCategories[0] || "Service"})`,
        },
      };
      setCustomCalendar(updatedCalendar);
      const vendorKey = (currentUser.name || "default_vendor").toLowerCase().replace(/\s+/g, "_");
      localStorage.setItem(`eventos_vendor_calendar_${vendorKey}`, JSON.stringify(updatedCalendar));
    }

    window.dispatchEvent(new CustomEvent("eventos_bookings_changed"));
    alert(`✓ Confirmed booking for "${clientOrEventName}"! Scheduled on your calendar.`);
  };

  const handleDeclineBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter((b) => b.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem("eventos_bookings", JSON.stringify(updatedBookings));
    window.dispatchEvent(new CustomEvent("eventos_bookings_changed"));
  };

  // Save calendar date config
  const handleSaveDateConfig = () => {
    if (!selectedDateKey) return;
    const updated = {
      ...customCalendar,
      [selectedDateKey]: {
        status: dateEditStatus,
        note: dateEditNote.trim() || undefined,
      },
    };
    setCustomCalendar(updated);
    const vendorKey = (currentUser.name || "default_vendor").toLowerCase().replace(/\s+/g, "_");
    localStorage.setItem(`eventos_vendor_calendar_${vendorKey}`, JSON.stringify(updated));
    setSelectedDateKey(null);
  };

  // Filter bookings strictly by the vendor's active 1 or more roles
  const roleFilteredBookings = bookings.filter((b) =>
    matchesVendorRole(b.category || b.vendorName, vendorCategories)
  );

  const pendingRequests = roleFilteredBookings.filter((b) => b.status === "pending" || !b.status);
  const activeConfirmedBookings = roleFilteredBookings.filter((b) => b.status === "active" || b.status === "completed");

  // Real Earnings & Performance
  const completedRevenue = activeConfirmedBookings.reduce(
    (sum, b) => sum + (b.amount || b.vendorPrice || 0),
    0
  );
  const averageRating = 4.9;
  const responseRate = 98;

  // Calendar calculations for selected month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const monthName = currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ empty: true, key: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const config = customCalendar[dateKey] || { status: "open" };
    calendarDays.push({
      empty: false,
      day,
      dateKey,
      status: config.status,
      note: config.note,
      key: dateKey,
    });
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main vendor-dashboard-layout">
        <Header placeholder="Search requests, bookings, menu items..." />

        {/* Welcome Header */}
        <div className="vendor-welcome-header">
          <span className="eyebrow dark">VENDOR OPERATING DASHBOARD</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h1>Welcome back, {displayName} 👋</h1>
              <p>Tailored specifically to your active roles: <strong>{vendorCategories.join(" & ")}</strong>.</p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setProfileForm({
                  name: displayName,
                  categories: vendorCategories,
                  experienceYears: String(experienceYears),
                  city,
                  basePrice: String(basePrice),
                  phone,
                  bio: vp.bio || "Delivering authentic, memorable feasts and luxury experiences for grand celebrations.",
                });
                setIsEditProfileOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
              }}
            >
              <Edit3 size={15} />
              <span>Edit Roles & Profile</span>
            </button>
          </div>
        </div>

        {/* Business details banner with Role Tags */}
        <section className="vendor-profile-strip-card" style={{ background: "#ffffff", borderRadius: "14px", padding: "18px 24px", boxShadow: "0 4px 14px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <div className="avatar-vendor-logo" style={{ width: "52px", height: "52px", borderRadius: "12px", background: "linear-gradient(135deg, #1e3a8a, #2563eb)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700 }}>
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="vendor-profile-info-content" style={{ flex: 1, minWidth: "240px" }}>
            <div className="vendor-business-title" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "18px", margin: 0, color: "#0f172a" }}>{displayName}</h2>
              <span className="verified-badge-label" style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                <ShieldCheck size={13} /> Verified Vendor
              </span>

              {/* Multi-role badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {vendorCategories.map((c) => (
                  <span
                    key={c}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      background: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                      color: "#1d4ed8",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    <Store size={11} /> {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="vendor-meta-stats-row" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginTop: "6px", fontSize: "13px", color: "#475569" }}>
              <div className="meta-item rating-meta" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Star size={14} fill="#f59e0b" stroke="none" />
                <strong style={{ color: "#0f172a" }}>{averageRating}</strong>
                <span style={{ color: "#64748b" }}>({displayReviews.length} verified reviews)</span>
              </div>
              <span className="bullet-dot">·</span>
              <span>{experienceYears} Years Experience</span>
              <span className="bullet-dot">·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={13} /> {city}
              </span>
              <span className="bullet-dot">·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600, color: "#0f172a" }}>
                <Tag size={13} /> Packages from ₹{Number(basePrice).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </section>

        {/* Stats Row Cards */}
        <section className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", margin: "20px 0" }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper text-blue">
              <CalendarDays size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-title">ROLE-MATCHED INQUIRIES</span>
              <div className="stat-value-row">
                <strong>{pendingRequests.length}</strong>
                {pendingRequests.length > 0 && <span className="trend-badge-positive">{pendingRequests.length} pending</span>}
              </div>
              <span className="stat-subtitle">For {vendorCategories.join(", ")}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper text-blue">
              <Award size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-title">CONFIRMED CONTRACTS</span>
              <div className="stat-value-row">
                <strong>{activeConfirmedBookings.length}</strong>
              </div>
              <span className="stat-subtitle">On your active schedule</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper text-blue">
              <DollarSign size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-title">SETTLED REVENUE</span>
              <div className="stat-value-row">
                <strong>₹{completedRevenue.toLocaleString("en-IN")}</strong>
              </div>
              <span className="stat-subtitle">From confirmed contracts</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper text-blue">
              <Star size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-title">AI PERFORMANCE RATING</span>
              <div className="stat-value-row">
                <strong>{averageRating} <span className="font-small-normal">/ 5.0</span></strong>
                <span className="trend-badge-positive">Top Tier</span>
              </div>
              <span className="stat-subtitle">{responseRate}% fulfillment rate</span>
            </div>
          </div>
        </section>

        {/* Content Rows Split */}
        <div className="vendor-dashboard-content-split">
          {/* Left panel columns */}
          <div className="split-left-pane">
            {/* Live Client Inquiries & Booking Requests (Filtered strictly to vendor roles) */}
            <div className="vendor-card-block">
              <div className="card-block-header">
                <div>
                  <h3>Client Inquiries ({vendorCategories.join(" & ")})</h3>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Filtered to your {vendorCategories.length} selected role{vendorCategories.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="booking-requests-table">
                {pendingRequests.length === 0 ? (
                  <div style={{ padding: "28px 16px", textAlign: "center", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                    <CheckCircle2 size={28} color="#10b981" style={{ margin: "0 auto 8px" }} />
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#334155" }}>
                      No pending inquiries in {vendorCategories.join(" & ")}.
                    </p>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      When organizers request {vendorCategories.join(" or ")}, they will appear here live.
                    </span>
                  </div>
                ) : (
                  pendingRequests.map((req) => {
                    const clientTitle = req.eventName || req.vendorName || "Celebration Booking";
                    const price = req.amount || req.vendorPrice || basePrice;
                    return (
                      <div key={req.id} className="table-row-request" style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                        <div className="avatar-letter-circle" style={{ background: "#eff6ff", color: "#2563eb", fontWeight: 700 }}>
                          {clientTitle.charAt(0)}
                        </div>
                        <div className="request-body-details" style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <strong style={{ fontSize: "14px", color: "#0f172a" }}>{clientTitle}</strong>
                            <span style={{ fontSize: "10.5px", background: "#e0e7ff", color: "#3730a3", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                              {req.category || vendorCategories[0]}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginTop: "2px" }}>
                            {req.city || city} · {req.details ? req.details.slice(0, 60) + "..." : "Requested via Marketplace"}
                          </span>
                          <strong style={{ fontSize: "13px", color: "#16a34a", marginTop: "4px", display: "block" }}>
                            ₹{Number(price).toLocaleString("en-IN")}
                          </strong>
                        </div>
                        <div className="request-action-buttons" style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            className="btn-decline"
                            onClick={() => handleDeclineBooking(req.id)}
                            style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "6px", cursor: "pointer" }}
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            className="btn-accept"
                            onClick={() => handleAcceptBooking(req.id, clientTitle)}
                            style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "6px", cursor: "pointer", background: "#2563eb", color: "#ffffff", border: "none", fontWeight: 600 }}
                          >
                            Accept Booking
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* AI Automated Service Performance Intelligence */}
            <div className="vendor-card-block" style={{ marginTop: "20px" }}>
              <div className="card-block-header">
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={16} color="#2563eb" />
                  <h3 style={{ margin: 0 }}>AI Quality & Role-Calibrated Signal</h3>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", background: "#ecfdf5", padding: "2px 8px", borderRadius: "6px" }}>
                  AI CALIBRATED
                </span>
              </div>

              <div style={{ background: "linear-gradient(135deg, #f8fafc, #eff6ff)", padding: "14px", borderRadius: "10px", border: "1px solid #dbeafe", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Award size={16} color="#2563eb" />
                  <strong style={{ fontSize: "13.5px", color: "#1e3a8a" }}>
                    Performance Status: Top-Rated Partner for {vendorCategories.join(" & ")} 🏆
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#334155", lineHeight: 1.4 }}>
                  Based on <strong>{displayReviews.length} verified reviews</strong> in {city}, your quality score is <strong>98.4%</strong>. Event organizers searching for <strong>{vendorCategories.join(", ")}</strong> receive your listing with top priority.
                </p>
              </div>

              <div className="progress-bars-container">
                <div className="progress-bar-row-item">
                  <div className="bar-labels">
                    <span>Quality & Craftsmanship ({vendorCategories[0]})</span>
                    <strong>98%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "98%", background: "#10b981" }} />
                  </div>
                </div>

                <div className="progress-bar-row-item">
                  <div className="bar-labels">
                    <span>Inquiry Response Speed (&lt; 15 mins)</span>
                    <strong>96%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "96%", background: "#2563eb" }} />
                  </div>
                </div>

                <div className="progress-bar-row-item">
                  <div className="bar-labels">
                    <span>Event Contract On-Time Delivery</span>
                    <strong>100%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "100%", background: "#6366f1" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Feedback & Ratings Feed */}
            <div className="vendor-card-block" style={{ marginTop: "20px" }}>
              <div className="card-block-header">
                <h3>Customer Reviews ({displayReviews.length})</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Average {averageRating} ★</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {displayReviews.map((rev) => (
                  <div key={rev.id} style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong style={{ fontSize: "13px", color: "#0f172a" }}>{rev.clientName}</strong>
                        <span style={{ fontSize: "10.5px", background: "#e2e8f0", color: "#475569", padding: "1px 6px", borderRadius: "4px" }}>
                          {rev.eventType} · {rev.category}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill="#f59e0b" stroke="none" />
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#475569", lineHeight: 1.4 }}>
                      "{rev.comment}"
                    </p>
                    <span style={{ fontSize: "10.5px", color: "#94a3b8", display: "block", marginTop: "4px" }}>
                      {rev.eventTitle} · {rev.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel columns */}
          <div className="split-right-pane">
            {/* Upcoming Confirmed Events */}
            <div className="vendor-card-block">
              <div className="card-block-header">
                <h3>Upcoming Confirmed Events</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{activeConfirmedBookings.length} scheduled</span>
              </div>

              <div className="upcoming-events-list">
                {activeConfirmedBookings.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "10px 0" }}>
                    No upcoming confirmed events for {vendorCategories.join(" & ")}. Accept pending inquiries to schedule them.
                  </p>
                ) : (
                  activeConfirmedBookings.map((ev, idx) => (
                    <div key={ev.id || idx} className="event-row-card" style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="event-left-color-badge catering-badge" style={{ width: "4px", height: "36px", borderRadius: "4px", background: "#2563eb" }} />
                      <div className="event-info-desc" style={{ flex: 1 }}>
                        <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
                          {ev.eventName || ev.vendorName || "Celebration Feast"}
                        </strong>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                          {ev.category || vendorCategories[0]} · {ev.city || city} · ₹{Number(ev.amount || ev.vendorPrice || basePrice).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", background: "#ecfdf5", padding: "2px 6px", borderRadius: "4px" }}>
                        Confirmed
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Availability Calendar & Schedule Customizer */}
            <div className="vendor-card-block" style={{ marginTop: "20px" }}>
              <div className="card-block-header">
                <h3>Schedule & Availability</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    style={{ background: "#f1f5f9", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer" }}
                    title="Previous month"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>{monthName}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    style={{ background: "#f1f5f9", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer" }}
                    title="Next month"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: "11.5px", color: "#64748b", margin: "0 0 12px" }}>
                Click any date below to edit your availability status or add event notes.
              </p>

              {/* Grid calendar */}
              <div className="calendar-grid-container">
                <div className="calendar-week-days" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 700, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="calendar-days-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                  {calendarDays.map((d) => {
                    if (d.empty) {
                      return <div key={d.key} style={{ height: "34px" }} />;
                    }
                    const isBooked = d.status === "booked";
                    const isBlocked = d.status === "blocked";
                    const isTentative = d.status === "tentative";

                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => {
                          if (d.dateKey) {
                            setSelectedDateKey(d.dateKey);
                            setDateEditStatus((d.status as any) || "open");
                            setDateEditNote(d.note || "");
                          }
                        }}
                        style={{
                          height: "34px",
                          borderRadius: "6px",
                          border: selectedDateKey === d.dateKey ? "2px solid #2563eb" : "1px solid #e2e8f0",
                          background: isBooked ? "#fee2e2" : isBlocked ? "#f1f5f9" : isTentative ? "#fef3c7" : "#ffffff",
                          color: isBooked ? "#991b1b" : isBlocked ? "#94a3b8" : isTentative ? "#92400e" : "#0f172a",
                          fontWeight: isBooked ? 700 : 500,
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          transition: "all 0.15s",
                        }}
                        title={d.note || `Date: ${d.dateKey} (${d.status})`}
                      >
                        <span>{d.day}</span>
                        {d.note && (
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: isBooked ? "#ef4444" : "#2563eb", position: "absolute", bottom: "3px" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Edit Popover if a date is selected */}
              {selectedDateKey && (
                <div style={{ marginTop: "14px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1.5px solid #3b82f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "12.5px", color: "#1e3a8a" }}>
                      Edit Schedule for {selectedDateKey}
                    </strong>
                    <button type="button" onClick={() => setSelectedDateKey(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                      <X size={14} color="#64748b" />
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setDateEditStatus("open")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        border: dateEditStatus === "open" ? "2px solid #10b981" : "1px solid #cbd5e1",
                        background: dateEditStatus === "open" ? "#ecfdf5" : "#ffffff",
                        color: dateEditStatus === "open" ? "#065f46" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      🟢 Open / Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateEditStatus("booked")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        border: dateEditStatus === "booked" ? "2px solid #ef4444" : "1px solid #cbd5e1",
                        background: dateEditStatus === "booked" ? "#fee2e2" : "#ffffff",
                        color: dateEditStatus === "booked" ? "#991b1b" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      🔴 Booked / Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateEditStatus("tentative")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        border: dateEditStatus === "tentative" ? "2px solid #f59e0b" : "1px solid #cbd5e1",
                        background: dateEditStatus === "tentative" ? "#fef3c7" : "#ffffff",
                        color: dateEditStatus === "tentative" ? "#92400e" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      🟡 Inquiry Hold
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateEditStatus("blocked")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        border: dateEditStatus === "blocked" ? "2px solid #64748b" : "1px solid #cbd5e1",
                        background: dateEditStatus === "blocked" ? "#f1f5f9" : "#ffffff",
                        color: dateEditStatus === "blocked" ? "#334155" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      ⚪ Off-Duty / Blocked
                    </button>
                  </div>

                  <input
                    type="text"
                    value={dateEditNote}
                    onChange={(e) => setDateEditNote(e.target.value)}
                    placeholder="Event note or client title (optional)"
                    style={{ width: "100%", padding: "6px 8px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "8px", outline: "none" }}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedDateKey(null)}
                      style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDateConfig}
                      style={{ padding: "4px 12px", fontSize: "11px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
                    >
                      Save Schedule
                    </button>
                  </div>
                </div>
              )}

              {/* Legend markers */}
              <div className="calendar-legends-row" style={{ display: "flex", gap: "12px", marginTop: "12px", fontSize: "11.5px", color: "#64748b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                  <span>Booked Event</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
                  <span>Tentative Hold</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                  <span>Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Business Profile & Multi-Role Modal */}
      {isEditProfileOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "540px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Briefcase size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>Edit Roles & Business Profile</h3>
              </div>
              <button type="button" onClick={() => setIsEditProfileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                  required
                />
              </div>

              {/* Multi-role category selector */}
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  <span>Service Roles ({profileForm.categories.length} selected)</span>
                  <small style={{ color: "#2563eb", fontWeight: 600 }}>Select 1 or more roles</small>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {VENDOR_CATEGORIES.map((c) => {
                    const isSelected = profileForm.categories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleFormCategory(c)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "16px",
                          fontSize: "11.5px",
                          fontWeight: isSelected ? 700 : 500,
                          border: isSelected ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                          background: isSelected ? "#eff6ff" : "#ffffff",
                          color: isSelected ? "#1e40af" : "#475569",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {isSelected && <Check size={11} color="#2563eb" />}
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={profileForm.experienceYears}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Starting Price (₹)
                  </label>
                  <input
                    type="number"
                    value={profileForm.basePrice}
                    onChange={(e) => setProfileForm({ ...profileForm, basePrice: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Primary City / Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Business Contact Phone
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Business Bio / Speciality
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}
                >
                  Save Roles & Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}