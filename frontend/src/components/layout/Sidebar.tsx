import {
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  MessageSquare,
  Store,
  WalletCards,
  FolderOpen,
  Calendar,
  User as UserIcon,
  Sparkles,
  Mail,
  LogOut,
  Camera,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import { clearActiveSession } from "../../services/accountStorage";

interface UserData {
  name?: string;
  role?: "USER" | "VENDOR";
  email?: string;
  avatarUrl?: string;
}

function getStoredUser(): UserData {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Organizer", role: "USER" };
  } catch {
    return { name: "Organizer", role: "USER" };
  }
}

function Sidebar() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserData>(() => getStoredUser());
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name || "Organizer");

  const refreshUser = () => {
    const u = getStoredUser();
    setUser(u);
    setTempName(u.name || "Organizer");
  };

  useEffect(() => {
    refreshUser();
    window.addEventListener("eventos_user_changed", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("eventos_user_changed", refreshUser);
      window.removeEventListener("storage", refreshUser);
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
      alert("Please choose an image under 5MB.");
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

  const handleLogout = () => {
    clearActiveSession(true);
    navigate("/login");
  };

  // Sidebar items based on role
  const organizerNavigation = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Event",
      path: "/my-event",
      icon: CalendarDays,
    },
    {
      label: "Marketplace",
      path: "/marketplace",
      icon: Store,
    },
    {
      label: "Bookings",
      path: "/bookings",
      icon: CheckSquare,
    },
    {
      label: "AI Assistant",
      path: "/ai-assistant",
      icon: Sparkles,
    },
    {
      label: "Invitations & E-Cards",
      path: "/invitations",
      icon: Mail,
    },
    {
      label: "Budget & Tasks",
      path: "/budget-tasks",
      icon: WalletCards,
    },
  ];

  const vendorNavigation = [
    {
      label: "Dashboard",
      path: "/vendor-dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Services",
      path: "/services",
      icon: Store,
    },
    {
      label: "Portfolio",
      path: "/portfolio",
      icon: FolderOpen,
    },
    {
      label: "Bookings",
      path: "/vendor-bookings",
      icon: CheckSquare,
    },
    {
      label: "Availability",
      path: "/vendor-availability",
      icon: Calendar,
    },
    {
      label: "Messages",
      path: "/vendor-messages",
      icon: MessageSquare,
    },
    {
      label: "Profile",
      path: "/vendor-profile",
      icon: UserIcon,
    },
  ];

  const navigation = user.role === "VENDOR" ? vendorNavigation : organizerNavigation;

  return (
    <aside className="sidebar">
      {/* Hidden File Input for Device Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {/* Brand Header */}
      <div className="sidebar-brand">
        <Logo variant="light" size="md" />
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Card (Pinned at the Bottom) */}
      <div className="profile-card">
        {/* Clickable Avatar with Camera Edit Overlay */}
        <div
          className="avatar"
          onClick={() => fileInputRef.current?.click()}
          style={{
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            border: "1.5px solid rgba(255, 255, 255, 0.4)",
          }}
          title="Click to change profile picture from your device"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || "User"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            (user.name || "U").charAt(0).toUpperCase()
          )}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "14px",
              background: "rgba(0, 0, 0, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <Camera size={9} />
          </div>
        </div>

        <div className="profile-info-text" style={{ flex: 1, minWidth: 0 }}>
          {isEditingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "3px 6px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  border: "1px solid #38bdf8",
                  background: "rgba(0, 0, 0, 0.4)",
                  color: "#ffffff",
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
                  border: "none",
                  color: "#fff",
                  borderRadius: "4px",
                  padding: "3px 5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Save name"
              >
                <Check size={11} />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#cbd5e1",
                  borderRadius: "4px",
                  padding: "3px 5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Cancel"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <strong
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name || "User"}
              </strong>
              <button
                type="button"
                onClick={() => {
                  setTempName(user.name || "User");
                  setIsEditingName(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#38bdf8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.4)";
                }}
                title="Edit username"
              >
                <Edit3 size={11} />
              </button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
              }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "11px", fontWeight: 500 }}>
              {user.role === "VENDOR" ? "Verified Vendor" : "Event Organizer"}
            </span>
          </div>
        </div>

        {/* Quick Log Out Action */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255, 255, 255, 0.5)",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#f87171";
            (e.currentTarget as HTMLElement).style.background = "rgba(239, 68, 68, 0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.5)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
          title="Sign out of EventOS"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;