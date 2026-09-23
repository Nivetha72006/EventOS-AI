import { useState, useRef, useEffect } from "react";
import {
  Bell,
  LogOut,
  Camera,
  Sliders,
  Search,
  Trash2,
  LogIn,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventSwitcher from "../common/EventSwitcher";
import { clearActiveSession } from "../../services/accountStorage";

interface HeaderProps {
  placeholder?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

interface UserData {
  name?: string;
  role?: "USER" | "VENDOR";
  email?: string;
  avatarUrl?: string;
  vendorProfile?: {
    businessName?: string;
    category?: string;
    categories?: string[];
    city?: string;
    experienceYears?: number | string;
    basePrice?: number;
    phone?: string;
  };
}

interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: "booking" | "quotation" | "system";
}

function getStoredUser(): UserData {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Organizer", role: "USER", email: "" };
  } catch {
    return { name: "Organizer", role: "USER", email: "" };
  }
}

function getReadNotificationIds(): string[] {
  try {
    const stored = localStorage.getItem("eventos_read_notifications");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function saveReadNotificationIds(ids: string[]) {
  try {
    const unique = Array.from(new Set(ids.map(String)));
    localStorage.setItem("eventos_read_notifications", JSON.stringify(unique));
  } catch {}
}

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

function loadDynamicNotifications(userRole: "USER" | "VENDOR" = "USER", user?: UserData): NotificationItem[] {
  const notifs: NotificationItem[] = [];
  const readIds = getReadNotificationIds();

  // 1. VENDOR NOTIFICATIONS (Filtered strictly to vendor's 1 or more roles)
  if (userRole === "VENDOR") {
    const vendorCategories: string[] =
      user?.vendorProfile?.categories && user.vendorProfile.categories.length > 0
        ? user.vendorProfile.categories
        : user?.vendorProfile?.category
        ? [user.vendorProfile.category]
        : ["Catering & Feasts"];

    const primaryRole = vendorCategories[0] || "Service";

    try {
      const storedBookings = localStorage.getItem("eventos_bookings");
      if (storedBookings) {
        const list = JSON.parse(storedBookings);
        if (Array.isArray(list) && list.length > 0) {
          // Filter to only bookings matching this vendor's roles
          const matchingList = list.filter((b: any) =>
            matchesVendorRole(b.category || b.vendorName, vendorCategories)
          );

          matchingList.forEach((b: any, idx: number) => {
            const rawId = b.id ? String(b.id) : `b_${idx}_${(b.vendorName || "vendor").toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
            const notifId = `v_notif_${rawId}`;
            const isRead = readIds.includes(notifId) || readIds.includes(rawId) || (b.id && readIds.includes(String(b.id)));

            if (b.status === "completed") {
              notifs.push({
                id: notifId,
                title: `Confirmed Contract: ${b.category || primaryRole}`,
                message: `Booking for "${b.eventName || "Celebration"}" (${b.category || primaryRole}) is confirmed for ₹${(b.amount || b.vendorPrice || 45000).toLocaleString("en-IN")}. Added to your active schedule.`,
                time: "Active Contract",
                read: isRead,
                type: "booking",
              });
            } else if (b.status === "active") {
              notifs.push({
                id: notifId,
                title: `Active Reservation: ${b.category || primaryRole}`,
                message: `Client confirmed reservation for "${b.eventName || "Celebration"}" in ${b.city || "your city"}.`,
                time: "Confirmed",
                read: isRead,
                type: "booking",
              });
            } else {
              notifs.push({
                id: notifId,
                title: `New Inquiry (${b.category || primaryRole})`,
                message: `"${b.eventName || "Ram Weds Seetha"}" requested ${b.category || primaryRole} with a ₹${(b.amount || b.vendorPrice || 45000).toLocaleString("en-IN")} contract. Review and accept in Dashboard.`,
                time: "Awaiting Action",
                read: isRead,
                type: "quotation",
              });
            }
          });
        }
      }
    } catch {}

    // Vendor Role-Specific Review Notification
    const revCategoryText = vendorCategories.some((c) => c.toLowerCase().includes("cater"))
      ? "authentic sadhya feast and catering"
      : vendorCategories.some((c) => c.toLowerCase().includes("decor"))
      ? "royal mandap floral decor and lighting"
      : vendorCategories.some((c) => c.toLowerCase().includes("photo"))
      ? "candid photography and cinematic coverage"
      : `${primaryRole} arrangements`;

    const revNotifId = `v_rev_${primaryRole.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    notifs.push({
      id: revNotifId,
      title: `5-Star Review (${primaryRole})`,
      message: `Ram & Seetha left a 5★ review: "Exceptional ${revCategoryText}! All 500 guests were delighted with the professionalism."`,
      time: "Recent Review",
      read: readIds.includes(revNotifId),
      type: "booking",
    });

    // Vendor Role-Specific AI Advisory Notification
    const aiNotifId = `v_ai_demand_${vendorCategories.map((c) => c.slice(0, 3)).join("_").toLowerCase()}`;
    notifs.push({
      id: aiNotifId,
      title: `AI Demand Alert: ${vendorCategories.join(" & ")}`,
      message: `Peak celebration demand detected for ${vendorCategories.join(" and ")} in ${user?.vendorProfile?.city || "your region"}. Keep your calendar availability updated.`,
      time: "AI Advisor",
      read: readIds.includes(aiNotifId),
      type: "system",
    });

    return notifs;
  }

  // 2. ORGANIZER NOTIFICATIONS
  try {
    const storedBookings = localStorage.getItem("eventos_bookings");
    if (storedBookings) {
      const list = JSON.parse(storedBookings);
      if (Array.isArray(list) && list.length > 0) {
        list.forEach((b: any, idx: number) => {
          const rawId = b.id ? String(b.id) : `b_${idx}_${(b.vendorName || "vendor").toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
          const notifId = `booking_${rawId}`;
          const legacyNotifId = `b-${b.status || "item"}-${b.id || idx}`;
          const isRead =
            readIds.includes(notifId) ||
            readIds.includes(rawId) ||
            readIds.includes(legacyNotifId) ||
            (b.id && readIds.includes(String(b.id)));

          if (b.status === "completed") {
            notifs.push({
              id: notifId,
              title: "Booking Finalized & Contract Active",
              message: `${b.vendorName} (${b.category || "Vendor"}) contract is confirmed for ₹${(b.amount || b.vendorPrice || 0).toLocaleString("en-IN")}.`,
              time: "Active Contract",
              read: isRead,
              type: "booking",
            });
          } else if (b.status === "active") {
            notifs.push({
              id: notifId,
              title: "Vendor Accepted Booking",
              message: `${b.vendorName} accepted your booking request for ${b.eventName || "your celebration"}.`,
              time: "Confirmed",
              read: isRead,
              type: "booking",
            });
          } else {
            notifs.push({
              id: notifId,
              title: "Quotation Received",
              message: `${b.vendorName} submitted an offer of ₹${(b.amount || b.vendorPrice || 0).toLocaleString("en-IN")}. AI suggested offer: ₹${(b.aiOffer || Math.round((b.amount || 100000) * 0.85)).toLocaleString("en-IN")}.`,
              time: "Awaiting Action",
              read: isRead,
              type: "quotation",
            });
          }
        });
      }
    }
  } catch {}

  // Check active event
  try {
    const storedEvent = localStorage.getItem("eventos_event");
    if (storedEvent) {
      const evt = JSON.parse(storedEvent);
      if (evt && evt.title) {
        const evtNotifId = `sys_event_${evt.id || "main"}`;
        const legacyEvtId = `sys-event-${evt.id || "active"}`;
        const isRead =
          readIds.includes(evtNotifId) ||
          readIds.includes(legacyEvtId) ||
          readIds.includes("sys-event-active") ||
          readIds.includes("sys_event_main");

        notifs.push({
          id: evtNotifId,
          title: `Planning: ${evt.title}`,
          message: `Active celebration set for ${evt.city || "your city"}. Keep your guest count (${evt.guestCount || 350}) and budget updated in Budget & Tasks.`,
          time: "EventOS",
          read: isRead,
          type: "system",
        });
      }
    }
  } catch {}

  // Fallback defaults if no bookings/events
  if (notifs.length === 0) {
    notifs.push(
      {
        id: "sys_welcome",
        title: "Welcome to EventOS AI",
        message: "Explore the Marketplace to discover and book verified caterers, decorators, and photographers for your celebration.",
        time: "Just now",
        read: readIds.includes("sys_welcome") || readIds.includes("sys-welcome"),
        type: "system",
      },
      {
        id: "sys_ai_tip",
        title: "AI Negotiation Engine",
        message: "Use the Bookings tab to let AI negotiate optimal quotations with verified vendors.",
        time: "Tip",
        read: readIds.includes("sys_ai_tip") || readIds.includes("sys-ai-tip"),
        type: "system",
      }
    );
  }

  return notifs;
}

export default function Header({
  placeholder = "Search...",
  showSearch = false,
  onSearch,
}: HeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [user, setUser] = useState<UserData>(() => getStoredUser());

  // Inline username editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name || "Organizer");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadDynamicNotifications(user.role, user)
  );

  const refreshUser = () => {
    const updated = getStoredUser();
    setUser(updated);
    setTempName(updated.name || "Organizer");
    setNotifications(loadDynamicNotifications(updated.role, updated));
  };

  const refreshNotifications = () => {
    const u = getStoredUser();
    setNotifications(loadDynamicNotifications(u.role, u));
  };

  useEffect(() => {
    refreshUser();
    refreshNotifications();

    window.addEventListener("eventos_user_changed", refreshUser);
    window.addEventListener("eventos_bookings_changed", refreshNotifications);
    window.addEventListener("eventos_event_changed", refreshNotifications);
    window.addEventListener("storage", () => {
      refreshUser();
      refreshNotifications();
    });

    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setIsEditingName(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("eventos_user_changed", refreshUser);
      window.removeEventListener("eventos_bookings_changed", refreshNotifications);
      window.removeEventListener("eventos_event_changed", refreshNotifications);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (!trimmed) return;
    const updated = { ...user, name: trimmed };
    setUser(updated);
    localStorage.setItem("eventos_user", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("eventos_user_changed"));
    setIsEditingName(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const updated = { ...user, avatarUrl: base64 };
      setUser(updated);
      localStorage.setItem("eventos_user", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("eventos_user_changed"));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    const updated: UserData = { ...user };
    delete updated.avatarUrl;
    setUser(updated);
    localStorage.setItem("eventos_user", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("eventos_user_changed"));
    setShowProfileMenu(false);
  };

  const handleSignOut = () => {
    clearActiveSession(true);
    navigate("/login");
  };

  const handleSignInAgain = () => {
    clearActiveSession(true);
    navigate("/login");
  };

  const handleToggleRole = () => {
    const nextRole = user.role === "VENDOR" ? "USER" : "VENDOR";
    const nextName = nextRole === "VENDOR" ? "Sri Balaji Catering" : user.name;
    const nextEmail = nextRole === "VENDOR" ? "catering@sribalaji.com" : user.email;
    const updatedUser = { ...user, role: nextRole, name: nextName, email: nextEmail };
    localStorage.setItem("eventos_user", JSON.stringify(updatedUser));
    setShowProfileMenu(false);
    navigate(nextRole === "VENDOR" ? "/vendor-dashboard" : "/dashboard");
    window.location.reload();
  };

  const handleMarkAsRead = (notifId: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const idStr = String(notifId);
    const readIds = getReadNotificationIds();
    if (!readIds.includes(idStr)) {
      const updated = [...readIds, idStr];
      saveReadNotificationIds(updated);
    }
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === idStr ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => String(n.id));
    saveReadNotificationIds(allIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const displayInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="dashboard-header-bar">
      {/* Hidden File Input for Profile Picture Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {showSearch && (
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
        </div>
      )}

      <div className="header-right-actions">
        {user.role !== "VENDOR" && <EventSwitcher />}

        {/* Notifications Bell */}
        <div className="notification-wrapper" ref={notifRef}>
          <button
            className={`icon-button ${unreadCount > 0 ? "has-unread" : ""}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown" style={{ width: "350px" }}>
              <div className="dropdown-header">
                <h3>Notifications ({notifications.length})</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="mark-all-read"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-body" style={{ maxHeight: "380px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <p className="no-notifications">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${!n.read ? "unread" : ""}`}
                      style={{
                        borderLeft:
                          n.type === "booking"
                            ? "3px solid #16a34a"
                            : n.type === "quotation"
                            ? "3px solid #2563eb"
                            : "3px solid #64748b",
                        position: "relative",
                        padding: "10px 12px",
                        transition: "background 0.2s",
                      }}
                    >
                      <div className="notification-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <strong style={{ fontSize: "13px", color: n.read ? "#64748b" : "#0f172a" }}>
                          {n.title}
                        </strong>
                        <span className="notif-time" style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap" }}>
                          {n.time}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", margin: "4px 0 6px", color: n.read ? "#94a3b8" : "#475569", lineHeight: 1.4 }}>
                        {n.message}
                      </p>

                      {/* Individual Mark as read button / Read badge */}
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                        {!n.read ? (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            style={{
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              color: "#2563eb",
                              borderRadius: "6px",
                              padding: "3px 8px",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "#2563eb";
                              (e.currentTarget as HTMLElement).style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "#eff6ff";
                              (e.currentTarget as HTMLElement).style.color = "#2563eb";
                            }}
                            title="Mark this notification as read"
                          >
                            <Check size={12} />
                            <span>Mark as read</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: "10.5px", color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 500 }}>
                            <Check size={11} color="#94a3b8" />
                            <span>Read</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-menu-wrapper" ref={profileRef}>
          <button
            className="profile-trigger-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar" style={{ overflow: "hidden", position: "relative" }}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "User"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                displayInitial
              )}
            </div>
            <div className="profile-meta-text">
              <strong style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {user.name || "My Account"}
              </strong>
              <span>{user.role === "VENDOR" ? "Vendor" : "Organizer"}</span>
            </div>
            <span className="down-chevron">▼</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu" style={{ minWidth: "260px" }}>
              {/* Profile User Info & Inline Name Edit */}
              <div className="profile-dropdown-info" style={{ padding: "12px 14px" }}>
                {isEditingName ? (
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "4px" }}>
                      EDIT YOUR NAME:
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1.5px solid #2563eb",
                          fontSize: "13px",
                          outline: "none",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSaveName}
                        style={{
                          background: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Save name"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingName(false)}
                        style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                        {user.name || "Organizer"}
                      </strong>
                      <span style={{ fontSize: "11.5px", color: "#64748b", display: "block" }}>
                        {user.email || (user.role === "VENDOR" ? "vendor@business.com" : "organizer@eventos.ai")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTempName(user.name || "Organizer");
                        setIsEditingName(true);
                      }}
                      style={{
                        background: "rgba(37, 99, 235, 0.08)",
                        border: "1px solid rgba(37, 99, 235, 0.2)",
                        color: "#2563eb",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title="Edit Username"
                    >
                      <Edit3 size={12} />
                      <span>Edit Name</span>
                    </button>
                  </div>
                )}
              </div>
              <hr />

              {/* Profile Picture Actions */}
              {user.avatarUrl ? (
                <>
                  <button
                    className="dropdown-action-btn"
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera size={16} />
                    <span>Change Profile Picture</span>
                  </button>
                  <button
                    className="dropdown-action-btn"
                    type="button"
                    onClick={handleRemoveProfilePicture}
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={16} />
                    <span>Remove Profile Picture</span>
                  </button>
                </>
              ) : (
                <button
                  className="dropdown-action-btn"
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    fileInputRef.current?.click();
                  }}
                >
                  <Camera size={16} />
                  <span>Upload Profile Picture</span>
                </button>
              )}

              <button className="dropdown-action-btn" onClick={handleToggleRole}>
                <Sliders size={16} />
                Switch to {user.role === "VENDOR" ? "Organizer View" : "Vendor View"}
              </button>

              <hr />

              {/* Sign Out Action */}
              <button className="dropdown-action-btn sign-out-btn" onClick={handleSignOut}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>

              {/* Sign In Again / Switch Account Option directly under Sign out */}
              <button
                className="dropdown-action-btn"
                onClick={handleSignInAgain}
                style={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  background: "rgba(59, 130, 246, 0.08)",
                  borderRadius: "8px",
                  marginTop: "4px",
                }}
              >
                <LogIn size={16} color="#3b82f6" />
                <span>Sign in with Another Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
