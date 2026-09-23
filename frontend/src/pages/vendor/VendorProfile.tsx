import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Layers,
  Save,
  Eye,
  Plus,
  X,
  CreditCard,
  FileCheck,
  Star,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { updateRegisteredAccount } from "../../services/accountStorage";

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "USER" | "VENDOR";
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  vendorProfile?: {
    businessName?: string;
    category?: string;
    categories?: string[];
    experienceYears?: number | string;
    city?: string;
    basePrice?: number;
    phone?: string;
    bio?: string;
    rating?: number;
    reviewCount?: number;
    operatingRadius?: string;
    gstin?: string;
    fssaiLicense?: string;
    bankName?: string;
    accountNo?: string;
    ifscCode?: string;
    upiId?: string;
    instagram?: string;
    website?: string;
    specialties?: string[];
    teamSize?: number | string;
  };
}

const AVAILABLE_CATEGORIES = [
  "Catering & Feasts",
  "Stage & Mandap Decorators",
  "Photography & Cinematography",
  "Bridal Makeup & Mehendi",
  "DJ, Music & Sound",
  "Traditional Priests & Purohits",
  "Transportation & Luxury Cars",
  "Floral & Welcome Decor",
];

const PRESET_COVERS = [
  {
    name: "Royal Heritage Mandap",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Traditional Sadhya Feast",
    url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Golden Amber Chandelier",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Sunset Beach Celebration",
    url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=1200&auto=format&fit=crop&q=80",
  },
];

function getStoredUser(): StoredUser {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Sri Balaji Catering & Decor", role: "VENDOR" };
  } catch {
    return { name: "Sri Balaji Catering & Decor", role: "VENDOR" };
  }
}

