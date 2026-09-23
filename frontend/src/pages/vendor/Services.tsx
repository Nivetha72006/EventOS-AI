import { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Sparkles,
  Users,
  X,
  Check,
  Calculator,
  Share2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export interface ServicePackage {
  id: string;
  title: string;
  category: string;
  tier: "Standard" | "Premium Gold" | "Luxury Platinum";
  price: number;
  priceUnit: "per_plate" | "per_event" | "per_day";
  capacityOrTurnaround: string;
  inclusions: string[];
  description: string;
  isActive: boolean;
  badge?: string;
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
  };
}

function getStoredUser(): StoredUser {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Sri Balaji Catering", role: "VENDOR" };
  } catch {
    return { name: "Sri Balaji Catering", role: "VENDOR" };
  }
}

function deduplicatePackages(list: ServicePackage[]): ServicePackage[] {
  const seen = new Set<string>();
  return list
    .filter((p) => {
      if (!p || !p.title) return false;
      const t = p.title.toLowerCase();
      if (t.includes("(copy)") || t.includes(" - copy") || t.endsWith(" copy")) {
        return false;
      }
      return true;
    })
    .filter((p) => {
      const key = p.title.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getDefaultPackagesForRoles(roles: string[]): ServicePackage[] {
  const pkgs: ServicePackage[] = [];

  const hasCatering = roles.some((r) => r.toLowerCase().includes("cater") || r.toLowerCase().includes("feast"));
  const hasDecor = roles.some((r) => r.toLowerCase().includes("decor") || r.toLowerCase().includes("mandap"));
  const hasPhoto = roles.some((r) => r.toLowerCase().includes("photo") || r.toLowerCase().includes("cinema"));
  const hasMusic = roles.some((r) => r.toLowerCase().includes("music") || r.toLowerCase().includes("sound") || r.toLowerCase().includes("dj"));

  if (hasCatering || pkgs.length === 0) {
    pkgs.push(
      {
        id: "pkg-cat-1",
        title: "Grand Traditional Sadhya Feast",
        category: "Catering & Feasts",
        tier: "Premium Gold",
        price: 480,
        priceUnit: "per_plate",
        capacityOrTurnaround: "150 - 1,500 Pax",
        inclusions: [
          "24 Traditional Kerala/Tamil Sadhya Dishes",
          "3 Artisanal Payasams (Ada Pradhaman, Paal Payasam, Parippu)",
          "Pure Ghee, Pappadams, Kaai Varuthathu, Sharkara Varatti",
          "Eco-Friendly Plantain Leaf Table Setup",
          "Uniformed Traditional Attire Serving Staff",
        ],
        description: "Authentic festival feast prepared by master chefs using pure cold-pressed coconut oil and fresh spices.",
        isActive: true,
        badge: "⭐ Most Popular",
      },
      {
        id: "pkg-cat-2",
        title: "Royal Celebration Buffet & Live Counters",
        category: "Catering & Feasts",
        tier: "Luxury Platinum",
        price: 850,
        priceUnit: "per_plate",
        capacityOrTurnaround: "200 - 2,000 Pax",
        inclusions: [
          "38 Multi-Cuisine Dishes (South Indian, North Indian, Pan-Asian)",
          "Live Chaat, Dosa & Tandoori Food Stations",
          "Exotic Mocktail Welcome Drink Bar",
          "Gourmet Dessert Counter with Live Jalebi & Ice Cream",
          "Luxury Porcelain Dinnerware & Crystal Glassware",
        ],
        description: "Grand reception buffet featuring interactive live culinary stations and international delicacies.",
        isActive: true,
        badge: "👑 Luxury Tier",
      },
      {
        id: "pkg-cat-3",
        title: "Traditional High-Tea & Breakfast Spread",
        category: "Catering & Feasts",
        tier: "Standard",
        price: 290,
        priceUnit: "per_plate",
        capacityOrTurnaround: "100 - 800 Pax",
        inclusions: [
          "Fluffy Button Idlis, Medu Vada, Ghee Pongal",
          "Live Mini Masala Dosa Counter",
          "Filter Kaapi & Masala Chai Dispensers",
          "Fresh Sweet Sajjige & Savory Bisi Bele Bath",
        ],
        description: "Perfect for morning Muhurtham ceremonies, engagements, and auspicious pooja gatherings.",
        isActive: true,
      }
    );
  }

  if (hasDecor) {
    pkgs.push(
      {
        id: "pkg-dec-1",
        title: "Royal Mandap Floral Canopy & Stage Setup",
        category: "Stage & Mandap Decorators",
        tier: "Luxury Platinum",
        price: 135000,
        priceUnit: "per_event",
        capacityOrTurnaround: "Grand Stage (40ft x 20ft)",
        inclusions: [
          "Imported Orchid, Marigold & Jasmine Floral Architecture",
          "Gold Carved Mandap Pillars with Velvet Draping",
          "Warm Ambient Stage Focus Lighting & Chandeliers",
          "Traditional Brass Urulis with Floating Diyas",
          "Bride & Groom Royal Throne Chairs",
        ],
        description: "Breathtaking traditional and contemporary mandap setup crafted for cinematic wedding moments.",
        isActive: true,
        badge: "✨ Signature Mandap",
      },
      {
        id: "pkg-dec-2",
        title: "Vibrant Sangeet & Mehendi Canopy",
        category: "Stage & Mandap Decorators",
        tier: "Premium Gold",
        price: 65000,
        priceUnit: "per_event",
        capacityOrTurnaround: "Medium Stage & Lawn",
        inclusions: [
          "Colorful Rajasthani Drapes & Bohemian Tent Setup",
          "Fairylight Ceiling Canopy & LED Neon Signage",
          "Floral Swing Photo Booth with Custom Nameplates",
          "Low-Seating Diwan Setup with Colorful Cushions",
        ],
        description: "Lively, picture-perfect setup designed for energetic Sangeet dances and fun Mehendi ceremonies.",
        isActive: true,
      }
    );
  }

  if (hasPhoto) {
    pkgs.push({
      id: "pkg-pho-1",
      title: "Cinematic 4K Wedding Story & Drone Teaser",
      category: "Photography & Cinematography",
      tier: "Luxury Platinum",
      price: 85000,
      priceUnit: "per_event",
      capacityOrTurnaround: "Delivered in 10 Days",
      inclusions: [
        "2 Senior Candid Photographers + 2 Cinematic Cinematographers",
        "Aerial 4K Drone Footage of Venue & Procession",
        "3-Minute Cinematic Wedding Highlight Teaser",
        "60-Page Luxury Leather-Bound Wedding Album",
        "Full High-Resolution Online Cloud Gallery",
      ],
      description: "Complete cinematic coverage capturing emotions, candids, and grand celebrations in ultra-high definition.",
      isActive: true,
      badge: "🎥 Top Rated",
    });
  }

  if (hasMusic) {
    pkgs.push({
      id: "pkg-mus-1",
      title: "Grand Concert DJ & Intelligent Lighting",
      category: "Music, DJ & Sound",
      tier: "Premium Gold",
      price: 45000,
      priceUnit: "per_event",
      capacityOrTurnaround: "Full Evening (5 Hours)",
      inclusions: [
        "Professional Celebrity Wedding DJ + MC Anchor",
        "JBL Line Array Concert Sound System",
        "Intelligent Moving Head Stage Lights & Lasers",
        "CO2 Cryo Jets & Heavy Smoke Cloud Machine for Couple Entry",
      ],
      description: "Unstoppable dance floor energy with customized Bollywood, Kollywood, and EDM playlist sets.",
      isActive: true,
    });
  }

  return deduplicatePackages(pkgs);
}

export default function Services() {
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const vp = user.vendorProfile || {};
  const vendorCategories: string[] =
    vp.categories && vp.categories.length > 0
      ? vp.categories
      : vp.category
      ? [vp.category]
      : ["Catering & Feasts"];

  const vendorKey = (user.name || "default_vendor").toLowerCase().replace(/\s+/g, "_");

  const [packages, setPackages] = useState<ServicePackage[]>(() => {
    try {
      const stored = localStorage.getItem(`eventos_vendor_services_${vendorKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deduplicatePackages(parsed);
        }
      }
    } catch {}
    return getDefaultPackagesForRoles(vendorCategories);
  });

  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPkgId, setCopiedPkgId] = useState<string | null>(null);

  // Modal State for Adding/Editing Package
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState(vendorCategories[0] || "Catering & Feasts");
  const [formTier, setFormTier] = useState<"Standard" | "Premium Gold" | "Luxury Platinum">("Premium Gold");
  const [formPrice, setFormPrice] = useState("480");
  const [formPriceUnit, setFormPriceUnit] = useState<"per_plate" | "per_event" | "per_day">("per_plate");
  const [formCapacity, setFormCapacity] = useState("150 - 1,000 Pax");
  const [formInclusions, setFormInclusions] = useState(
    "24 Traditional Dishes\n3 Artisanal Payasams\nPlantain Leaf Setup\nUniformed Serving Crew"
  );
  const [formDescription, setFormDescription] = useState("Grand authentic festival celebration package.");
  const [formBadge, setFormBadge] = useState("");

  // Quotation Estimator State
  const [estPackageId, setEstPackageId] = useState<string>(packages[0]?.id || "");
  const [estGuestCount, setEstGuestCount] = useState<number>(350);
  const [estCopied, setEstCopied] = useState(false);

  useEffect(() => {
    const handleUserChange = () => {
      const u = getStoredUser();
      setUser(u);
    };
    window.addEventListener("eventos_user_changed", handleUserChange);

    // Auto-clean any residual "(Copy)" or duplicates from localStorage
    try {
      const stored = localStorage.getItem(`eventos_vendor_services_${vendorKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const cleaned = deduplicatePackages(parsed);
        setPackages(cleaned);
        localStorage.setItem(`eventos_vendor_services_${vendorKey}`, JSON.stringify(cleaned));
      }
    } catch {}

    return () => window.removeEventListener("eventos_user_changed", handleUserChange);
  }, [vendorKey]);

  const savePackagesToStorage = (updatedList: ServicePackage[]) => {
    const deduped = deduplicatePackages(updatedList);
    setPackages(deduped);
    localStorage.setItem(`eventos_vendor_services_${vendorKey}`, JSON.stringify(deduped));
  };

  const handleOpenAddModal = () => {
    setEditingPackageId(null);
    setFormTitle("");
    setFormCategory(vendorCategories[0] || "Catering & Feasts");
    setFormTier("Premium Gold");
    setFormPrice(formPriceUnit === "per_plate" ? "480" : "65000");
    setFormPriceUnit("per_plate");
    setFormCapacity("200 - 1,000 Pax");
    setFormInclusions("Artisanal Welcome Drinks\nMain Course Feast\nDessert Selection\nSetup & Service Staff");
    setFormDescription("Custom tailored service package designed for grand wedding celebrations.");
    setFormBadge("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: ServicePackage) => {
    setEditingPackageId(pkg.id);
    setFormTitle(pkg.title);
    setFormCategory(pkg.category);
    setFormTier(pkg.tier);
    setFormPrice(String(pkg.price));
    setFormPriceUnit(pkg.priceUnit);
    setFormCapacity(pkg.capacityOrTurnaround);
    setFormInclusions(pkg.inclusions.join("\n"));
    setFormDescription(pkg.description);
    setFormBadge(pkg.badge || "");
    setIsModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const incList = formInclusions
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingPackageId) {
      // Update existing
      const updated = packages.map((p) => {
        if (p.id === editingPackageId) {
          return {
            ...p,
            title: formTitle.trim(),
            category: formCategory,
            tier: formTier,
            price: Number(formPrice) || 0,
            priceUnit: formPriceUnit,
            capacityOrTurnaround: formCapacity.trim(),
            inclusions: incList,
            description: formDescription.trim(),
            badge: formBadge.trim() || undefined,
          };
        }
        return p;
      });
      savePackagesToStorage(updated);
    } else {
      // Create new
      const newPkg: ServicePackage = {
        id: `pkg-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        tier: formTier,
        price: Number(formPrice) || 0,
        priceUnit: formPriceUnit,
        capacityOrTurnaround: formCapacity.trim(),
        inclusions: incList,
        description: formDescription.trim(),
        isActive: true,
        badge: formBadge.trim() || undefined,
      };
      savePackagesToStorage([newPkg, ...packages]);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    const updated = packages.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    savePackagesToStorage(updated);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure you want to remove this service package?")) {
      const updated = packages.filter((p) => p.id !== id);
      savePackagesToStorage(updated);
    }
  };

  // Copy Package details to clipboard
  const handleCopyPackageDetails = (pkg: ServicePackage) => {
    const text = `🎉 *${pkg.title}* (${pkg.tier})
🏷️ *Category*: ${pkg.category}
💰 *Price*: ₹${pkg.price.toLocaleString("en-IN")} (${pkg.priceUnit === "per_plate" ? "per plate" : pkg.priceUnit === "per_day" ? "per day" : "per celebration"})
👥 *Capacity/Turnaround*: ${pkg.capacityOrTurnaround}
📝 *Description*: ${pkg.description}

✨ *Key Inclusions*:
${pkg.inclusions.map((i) => `• ${i}`).join("\n")}

📍 *Location*: ${vp.city || "Palakkad, Kerala"}
📞 *Contact*: ${user.phone || vp.phone || "+91 98765 43210"}`;

    navigator.clipboard.writeText(text);
    setCopiedPkgId(pkg.id);
    setTimeout(() => setCopiedPkgId(null), 2000);
  };

  // AI Suggest Inclusions
  const handleAISuggestInclusions = () => {
    if (formCategory.toLowerCase().includes("cater")) {
      setFormInclusions(
        "Welcome Drink: Royal Tender Coconut Punch & Spiced Buttermilk\nMain Sadhya: 24 Traditional Delicacies (Avial, Olan, Thoran, Kalan, Erissery)\nArtisanal Payasams: Ada Pradhaman & Parippu Payasam\nLive Counter: Hot Golden Jalebis with Rabri\nFull Service: Uniformed Traditional Servers & Eco Plantain Leaves"
      );
    } else if (formCategory.toLowerCase().includes("decor")) {
      setFormInclusions(
        "Grand Floral Mandap with Fresh Lotus & Jasmine Garland Strands\nCurated Warm Amber Chandelier Lighting Grid\nIlluminated Royal Archway Entrance with Brass Deepams\nBride & Groom Maharaja Throne Chairs & Guest Aisle Draping"
      );
    } else if (formCategory.toLowerCase().includes("photo")) {
      setFormInclusions(
        "Dual 4K Full-Frame Cinematic Cameras + Gimbal Stabilizers\nAerial Drone Shoot for Muhurtham & Baraat Procession\nSame-Day 60-Second Social Media Reel\n100-Page Premium Embossed Silk Album + Raw Video Master Drive"
      );
    } else {
      setFormInclusions(
        "Complete Professional Service Execution by Certified Team\nPremium Equipment & High-End Material Handling\nOn-site Dedicated Lead Coordinator\nSatisfaction Guarantee & Prompt Delivery"
      );
    }
  };

  // Filter packages by Category & Search Query (matches title, description, category, inclusions)
  const q = searchQuery.toLowerCase().trim();
  const filteredPackages = packages.filter((p) => {
    const matchCat = filterCategory === "All" || p.category === filterCategory;
    const matchQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.inclusions.some((inc) => inc.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  // Deduplicated packages for Select dropdown
  const uniqueSelectPackages = deduplicatePackages(packages);

  // Calculation for Estimator
  const selectedEstPackage = uniqueSelectPackages.find((p) => p.id === estPackageId) || uniqueSelectPackages[0];
  const estBasePrice = selectedEstPackage
    ? selectedEstPackage.priceUnit === "per_plate"
      ? selectedEstPackage.price * estGuestCount
      : selectedEstPackage.price
    : 0;
  const estTax = Math.round(estBasePrice * (selectedEstPackage?.category.includes("Cater") ? 0.05 : 0.18));
  const estGrandTotal = estBasePrice + estTax;

  const handleCopyEstimate = () => {
    if (!selectedEstPackage) return;
    const quoteText = `🎉 *EVENTOS AI VENDOR QUOTATION*
🏷️ *Provider*: ${user.name || "Vendor Partner"} (${selectedEstPackage.category})
📦 *Package*: ${selectedEstPackage.title} (${selectedEstPackage.tier})
👥 *Guest Estimate*: ${estGuestCount} Guests
💰 *Base Estimate*: ₹${estBasePrice.toLocaleString("en-IN")} (${selectedEstPackage.priceUnit === "per_plate" ? `₹${selectedEstPackage.price}/plate` : "Fixed Package"})
🧾 *GST/Taxes*: ₹${estTax.toLocaleString("en-IN")}
✨ *Total Quotation*: ₹${estGrandTotal.toLocaleString("en-IN")}

📋 *Key Inclusions*:
${selectedEstPackage.inclusions.map((inc) => `• ${inc}`).join("\n")}

📍 *Location*: ${vp.city || "Palakkad, Kerala"}
📞 *Contact*: ${user.phone || vp.phone || "+91 98765 43210"}
_Generated securely via EventOS AI Marketplace._`;

    navigator.clipboard.writeText(quoteText);
    setEstCopied(true);
    setTimeout(() => setEstCopied(false), 2500);
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main vendor-dashboard-layout">
        <Header
          placeholder="Search packages, menus, decor setups..."
          showSearch={true}
          onSearch={setSearchQuery}
        />

        {/* Page Top Header */}
        <div className="vendor-welcome-header">
          <span className="eyebrow dark">SERVICE MANAGEMENT & CATALOG</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1>Service Packages & Menus 🍱✨</h1>
              <p>Configure packages, customize inclusions, and generate instant client quotations.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
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
              <span>Add New Package</span>
            </button>
          </div>
        </div>

        {/* AI Smart Pricing & Benchmark Alert Strip */}
        <section
          style={{
            background: "linear-gradient(135deg, #f0fdf4, #eff6ff)",
            borderRadius: "14px",
            padding: "16px 20px",
            border: "1px solid #bbf7d0",
            marginBottom: "22px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#16a34a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong style={{ fontSize: "14px", color: "#166534" }}>
                AI Service & Pricing Intelligence
              </strong>
              <span style={{ fontSize: "11px", fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: "4px" }}>
                ACTIVE
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#334155" }}>
              Your packages in <strong>{vendorCategories.join(" & ")}</strong> are optimized for{" "}
              <strong>{vp.city || "your region"}</strong>. Packages with detailed inclusions convert <strong>3.4x faster</strong> into confirmed bookings.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: "#1e40af", background: "#dbeafe", padding: "4px 10px", borderRadius: "6px" }}>
              <TrendingUp size={13} /> High Demand Season
            </span>
          </div>
        </section>

        {/* Filter and In-Page Search Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          {/* Category Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["All", ...vendorCategories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: filterCategory === cat ? 700 : 500,
                  border: filterCategory === cat ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                  background: filterCategory === cat ? "#eff6ff" : "#ffffff",
                  color: filterCategory === cat ? "#1d4ed8" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: 600 }}>
            {filteredPackages.length} active service package{filteredPackages.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Main Content Grid: Packages (Left) + Live Quotation Calculator (Right) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: "22px", alignItems: "start" }}>
          {/* Left: Packages List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredPackages.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", background: "#ffffff", borderRadius: "14px", border: "1px dashed #cbd5e1" }}>
                <Store size={36} color="#94a3b8" style={{ margin: "0 auto 10px" }} />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                  {searchQuery ? `No packages matching "${searchQuery}"` : "No packages found"}
                </h3>
                <p style={{ margin: "6px 0 16px", fontSize: "13px", color: "#64748b" }}>
                  {searchQuery
                    ? "Try searching for a different dish name, role, or clear your search."
                    : "Create your first package to showcase your services to event organizers."}
                </p>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{ padding: "8px 18px", borderRadius: "8px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", fontWeight: 600, cursor: "pointer" }}
                  >
                    Clear Search Filter
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    style={{ padding: "8px 18px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
                  >
                    Create Package Now
                  </button>
                )}
              </div>
            ) : (
              filteredPackages.map((pkg) => {
                const isPerPlate = pkg.priceUnit === "per_plate";
                const isCopied = copiedPkgId === pkg.id;
                const tierColor =
                  pkg.tier === "Luxury Platinum"
                    ? "#7e22ce"
                    : pkg.tier === "Premium Gold"
                    ? "#b45309"
                    : "#2563eb";
                const tierBg =
                  pkg.tier === "Luxury Platinum"
                    ? "#f5f3ff"
                    : pkg.tier === "Premium Gold"
                    ? "#fef3c7"
                    : "#eff6ff";

                return (
                  <div
                    key={pkg.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "20px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      opacity: pkg.isActive ? 1 : 0.65,
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              background: tierBg,
                              color: tierColor,
                              padding: "2px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {pkg.tier}
                          </span>
                          <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                            {pkg.category}
                          </span>
                          {pkg.badge && (
                            <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: "6px" }}>
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: "17px", margin: 0, color: "#0f172a", fontWeight: 700 }}>
                          {pkg.title}
                        </h3>
                      </div>

                      {/* Pricing Tag */}
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ fontSize: "19px", color: "#0f172a", fontWeight: 800 }}>
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </strong>
                        <span style={{ display: "block", fontSize: "11.5px", color: "#64748b" }}>
                          {isPerPlate ? "per guest / plate" : pkg.priceUnit === "per_day" ? "per day" : "per celebration"}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px", lineHeight: 1.45 }}>
                      {pkg.description}
                    </p>

                    {/* Inclusions Pill Grid */}
                    <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px", border: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
                        Package Inclusions ({pkg.inclusions.length}):
                      </span>
                      <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12.5px", color: "#334155", display: "flex", flexDirection: "column", gap: "4px" }}>
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Row Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#64748b" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Users size={13} /> {pkg.capacityOrTurnaround}
                        </span>
                        <span className="bullet-dot">·</span>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(pkg.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            background: pkg.isActive ? "#ecfdf5" : "#f1f5f9",
                            color: pkg.isActive ? "#059669" : "#64748b",
                            border: "none",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {pkg.isActive ? "🟢 Active for Booking" : "⚪ Paused"}
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        {/* Copy Package details to clipboard */}
                        <button
                          type="button"
                          onClick={() => handleCopyPackageDetails(pkg)}
                          title="Copy Package Details to Clipboard"
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: isCopied ? "1.5px solid #10b981" : "1px solid #cbd5e1",
                            background: isCopied ? "#ecfdf5" : "#ffffff",
                            color: isCopied ? "#059669" : "#475569",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.15s",
                          }}
                        >
                          {isCopied ? (
                            <>
                              <Check size={13} color="#059669" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(pkg)}
                          title="Edit Package"
                          style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", color: "#2563eb", fontWeight: 600, fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(pkg.id)}
                          title="Delete Package"
                          style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", color: "#dc2626" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Instant Client Quotation Estimator & Share */}
          <div style={{ position: "sticky", top: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calculator size={17} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15.5px", color: "#0f172a" }}>Client Quotation Generator</h3>
                  <span style={{ fontSize: "11.5px", color: "#64748b" }}>Calculate & export instant estimates</span>
                </div>
              </div>

              {/* Deduplicated Package selector */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Select Package ({uniqueSelectPackages.length} available)
                </label>
                <select
                  value={estPackageId}
                  onChange={(e) => setEstPackageId(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#ffffff" }}
                >
                  {uniqueSelectPackages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price.toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest count input */}
              {selectedEstPackage?.priceUnit === "per_plate" && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    <span>Estimated Guest Count</span>
                    <span style={{ color: "#2563eb" }}>{estGuestCount} Guests</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={estGuestCount}
                    onChange={(e) => setEstGuestCount(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#2563eb" }}
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    {[150, 300, 500, 800].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setEstGuestCount(count)}
                        style={{
                          flex: 1,
                          padding: "3px 0",
                          fontSize: "11px",
                          borderRadius: "4px",
                          border: estGuestCount === count ? "1px solid #2563eb" : "1px solid #e2e8f0",
                          background: estGuestCount === count ? "#eff6ff" : "#ffffff",
                          fontWeight: estGuestCount === count ? 700 : 500,
                          cursor: "pointer",
                        }}
                      >
                        {count} pax
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Breakdown Box */}
              <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px", marginBottom: "14px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#475569", marginBottom: "6px" }}>
                  <span>Base Package Cost:</span>
                  <span>₹{estBasePrice.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#475569", marginBottom: "8px" }}>
                  <span>Taxes / GST ({selectedEstPackage?.category.includes("Cater") ? "5%" : "18%"}):</span>
                  <span>₹{estTax.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 800, color: "#0f172a", paddingTop: "8px", borderTop: "1px dashed #cbd5e1" }}>
                  <span>Total Quotation:</span>
                  <span style={{ color: "#16a34a" }}>₹{estGrandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Copy / Share Quote Button */}
              <button
                type="button"
                onClick={handleCopyEstimate}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: estCopied ? "#10b981" : "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                {estCopied ? (
                  <>
                    <Check size={16} />
                    <span>Quotation Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} />
                    <span>Copy Client Quotation</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Tips Card */}
            <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <ShieldCheck size={16} color="#2563eb" />
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>Vendor Best Practice</strong>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.4 }}>
                Keep your standard, gold, and luxury tiers active so organizers with varying celebration budgets can find the perfect match.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── ADD / EDIT SERVICE PACKAGE MODAL ─── */}
      {isModalOpen && (
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
              maxWidth: "540px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Store size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                  {editingPackageId ? "Edit Service Package" : "Create New Service Package"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Package Title / Menu Name
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Grand Traditional Sadhya Feast"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Service Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
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
                    Package Tier
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium Gold">Premium Gold</option>
                    <option value="Luxury Platinum">Luxury Platinum</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 480"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Price Unit
                  </label>
                  <select
                    value={formPriceUnit}
                    onChange={(e) => setFormPriceUnit(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="per_plate">Per Plate / Guest</option>
                    <option value="per_event">Per Event Package</option>
                    <option value="per_day">Per Day</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Capacity / Turnaround
                  </label>
                  <input
                    type="text"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    placeholder="e.g. 150 - 1,200 Pax"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Highlight Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. ⭐ Most Popular"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                    Package Inclusions (One per line)
                  </label>
                  <button
                    type="button"
                    onClick={handleAISuggestInclusions}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      border: "none",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Sparkles size={12} /> Suggest with AI
                  </button>
                </div>
                <textarea
                  value={formInclusions}
                  onChange={(e) => setFormInclusions(e.target.value)}
                  rows={4}
                  placeholder="Enter inclusions, one per line..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Package Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Short description of this package..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 22px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}
                >
                  {editingPackageId ? "Save Changes" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
