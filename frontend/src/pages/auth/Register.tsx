import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Diamond,
  Heart,
  Loader2,
  Sparkles,
  Store,
  MapPin,
  Briefcase,
  Phone,
  Tag,
  X,
  FileText,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import api from "../../services/api";
import { saveRegisteredAccount, backupAccountData } from "../../services/accountStorage";

type Role = "organizer" | "vendor";

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  vendorProfile?: {
    businessName: string;
    category: string;
    categories: string[];
    experienceYears: number;
    city: string;
    basePrice: number;
    phone: string;
    bio?: string;
    rating: number;
    reviewsCount: number;
  };
}

interface RegisterResponse {
  token: string;
  user: RegisteredUser;
}

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

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("organizer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Vendor Onboarding Modal Popup State
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Catering & Feasts",
  ]);
  const [experienceYears, setExperienceYears] = useState("8");
  const [city, setCity] = useState("Palakkad");
  const [basePrice, setBasePrice] = useState("45000");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Providing authentic culinary feasts, grand stage decors, and flawless event services.");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleInitialSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      setError(
        role === "vendor"
          ? "Please enter your business or brand name."
          : "Please enter your full name."
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (role === "vendor") {
      // Rise vendor onboarding popup modal
      setShowVendorModal(true);
    } else {
      // Direct registration for organizer
      completeRegistration();
    }
  };

  const completeRegistration = async () => {
    try {
      setLoading(true);

      const vendorData =
        role === "vendor"
          ? {
              businessName: name.trim(),
              category: selectedCategories.join(" & "),
              categories: selectedCategories,
              experienceYears: Number(experienceYears) || 5,
              city: city.trim() || "Palakkad",
              basePrice: Number(basePrice) || 35000,
              phone: phone.trim() || "+91 98765 43210",
              bio: bio.trim(),
              rating: 4.9,
              reviewsCount: 12,
            }
          : undefined;

      let registeredUser: any = null;
      let token = `token-${Date.now()}`;

      try {
        const response = await api.post<RegisterResponse>("/auth/register", {
          name: name.trim(),
          email: email.trim(),
          password,
          role: role === "vendor" ? "VENDOR" : "USER",
          phone: role === "vendor" ? phone : undefined,
        });
        if (response.data) {
          token = response.data.token;
          registeredUser = response.data.user;
        }
      } catch {
        // Offline / mock fallback
      }

      const finalUser = {
        id: registeredUser?.id || `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: (role === "vendor" ? "VENDOR" : "USER") as "USER" | "VENDOR",
        phone: role === "vendor" ? phone : undefined,
        vendorProfile: vendorData,
      };

      // Save into registered accounts registry for exact sign-in recovery
      saveRegisteredAccount({
        email: email.trim(),
        name: name.trim(),
        password,
        role: role === "vendor" ? "VENDOR" : "USER",
        phone: role === "vendor" ? phone : undefined,
        vendorProfile: vendorData,
      });

      // Clear old session data so new registered user starts with 0 events
      localStorage.removeItem("eventos_event");
      localStorage.removeItem("eventos_events");
      localStorage.removeItem("eventos_active_event_id");
      localStorage.removeItem("eventos_bookings");
      localStorage.removeItem("eventos_chat_threads");

      localStorage.setItem("eventos_token", token);
      localStorage.setItem("eventos_user", JSON.stringify(finalUser));
      backupAccountData(finalUser);

      window.dispatchEvent(new CustomEvent("eventos_user_changed"));
      window.dispatchEvent(new CustomEvent("eventos_event_changed"));

      navigate(role === "vendor" ? "/vendor-dashboard" : "/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error("Registration failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to create your account. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      setShowVendorModal(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-glow glow-one" />
      <div className="register-glow glow-two" />

      <div className="register-card" style={{ maxWidth: "480px" }}>
        {/* Brand */}
        <div className="register-brand">
          <div className="brand-icon">
            <Sparkles size={17} />
          </div>
          <span>EventOS</span>
          <small>AI</small>
        </div>

        {/* Heading */}
        <div className="register-heading">
          <p className="eyebrow dark">GET STARTED</p>
          <h1>Create your account</h1>
          <p>
            {role === "vendor"
              ? "List your services, receive role-filtered bookings, and manage contracts."
              : "Tell us how you'll use EventOS AI to make every celebration unforgettable."}
          </p>
        </div>

        {/* Role Selection */}
        <div className="role-selection">
          <button
            type="button"
            className={role === "organizer" ? "role-card active" : "role-card"}
            onClick={() => setRole("organizer")}
          >
            <div className="role-icon">
              <Heart size={19} />
            </div>
            <div className="role-content">
              <strong>Event Organizer</strong>
              <span>Plan and manage your celebrations.</span>
            </div>
            {role === "organizer" && (
              <div className="role-check">
                <Check size={13} />
              </div>
            )}
          </button>

          <button
            type="button"
            className={role === "vendor" ? "role-card active" : "role-card"}
            onClick={() => setRole("vendor")}
          >
            <div className="role-icon">
              <Diamond size={19} />
            </div>
            <div className="role-content">
              <strong>Vendor Partner</strong>
              <span>Receive bookings and showcase services.</span>
            </div>
            {role === "vendor" && (
              <div className="role-check">
                <Check size={13} />
              </div>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="register-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* Basic Form */}
        <form className="register-form" onSubmit={handleInitialSubmit}>
          <div className="form-field">
            <label htmlFor="name">
              {role === "vendor" ? "Business / Brand Name" : "Full Name"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                role === "vendor"
                  ? "e.g. Sri Balaji Catering, Royal Mandap Decors"
                  : "Your full name"
              }
              autoComplete="name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <small>Minimum 6 characters</small>
          </div>

          <button className="register-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {role === "vendor"
                    ? "Continue to Service Setup"
                    : "Create account"}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      {/* ─── VENDOR ONBOARDING POPUP MODAL ─── */}
      {showVendorModal && (
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
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "26px",
              maxWidth: "540px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "18px",
                paddingBottom: "14px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  <Sparkles size={13} /> VENDOR SERVICE ONBOARDING
                </div>
                <h2 style={{ fontSize: "19px", margin: 0, color: "#0f172a" }}>
                  Complete Your Business Profile
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12.5px",
                    color: "#64748b",
                  }}
                >
                  Enter your service specialities, experience, and pricing for{" "}
                  <strong>{name || "your brand"}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowVendorModal(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                completeRegistration();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {/* Multi-role category selector */}
              <div>
                <label
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Store size={13} color="#2563eb" /> Select Service Roles (
                    {selectedCategories.length} selected)
                  </span>
                  <small style={{ color: "#2563eb", fontWeight: 600 }}>
                    Select 1 or more roles
                  </small>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {VENDOR_CATEGORIES.map((c) => {
                    const isSelected = selectedCategories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCategory(c)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: isSelected ? 700 : 500,
                          border: isSelected
                            ? "1.5px solid #2563eb"
                            : "1px solid #cbd5e1",
                          background: isSelected ? "#eff6ff" : "#ffffff",
                          color: isSelected ? "#1e40af" : "#475569",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s",
                        }}
                      >
                        {isSelected && <Check size={12} color="#2563eb" />}
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience and City */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: "4px",
                    }}
                  >
                    <Briefcase size={13} color="#2563eb" /> Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 8"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: "4px",
                    }}
                  >
                    <MapPin size={13} color="#2563eb" /> Operating City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Palakkad, Chennai"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Base Price and Phone */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: "4px",
                    }}
                  >
                    <Tag size={13} color="#2563eb" /> Starting Package (₹)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="e.g. 45000"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: "4px",
                    }}
                  >
                    <Phone size={13} color="#2563eb" /> Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "4px",
                  }}
                >
                  <FileText size={13} color="#2563eb" /> Business Bio & Highlights
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Short description of your services and specialties..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowVendorModal(false)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "9px 24px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="spin" size={16} />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Vendor Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