export default function VendorProfile() {
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const vp = user.vendorProfile || {};

  // Form Fields
  const [businessName, setBusinessName] = useState(vp.businessName || user.name || "Sri Balaji Catering & Decor");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (vp.categories && vp.categories.length > 0) return vp.categories;
    if (vp.category) return [vp.category];
    return ["Catering & Feasts", "Stage & Mandap Decorators"];
  });
  const [experienceYears, setExperienceYears] = useState(String(vp.experienceYears || "12"));
  const [city, setCity] = useState(vp.city || "Palakkad, Kerala");
  const [operatingRadius, setOperatingRadius] = useState(vp.operatingRadius || "All Kerala & Western Tamil Nadu (150 km)");
  const [basePrice, setBasePrice] = useState(String(vp.basePrice || "145000"));
  const [teamSize, setTeamSize] = useState(String(vp.teamSize || "35"));
  const [phone, setPhone] = useState(vp.phone || user.phone || "+91 98450 12345");
  const [email, setEmail] = useState(user.email || "balaji.events@gmail.com");
  const [instagram, setInstagram] = useState(vp.instagram || "@sribalaji_caterers");
  const [website, setWebsite] = useState(vp.website || "https://sribalajievents.in");
  const [bio, setBio] = useState(
    vp.bio ||
      "Pioneering traditional wedding celebrations with royal 24-dish Sadhyas, artisan lotus mandap structures, and heritage South Indian hospitality for over a decade. Trusted by 450+ families."
  );

  // Compliance & Banking
  const [gstin, setGstin] = useState(vp.gstin || "32AAACB1234F1Z8");
  const [fssaiLicense, setFssaiLicense] = useState(vp.fssaiLicense || "11322007000456");
  const [bankName, setBankName] = useState(vp.bankName || "State Bank of India (Palakkad Main Branch)");
  const [accountNo, setAccountNo] = useState(vp.accountNo || "409823901928");
  const [ifscCode, setIfscCode] = useState(vp.ifscCode || "SBIN0000892");
  const [upiId, setUpiId] = useState(vp.upiId || "sribalajievents@sbi");

  // Specialties Tags
  const [specialties, setSpecialties] = useState<string[]>(() => {
    if (vp.specialties && vp.specialties.length > 0) return vp.specialties;
    return ["24-Dish Royal Sadhya", "40ft Lotus Mandap", "Payasam Trio Buffet", "Uniformed Banana Leaf Service", "Live Mocktail Counter"];
  });
  const [newSpecialty, setNewSpecialty] = useState("");

  // Avatar & Cover
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [coverUrl, setCoverUrl] = useState(
    user.coverUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80"
  );

  // UI States
  const [previewMode, setPreviewMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCoverPresets, setShowCoverPresets] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUserChange = () => {
      const u = getStoredUser();
      setUser(u);
    };
    window.addEventListener("eventos_user_changed", handleUserChange);
    return () => window.removeEventListener("eventos_user_changed", handleUserChange);
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCoverUrl(base64);
      setShowCoverPresets(false);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        alert("Vendor must have at least one active category role.");
        return;
      }
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    const s = newSpecialty.trim();
    if (!s || specialties.includes(s)) return;
    setSpecialties([...specialties, s]);
    setNewSpecialty("");
  };

  const handleRemoveSpecialty = (s: string) => {
    setSpecialties(specialties.filter((item) => item !== s));
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updatedUser: StoredUser = {
      ...user,
      name: businessName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl,
      coverUrl,
      vendorProfile: {
        ...vp,
        businessName: businessName.trim(),
        category: selectedCategories[0] || "Catering & Feasts",
        categories: selectedCategories,
        experienceYears: Number(experienceYears) || 12,
        city: city.trim(),
        operatingRadius: operatingRadius.trim(),
        basePrice: Number(basePrice) || 145000,
        teamSize: Number(teamSize) || 35,
        phone: phone.trim(),
        bio: bio.trim(),
        gstin: gstin.trim(),
        fssaiLicense: fssaiLicense.trim(),
        bankName: bankName.trim(),
        accountNo: accountNo.trim(),
        ifscCode: ifscCode.trim(),
        upiId: upiId.trim(),
        instagram: instagram.trim(),
        website: website.trim(),
        specialties,
        rating: vp.rating || 4.9,
        reviewCount: vp.reviewCount || 48,
      },
    };

    // Save to localStorage
    localStorage.setItem("eventos_user", JSON.stringify(updatedUser));

    // Update registered account registry
    const userIdentifier = user.email || user.name || "";
    if (userIdentifier) {
      updateRegisteredAccount(userIdentifier, {
        name: businessName.trim(),
        avatarUrl,
        vendorProfile: updatedUser.vendorProfile,
      });
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent("eventos_user_changed"));

    setUser(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main vendor-dashboard-layout" style={{ paddingBottom: "60px" }}>
        <Header placeholder="Search settings, credentials, specialties..." />

        {/* Hidden File Inputs */}
        <input type="file" ref={avatarInputRef} accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
        <input type="file" ref={coverInputRef} accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />

        {/* Top Header & Mode Toggle */}
        <div className="vendor-welcome-header">
          <span className="eyebrow dark">VENDOR BRAND & BUSINESS COMMAND CENTER</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0 }}>Vendor Brand & Profile Hub 🏛️✨</h1>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "12px", border: "1px solid #a7f3d0" }}>
                  ⭐ EventOS Verified Premium Partner
                </span>
              </div>
              <p style={{ margin: "4px 0 0" }}>
                Manage your public marketplace presence, service roles, compliance licenses, and banking credentials.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  background: previewMode ? "#1e293b" : "#f1f5f9",
                  color: previewMode ? "#ffffff" : "#334155",
                  fontWeight: 700,
                  fontSize: "13px",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                }}
              >
                <Eye size={15} />
                <span>{previewMode ? "Exit Client Preview" : "Marketplace Preview"}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 20px",
                  borderRadius: "10px",
                  background: saveSuccess ? "#059669" : "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  transition: "all 0.2s",
                }}
              >
                {saveSuccess ? <Check size={16} /> : <Save size={16} />}
                <span>{saveSuccess ? "Changes Saved Live!" : "Save Profile"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            HERO BRAND SHOWCASE CARD
        ═══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            marginBottom: "24px",
          }}
        >
          {/* Cover Photo Area */}
          <div
            style={{
              height: "220px",
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)" }} />

            {/* Cover Action Buttons */}
            <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowCoverPresets(!showCoverPresets)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#0f172a",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Sparkles size={13} color="#2563eb" /> Presets
              </button>

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  background: "rgba(15,23,42,0.8)",
                  backdropFilter: "blur(4px)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}
              >
                <Camera size={13} /> Change Cover
              </button>
            </div>

            {/* Presets Dropdown */}
            {showCoverPresets && (
              <div
                style={{
                  position: "absolute",
                  top: "54px",
                  right: "16px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  zIndex: 20,
                  width: "320px",
                }}
              >
                {PRESET_COVERS.map((cov, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setCoverUrl(cov.url);
                      setShowCoverPresets(false);
                    }}
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: coverUrl === cov.url ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    }}
                  >
                    <img src={cov.url} alt={cov.name} style={{ width: "100%", height: "60px", objectFit: "cover", display: "block" }} />
                    <span style={{ display: "block", padding: "4px", fontSize: "11px", fontWeight: 600, color: "#334155", textAlign: "center", background: "#f8fafc" }}>
                      {cov.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Identity Bar */}
          <div style={{ padding: "0 24px 24px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginTop: "-50px" }}>
              {/* Avatar & Main Info */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "18px" }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: avatarUrl ? `url(${avatarUrl})` : "linear-gradient(135deg, #1e3a8a, #2563eb)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "4px solid #ffffff",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "36px",
                      fontWeight: 800,
                    }}
                  >
                    {!avatarUrl && businessName.slice(0, 1).toUpperCase()}
                  </div>

                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "#2563eb",
                      color: "#ffffff",
                      border: "2.5px solid #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                    title="Upload Logo / Photo"
                  >
                    <Camera size={13} />
                  </button>
                </div>

                <div style={{ paddingBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a", fontWeight: 800 }}>
                      {businessName}
                    </h2>
                    <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", fontSize: "13px", color: "#64748b", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} color="#2563eb" /> {city}
                    </span>
                    <span>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} color="#2563eb" /> {experienceYears} Years Heritage
                    </span>
                    <span>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#b45309", fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" /> {vp.rating || "4.9"} ({vp.reviewCount || "48"} Client Reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Badges */}
              <div style={{ display: "flex", gap: "12px", paddingBottom: "6px" }}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 16px", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block" }}>Starting Base Price</span>
                  <strong style={{ fontSize: "16px", color: "#2563eb" }}>₹{Number(basePrice).toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 16px", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block" }}>Master Crew Scale</span>
                  <strong style={{ fontSize: "16px", color: "#0f172a" }}>{teamSize} Members</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            MARKETPLACE CLIENT LIVE PREVIEW CARD (If previewMode is ON)
        ═══════════════════════════════════════════════════════════════ */}
        {previewMode && (
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              borderRadius: "16px",
              padding: "20px 24px",
              color: "#ffffff",
              marginBottom: "24px",
              border: "1px solid #334155",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                👁️ LIVE COUPLE MARKETPLACE VIEW
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                This is how wedding organizers and couples see your storefront
              </span>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "14px", padding: "20px", color: "#0f172a", display: "grid", gridTemplateColumns: "240px 1fr auto", gap: "20px", alignItems: "center" }}>
              <img src={coverUrl} alt="Cover" style={{ width: "100%", height: "140px", borderRadius: "10px", objectFit: "cover" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>{businessName}</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "8px" }}>
                    ⭐ Verified Partner
                  </span>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#475569", lineHeight: 1.4 }}>
                  {bio}
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {selectedCategories.map((c, i) => (
                    <span key={i} style={{ fontSize: "11px", fontWeight: 700, background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: "6px" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "20px", textAlign: "right" }}>
                <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Starting from</span>
                <strong style={{ fontSize: "20px", color: "#2563eb", display: "block", marginBottom: "8px" }}>
                  ₹{Number(basePrice).toLocaleString("en-IN")}
                </strong>
                <button
                  type="button"
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, fontSize: "12px", cursor: "default" }}
                >
                  Book Inquiries
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            MAIN EDITABLE PROFILE GRIDS
        ═══════════════════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* ─── LEFT COLUMN: CORE BUSINESS & SERVICE ROLES ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Business Identity */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <Building2 size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Business Profile & Identity</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Registered Business / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Primary Operating Base / City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Base Starting Package (₹)
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Master Crew Scale (Persons)
                    </label>
                    <input
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Service Reach & Operating Radius
                  </label>
                  <input
                    type="text"
                    value={operatingRadius}
                    onChange={(e) => setOperatingRadius(e.target.value)}
                    placeholder="e.g. All Kerala, Coimbatore, Madurai (Within 200 km)"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Brand Story & Heritage Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", lineHeight: 1.45 }}
                  />
                </div>
              </div>
            </div>

            {/* Multi-Role Categories */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Layers size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Active Category Roles</h3>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b" }}>
                Select all categories where your business provides certified services. Inquiries will be matched accordingly.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {AVAILABLE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: isSelected ? 700 : 500,
                        border: isSelected ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                        background: isSelected ? "#eff6ff" : "#ffffff",
                        color: isSelected ? "#1d4ed8" : "#475569",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.15s",
                      }}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Signature Specialties */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Sparkles size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Signature Specialties & USPs</h3>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b" }}>
                Highlight specific highlights that set your services apart (*e.g., 24-dish Sadhya, 3D mandap render*).
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {specialties.map((spec, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      borderRadius: "16px",
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(spec)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#94a3b8" }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSpecialty} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Add a signature specialty..."
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  style={{ flex: 1, padding: "7px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                />
                <button
                  type="submit"
                  style={{ padding: "7px 14px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                >
                  <Plus size={14} /> Add
                </button>
              </form>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: CREDENTIALS, BANKING & CONTACTS ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Contact & Social Handles */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <Phone size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Contact & Digital Presence</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Primary Business Hotline
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Official Business Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Instagram Portfolio Handle
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@yourhandle"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Official Website / Portfolio URL
                    </label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance & Tax Credentials */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <FileCheck size={18} color="#059669" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Compliance & Tax Dossier</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>GSTIN Tax Registration</label>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#059669" }}>✓ Active Verified</span>
                  </div>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>FSSAI / Food Safety License</label>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#059669" }}>✓ Grade A Kitchen Certified</span>
                  </div>
                  <input
                    type="text"
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>

            {/* Banking & Settlement Details */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <CreditCard size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Client Advance Settlement Account</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Settlement Bank & Branch Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Current Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Official Business UPI ID (Instant QR Payments)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. businessname@upi"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
