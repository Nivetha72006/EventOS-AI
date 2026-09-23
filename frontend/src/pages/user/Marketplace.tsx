import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Star,
  ShieldCheck,
  Filter,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Heart,
  MessageSquare,
  Layers,
  Award,
  SlidersHorizontal,
  Check,
  Building2,
  Search,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { REAL_TAMIL_NADU_VENDORS } from "../../data/tnVendorsData";
import { API_BASE_URL } from "../../services/api";

interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: string[];
  duration?: string;
  badge?: string;
}

interface CaseStudyItem {
  id: string;
  title: string;
  clientName?: string;
  bareVenueUrl?: string;
  finalSetupUrl?: string;
  description?: string;
  date?: string;
}

interface VendorItem {
  id: string;
  businessName: string;
  category: string;
  rating: number;
  reviewsCount: number;
  experience: number;
  city: string;
  distanceKm?: number;
  minPrice: number;
  priceDisplay?: string;
  verified: boolean;
  specialty: string;
  imageBg: string;
  isRegistered?: boolean;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  coverUrl?: string;
  packages?: ServicePackage[];
  caseStudies?: CaseStudyItem[];
}

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

const CATEGORY_IMAGES: Record<string, string[]> = {
  Catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
  ],
  Decoration: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80",
  ],
  Photography: [
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80",
  ],
  Music: [
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
  ],
  Mehendi: [
    "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545232979-fbf67597a73f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584282479901-d7e7e6024921?w=800&auto=format&fit=crop&q=80",
  ],
  Venue: [
    "https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
  ],
};

function normalizeCategory(cat: string): string {
  const text = (cat || "").toLowerCase();
  if (/cater|food|sweet|sadhya|feast|bakes|kitchen/.test(text)) return "Catering";
  if (/decor|mandap|floral|stage|light|theme/.test(text)) return "Decoration";
  if (/photo|video|film|cinemat|candid|studio/.test(text)) return "Photography";
  if (/music|dj|melam|band|sound|chenda|orchestra/.test(text)) return "Music";
  if (/mehendi|mehndi|mehandi|henna|makeup|bridal|makeover|beauty|raziya/.test(text)) return "Mehendi";
  if (/venue|hall|resort|convention|auditorium|palace|lawn/.test(text)) return "Venue";
  return "Decoration";
}

function getCategoryImage(cat: string, index: number, businessName = ""): string {
  const text = `${cat || ""} ${businessName || ""}`.toLowerCase();

  if (/cater|food|sweet|cook|bak|feast|biryani|kitchen|dine|dining|sadhya|restaurant/.test(text)) {
    return CATEGORY_IMAGES.Catering[Math.abs(index) % CATEGORY_IMAGES.Catering.length];
  }
  if (/decor|mandap|flower|floral|stage|light|event planner|theme|ambience/.test(text)) {
    return CATEGORY_IMAGES.Decoration[Math.abs(index) % CATEGORY_IMAGES.Decoration.length];
  }
  if (/photo|video|film|camera|studio|cinemat|candid|shoot|album/.test(text)) {
    return CATEGORY_IMAGES.Photography[Math.abs(index) % CATEGORY_IMAGES.Photography.length];
  }
  if (/music|dj|melam|band|sound|audio|singer|orchestra|chenda|nadaswaram|acoustic|fusion/.test(text)) {
    return CATEGORY_IMAGES.Music[Math.abs(index) % CATEGORY_IMAGES.Music.length];
  }
  if (/mehendi|mehndi|mehandi|henna|makeup|makeover|beauty|salon|bride|bridal|hair|raziya/.test(text)) {
    return CATEGORY_IMAGES.Mehendi[Math.abs(index) % CATEGORY_IMAGES.Mehendi.length];
  }
  if (/venue|hall|resort|palace|auditorium|convention|lawn|hotel|banquet|mandapam/.test(text)) {
    return CATEGORY_IMAGES.Venue[Math.abs(index) % CATEGORY_IMAGES.Venue.length];
  }

  return CATEGORY_IMAGES.Decoration[Math.abs(index) % CATEGORY_IMAGES.Decoration.length];
}

function getEvent(): EventData | null {
  try {
    const s = localStorage.getItem("eventos_event");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function getRegisteredVendorsFromStorage(): VendorItem[] {
  try {
    const raw = localStorage.getItem("eventos_registered_accounts");
    if (!raw) return [];
    const accounts: Record<string, any> = JSON.parse(raw);
    const vendors: VendorItem[] = [];

    Object.values(accounts).forEach((acc: any) => {
      if (acc.role === "VENDOR" || acc.vendorProfile) {
        const vp = acc.vendorProfile || {};
        const vKey = (acc.email || acc.name || "").toLowerCase().trim();

        let packages: ServicePackage[] = [];
        try {
          const sRaw = localStorage.getItem(`eventos_vendor_services_${vKey}`);
          if (sRaw) {
            const list = JSON.parse(sRaw);
            if (Array.isArray(list)) {
              packages = list.map((p: any) => ({
                id: p.id || `pkg-${Date.now()}`,
                name: p.title || p.name || "Standard Event Package",
                price: Number(p.price) || 45000,
                description: p.description || p.subtitle || "Complete event package solution",
                features: p.features || p.inclusions || ["On-site coordination", "Professional setup"],
                badge: p.badge || p.role || "Popular Choice",
              }));
            }
          }
        } catch {}

        let caseStudies: CaseStudyItem[] = [];
        try {
          const pRaw = localStorage.getItem(`eventos_vendor_portfolio_${vKey}`);
          if (pRaw) {
            const list = JSON.parse(pRaw);
            if (Array.isArray(list)) {
              caseStudies = list.map((cs: any) => ({
                id: cs.id || `cs-${Date.now()}`,
                title: cs.title || "Signature Event Setup",
                clientName: cs.clientName || "Grand Banquet",
                bareVenueUrl: cs.bareVenueUrl || cs.beforeUrl,
                finalSetupUrl: cs.finalSetupUrl || cs.afterUrl || cs.heroUrl,
                description: cs.description || cs.summary,
              }));
            }
          }
        } catch {}

        const normCat = normalizeCategory(vp.category || acc.category || "Decoration");
        const minPrice = Number(vp.basePrice) || (packages.length > 0 ? Math.min(...packages.map((p) => p.price)) : 45000);

        vendors.push({
          id: `reg-vendor-${vKey}`,
          businessName: vp.businessName || acc.name || "Verified Partner",
          category: normCat,
          rating: Number(vp.rating) || 4.9,
          reviewsCount: Number(vp.reviewsCount) || 54,
          experience: Number(vp.experienceYears) || 9,
          city: vp.city || "Palakkad, Kerala",
          distanceKm: 0,
          minPrice: minPrice,
          verified: true,
          specialty: vp.bio || `${packages.length > 0 ? `${packages.length} active service packages` : "Verified direct event vendor"}`,
          imageBg: acc.coverUrl || acc.avatarUrl || getCategoryImage(normCat, 0, vp.businessName || acc.name),
          isRegistered: true,
          phone: vp.phone || acc.phone,
          email: acc.email,
          avatarUrl: acc.avatarUrl,
          coverUrl: acc.coverUrl,
          packages: packages,
          caseStudies: caseStudies,
        });
      }
    });

    return vendors;
  } catch {
    return [];
  }
}

function sendInquiryToVendor(vendor: VendorItem, clientMessage: string, selectedPackage?: ServicePackage) {
  try {
    const userStr = localStorage.getItem("eventos_user");
    const user = userStr ? JSON.parse(userStr) : null;
    const clientName = user?.name || "Event Host";
    const clientPhone = user?.phone || "+91 98470 12345";
    const clientEmail = user?.email || "host@eventos.ai";

    const evtStr = localStorage.getItem("eventos_event");
    const evt = evtStr ? JSON.parse(evtStr) : null;
    const eventName = evt?.title || "Royal Wedding & Reception";
    const eventType = evt?.eventType || "Wedding";
    const eventDate = evt?.eventDate || "24 Nov 2026";
    const city = evt?.city || vendor.city || "Palakkad";
    const guestCount = evt?.guestCount || 450;

    const vendorKey = (vendor.email || vendor.businessName || "").toLowerCase().trim();
    const storageKey = `eventos_vendor_messages_${vendorKey}`;

    const rawThreads = localStorage.getItem(storageKey);
    let threads: any[] = rawThreads ? JSON.parse(rawThreads) : [];

    let thread = threads.find((t: any) => t.clientName === clientName || t.clientEmail === clientEmail);
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const newMsg: any = {
      id: `msg-${Date.now()}`,
      sender: "client",
      text: clientMessage,
      timestamp: timeStr,
      status: "sent",
    };

    if (selectedPackage) {
      newMsg.quoteCard = {
        packageTitle: selectedPackage.name,
        amount: selectedPackage.price,
        advanceRequired: Math.round(selectedPackage.price * 0.3),
        inclusions: selectedPackage.features || [selectedPackage.description || vendor.specialty],
        validUntil: "Valid for 14 days",
        status: "pending",
      };
    }

    if (thread) {
      thread.lastMessage = clientMessage;
      thread.lastMessageTime = "Just now";
      thread.lastMessageSender = "client";
      thread.unreadCount = (thread.unreadCount || 0) + 1;
      thread.messages.push(newMsg);
    } else {
      thread = {
        id: `thread-${Date.now()}`,
        clientName: clientName,
        clientPhone: clientPhone,
        clientEmail: clientEmail,
        avatarBg: "#2563EB",
        isOnline: true,
        eventName: eventName,
        eventType: eventType,
        eventDate: eventDate,
        venue: `${city} Event Grounds`,
        city: city,
        guestCount: guestCount,
        contractAmount: selectedPackage ? selectedPackage.price : vendor.minPrice,
        advancePaid: 0,
        status: "pending",
        category: vendor.category,
        lastMessage: clientMessage,
        lastMessageTime: "Just now",
        lastMessageSender: "client",
        unreadCount: 1,
        messages: [newMsg],
      };
      threads.unshift(thread);
    }

    localStorage.setItem(storageKey, JSON.stringify(threads));

    // Sync to global chat threads for user view
    try {
      const userChatKey = `eventos_chat_threads`;
      const rawUserChats = localStorage.getItem(userChatKey);
      let userChats: any[] = rawUserChats ? JSON.parse(rawUserChats) : [];
      let uThread = userChats.find((t: any) => t.vendorName === vendor.businessName);
      if (uThread) {
        uThread.lastMessage = clientMessage;
        uThread.lastMessageTime = "Just now";
        uThread.messages.push(newMsg);
      } else {
        userChats.unshift({
          id: `u-thread-${Date.now()}`,
          vendorName: vendor.businessName,
          vendorCategory: vendor.category,
          vendorCity: vendor.city,
          avatarUrl: vendor.avatarUrl || vendor.imageBg,
          lastMessage: clientMessage,
          lastMessageTime: "Just now",
          messages: [newMsg],
        });
      }
      localStorage.setItem(userChatKey, JSON.stringify(userChats));
    } catch {}

    window.dispatchEvent(new Event("eventos_messages_changed"));
  } catch (e) {
    console.error("Failed to send inquiry to vendor:", e);
  }
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(() => getEvent());
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<VendorItem | null>(null);
  const [modalTab, setModalTab] = useState<"packages" | "portfolio" | "verification">("packages");
  const [bookedVendor, setBookedVendor] = useState<VendorItem | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<ServicePackage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Advanced Filters
  const [budgetFilter, setBudgetFilter] = useState<string>("ALL");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("RECOMMENDED");
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);

  // Pagination State (10 vendors per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, budgetFilter, ratingFilter, sortBy, showWishlistOnly]);

  // Wishlist Storage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("eventos_wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const categories = ["ALL", "Catering", "Decoration", "Photography", "Music", "Mehendi", "Makeup & Bridal", "Venue"];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleWishlist = (vendorId: string, vendorName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (wishlist.includes(vendorId)) {
      updated = wishlist.filter((id) => id !== vendorId);
      triggerToast(`Removed ${vendorName} from Wishlist`);
    } else {
      updated = [...wishlist, vendorId];
      triggerToast(`Saved ${vendorName} to Wishlist! ❤️`);
    }
    setWishlist(updated);
    localStorage.setItem("eventos_wishlist", JSON.stringify(updated));
  };

  const loadVendorsForLocation = async (currentEvt: EventData | null) => {
    setAiLoading(true);
    const targetCity = currentEvt?.city || "Chennai";
    const targetState = currentEvt?.state || "Tamil Nadu";
    const targetEvent = currentEvt?.eventType || "Wedding";

    // Load any registered vendor accounts created in EventOS
    const registeredVendors = getRegisteredVendorsFromStorage();

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/vendors/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: targetCity,
          state: targetState,
          eventType: targetEvent,
          budget: currentEvt?.budget,
        }),
      });
      const json = await res.json();
      let apiVendors: VendorItem[] = [];
      if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
        apiVendors = json.data.map((v: any, i: number) => {
          const normCat = normalizeCategory(v.category || "Decoration");
          return {
            id: `vendor-${i}-${Date.now()}`,
            businessName: v.businessName || "Verified Partner",
            category: normCat,
            rating: Number(v.rating) || 4.8,
            reviewsCount: Number(v.reviewsCount) || 85,
            experience: Number(v.experience) || 8,
            city: v.city || `${targetCity}, ${targetState}`,
            distanceKm: v.distanceKm != null ? Number(v.distanceKm) : (i % 4 === 0 ? 0 : (i % 4) * 60 + 20),
            minPrice: Number(v.minPrice) || 45000,
            verified: Boolean(v.verified !== false),
            specialty: v.specialty || "Specialized event services",
            imageBg: getCategoryImage(normCat, i, v.businessName),
          };
        });
      }

      // Combine registered vendors first, then REAL Tamil Nadu vendors, then API vendors
      const combined = [...registeredVendors, ...REAL_TAMIL_NADU_VENDORS, ...apiVendors];
      // Deduplicate by businessName
      const uniqueVendors = Array.from(new Map(combined.map((item) => [item.businessName.toLowerCase(), item])).values());
      setVendors(uniqueVendors);
    } catch {
      const combined = [...registeredVendors, ...REAL_TAMIL_NADU_VENDORS];
      const uniqueVendors = Array.from(new Map(combined.map((item) => [item.businessName.toLowerCase(), item])).values());
      setVendors(uniqueVendors);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const active = getEvent();
    setEvent(active);
    loadVendorsForLocation(active);

    const handleEventChange = () => {
      const refreshed = getEvent();
      setEvent(refreshed);
      loadVendorsForLocation(refreshed);
    };

    window.addEventListener("eventos_event_changed", handleEventChange);
    window.addEventListener("storage", handleEventChange);

    return () => {
      window.removeEventListener("eventos_event_changed", handleEventChange);
      window.removeEventListener("storage", handleEventChange);
    };
  }, []);

  // Filter & Sort Logic
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        // Category Filter
        const matchCat =
          selectedCategory === "ALL" ||
          v.category.toLowerCase() === selectedCategory.toLowerCase() ||
          normalizeCategory(v.category).toLowerCase() === selectedCategory.toLowerCase();

        // Search Filter
        const matchSearch =
          !searchQuery ||
          v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.specialty.toLowerCase().includes(searchQuery.toLowerCase());

        // Budget Filter
        let matchBudget = true;
        if (budgetFilter === "UNDER_50K") matchBudget = v.minPrice <= 50000;
        else if (budgetFilter === "50K_150K") matchBudget = v.minPrice > 50000 && v.minPrice <= 150000;
        else if (budgetFilter === "ABOVE_150K") matchBudget = v.minPrice > 150000;

        // Rating Filter
        let matchRating = true;
        if (ratingFilter === "TOP_RATED") matchRating = v.rating >= 4.5;
        else if (ratingFilter === "ELITE") matchRating = v.rating >= 4.8;

        // Wishlist Filter
        const matchWishlist = !showWishlistOnly || wishlist.includes(v.id);

        return matchCat && matchSearch && matchBudget && matchRating && matchWishlist;
      })
      .sort((a, b) => {
        // Registered vendors pin to top if default recommended sort
        if (sortBy === "RECOMMENDED") {
          if (a.isRegistered && !b.isRegistered) return -1;
          if (!a.isRegistered && b.isRegistered) return 1;
          return b.rating - a.rating;
        }
        if (sortBy === "PRICE_LOW") return a.minPrice - b.minPrice;
        if (sortBy === "PRICE_HIGH") return b.minPrice - a.minPrice;
        if (sortBy === "RATING_HIGH") return b.rating - a.rating;
        if (sortBy === "EXPERIENCE_HIGH") return b.experience - a.experience;
        return 0;
      });
  }, [vendors, selectedCategory, searchQuery, budgetFilter, ratingFilter, sortBy, showWishlistOnly, wishlist]);

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVendors = useMemo(() => {
    return filteredVendors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVendors, startIndex]);

  const handleBookVendor = (v: VendorItem, pkg?: ServicePackage) => {
    setBookedVendor(v);
    setSelectedPackageForBooking(pkg || (v.packages && v.packages.length > 0 ? v.packages[0] : null));

    try {
      const existing = localStorage.getItem("eventos_bookings");
      const list: any[] = existing ? JSON.parse(existing) : [];
      const currentEvt = getEvent();
      const currentEventTitle = currentEvt?.title || "Your Celebration";
      const currentEventId = currentEvt?.id || "default-event";

      const vendorPrice = pkg ? pkg.price : Number(v.minPrice) || 45000;
      const userBudget = currentEvt?.budget ? Math.round(Number(currentEvt.budget) * 0.25) : Math.round(vendorPrice * 0.9);
      const aiOffer = Math.round(vendorPrice * 0.82);
      const savings = vendorPrice - aiOffer;

      const newBooking = {
        id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        eventId: currentEventId,
        eventName: currentEventTitle,
        vendorId: v.id,
        vendorName: v.businessName,
        category: v.category,
        city: v.city,
        amount: vendorPrice,
        vendorPrice: vendorPrice,
        userBudget: userBudget,
        aiOffer: aiOffer,
        status: "pending",
        statusText: "Awaiting response",
        details: pkg ? `${pkg.name} - ${pkg.description}` : v.specialty,
        strategy: "Early booking & package bundling discount",
        potentialSavings: `₹${savings.toLocaleString("en-IN")} (${Math.round((savings / vendorPrice) * 100)}%)`,
        reasoning: `${v.businessName} has high availability for "${currentEventTitle}" in ${v.city}. Booking now allows negotiating an 18-20% customized package discount.`,
        confidence: 89,
        suggestedMessage: `Hi ${v.businessName}! We are planning "${currentEventTitle}" and loved your work. Could we move forward with ${pkg ? `the "${pkg.name}"` : "an all-inclusive"} package at ₹${aiOffer.toLocaleString("en-IN")}?`,
        iconBg: "#2563EB",
        imageBg: v.imageBg,
        bookingDate: new Date().toISOString(),
      };

      const filtered = list.filter((b) => !(b.vendorName === v.businessName && b.eventId === currentEventId));
      filtered.unshift(newBooking);
      localStorage.setItem("eventos_bookings", JSON.stringify(filtered));
      window.dispatchEvent(new Event("eventos_bookings_changed"));

      // Send inquiry into vendor chat system
      sendInquiryToVendor(
        v,
        `Hello ${v.businessName}! I would like to book ${pkg ? `the "${pkg.name}" package (₹${pkg.price.toLocaleString("en-IN")})` : "your services"} for our ${currentEventTitle} event on ${currentEvt?.eventDate || "upcoming date"} in ${v.city}.`,
        pkg
      );
    } catch (e) {
      console.error("Failed to persist booking:", e);
    }
  };

  const handleOpenDirectChat = (vendor: VendorItem) => {
    sendInquiryToVendor(
      vendor,
      `Hi ${vendor.businessName}! I am browsing your services on EventOS and would love to ask a few questions about availability for our event.`
    );
    navigate("/vendor-messages");
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main">
        <Header />

        {/* Title Header */}
        <div className="bookings-header" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="eyebrow dark">EVENTOS MARKETPLACE</p>
              <h1>Verified Event Vendors &amp; Partners</h1>
              <p className="sub-text">
                Explore top verified caterers, decorators, photographers, venues &amp; artists with live package pricing.
              </p>
            </div>
            
            <button
              className={`wishlist-toggle-pill ${showWishlistOnly ? "active" : ""}`}
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              type="button"
            >
              <Heart size={15} fill={showWishlistOnly ? "#dc2626" : "none"} />
              <span>Saved Wishlist ({wishlist.length})</span>
            </button>
          </div>
        </div>

        {/* AI Recommendations Banner */}
        <div
          className="ai-card"
          style={{
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
            padding: "18px 24px",
            borderRadius: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="ai-icon" style={{ flexShrink: 0 }}>
              <Sparkles size={20} />
            </div>
            <div>
              <p className="eyebrow dark" style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 800 }}>
                AI VENDOR MATCHING ENGINE
              </p>
              <h2 style={{ fontSize: "1.15rem", margin: "0 0 2px", color: "#0f172a", fontWeight: 700 }}>
                Curated Recommendations for {event?.city || "Your Event"}
                {event?.state ? `, ${event.state}` : ""}
              </h2>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
                {event
                  ? `Filtering verified specialists matching "${event.title}" under ₹${(event.budget || 200000).toLocaleString("en-IN")} budget.`
                  : "Discover verified event partners with guaranteed pricing and direct chat access."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => loadVendorsForLocation(event)}
            disabled={aiLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {aiLoading ? (
              <>
                <Loader2 size={15} className="login-spin" />
                <span>Refreshing…</span>
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                <span>Refresh AI Match</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar above Filters */}
        <div
          style={{
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            background: "#ffffff",
            border: "1.5px solid #cbd5e1",
            borderRadius: "14px",
            padding: "6px 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            transition: "all 0.2s ease",
          }}
        >
          <Search size={18} className="text-blue" style={{ marginRight: "10px", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search vendors by name, city (e.g. Chennai, Madurai, Coimbatore, Trichy), category or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0f172a",
              background: "transparent",
              padding: "8px 0",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                color: "#64748b",
                cursor: "pointer",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "8px",
                flexShrink: 0,
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Multi-Facet Filter Toolbar */}
        <div className="marketplace-top-toolbar">
          <div className="marketplace-filter-group">
            <div className="filter-label" style={{ marginRight: "4px" }}>
              <SlidersHorizontal size={15} className="text-blue" />
              <span>Filters:</span>
            </div>

            {/* Budget Tier Filter */}
            <select
              className="marketplace-select"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
            >
              <option value="ALL">All Budgets</option>
              <option value="UNDER_50K">Under ₹50,000</option>
              <option value="50K_150K">₹50,000 - ₹1,50,000</option>
              <option value="ABOVE_150K">Above ₹1,50,000</option>
            </select>

            {/* Rating Filter */}
            <select
              className="marketplace-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="ALL">All Ratings</option>
              <option value="TOP_RATED">4.5+ ★ Top Rated</option>
              <option value="ELITE">4.8+ ★ Elite Verified</option>
            </select>
          </div>

          <div className="marketplace-filter-group">
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Sort By:</span>
            <select
              className="marketplace-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="RECOMMENDED">✨ AI Best Match</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING_HIGH">Highest Rated</option>
              <option value="EXPERIENCE_HIGH">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="marketplace-filters">
          <div className="filter-label">
            <Filter size={15} />
            <span>Categories:</span>
          </div>
          <div className="filter-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors Grid */}
        {aiLoading && vendors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#64748b" }}>
            <Loader2 size={32} className="login-spin text-blue" style={{ margin: "0 auto 12px" }} />
            <h3>Locating top verified vendors...</h3>
            <p>Searching caterers, mandap decorators, photographers and music artists.</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#64748b", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
            <Building2 size={40} style={{ margin: "0 auto 12px", color: "#94a3b8" }} />
            <h3 style={{ margin: "0 0 6px", color: "#0f172a" }}>No vendors match your current filter selection</h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px" }}>Try resetting your category or price range filters to view more vendors.</p>
            <button
              className="secondary-button"
              onClick={() => {
                setSelectedCategory("ALL");
                setBudgetFilter("ALL");
                setRatingFilter("ALL");
                setSearchQuery("");
                setShowWishlistOnly(false);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="vendors-grid-list">
              {paginatedVendors.map((vendor) => {
                const isWishlisted = wishlist.includes(vendor.id);
                return (
                  <div key={vendor.id} className="vendor-card-marketplace">
                    <div
                      className="vendor-card-image"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%), url(${vendor.coverUrl || vendor.imageBg || getCategoryImage(vendor.category, 0, vendor.businessName)})`,
                      }}
                    >
                      {/* Live Partner / Registered Badge */}
                      {vendor.isRegistered && (
                        <span className="live-partner-badge">
                          LIVE PARTNER
                        </span>
                      )}

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
                        onClick={(e) => toggleWishlist(vendor.id, vendor.businessName, e)}
                        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                      >
                        <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} />
                      </button>

                      <span className="price-tag">
                        {vendor.priceDisplay || `From ₹${vendor.minPrice.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    <div className="vendor-card-content">
                      <div className="vendor-title-row-card">
                        <h3>{vendor.businessName}</h3>
                        {vendor.verified && (
                          <span className="verified-badge-marker" title="Verified Provider">
                            <ShieldCheck size={18} />
                          </span>
                        )}
                      </div>

                      <div className="vendor-cat-city">
                        <span>{vendor.category}</span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                          <MapPin size={11} />
                          {vendor.city}
                        </span>
                      </div>

                      <div className="vendor-rating-reviews">
                        <div className="star-rating-box">
                          <Star size={13} fill="#F59E0B" color="#F59E0B" />
                          <span>{vendor.rating.toFixed(1)}</span>
                        </div>
                        <span className="reviews-count">({vendor.reviewsCount} reviews)</span>
                        <span className="separator-dot">•</span>
                        <span className="vendor-exp">{vendor.experience} yrs exp</span>
                      </div>

                      <p
                        style={{
                          margin: "0 0 16px",
                          fontSize: "13px",
                          color: "var(--muted)",
                          lineHeight: "1.5",
                          flex: 1,
                        }}
                      >
                        {vendor.specialty}
                      </p>

                      <div className="vendor-card-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() => {
                            setSelectedVendorForModal(vendor);
                            setModalTab("packages");
                          }}
                        >
                          View Portfolio
                        </button>

                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => handleBookVendor(vendor)}
                        >
                          Book Vendor
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filteredVendors.length > 0 && (
              <div className="pagination-wrapper">
                <p className="pagination-header-info">
                  Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (Total {filteredVendors.length} Vendors)
                </p>

                <div className="pagination-buttons-grid">
                  <button
                    type="button"
                    className="page-num-btn"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    title="Previous Page"
                  >
                    «
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`page-num-btn ${pageNum === currentPage ? "active" : ""}`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 350, behavior: "smooth" });
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="page-num-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    title="Next Page"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Multi-Tab Vendor Details & Portfolio Modal */}
        {selectedVendorForModal && (
          <div
            className="social-modal-backdrop"
            onClick={() => setSelectedVendorForModal(null)}
          >
            <div
              className="social-modal-window"
              style={{ maxWidth: "620px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="social-modal-top">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={22} className="text-blue" />
                  <span style={{ fontWeight: 800, fontSize: "14px", color: "#0f172a" }}>
                    VENDOR PROFILE &amp; PORTFOLIO
                  </span>
                </div>
                <button
                  className="social-modal-close-btn"
                  onClick={() => setSelectedVendorForModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cover Banner */}
              <div
                style={{
                  height: "190px",
                  borderRadius: "14px",
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url(${selectedVendorForModal.coverUrl || selectedVendorForModal.imageBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginBottom: "16px",
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "16px",
                }}
              >
                <div style={{ color: "white" }}>
                  <h2 style={{ fontSize: "1.4rem", margin: "0 0 2px", fontWeight: 800, color: "white" }}>
                    {selectedVendorForModal.businessName}
                  </h2>
                  <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                    {selectedVendorForModal.category} • {selectedVendorForModal.city} • {selectedVendorForModal.experience} Years Experience
                  </p>
                </div>
              </div>

              {/* Navigation Tabs Header */}
              <div className="modal-tabs-header">
                <button
                  className={`modal-tab-button ${modalTab === "packages" ? "active" : ""}`}
                  onClick={() => setModalTab("packages")}
                >
                  <Layers size={15} />
                  <span>Packages ({selectedVendorForModal.packages?.length || 1})</span>
                </button>
                <button
                  className={`modal-tab-button ${modalTab === "portfolio" ? "active" : ""}`}
                  onClick={() => setModalTab("portfolio")}
                >
                  <Award size={15} />
                  <span>Portfolio Showcase</span>
                </button>
                <button
                  className={`modal-tab-button ${modalTab === "verification" ? "active" : ""}`}
                  onClick={() => setModalTab("verification")}
                >
                  <ShieldCheck size={15} />
                  <span>Google Verification</span>
                </button>
              </div>

              {/* Tab 1: Service Packages */}
              {modalTab === "packages" && (
                <div>
                  <h4 style={{ fontSize: "13px", color: "#334155", margin: "0 0 10px", fontWeight: 700 }}>
                    AVAILABLE SERVICE PACKAGES
                  </h4>

                  {selectedVendorForModal.packages && selectedVendorForModal.packages.length > 0 ? (
                    <div className="package-card-grid">
                      {selectedVendorForModal.packages.map((pkg) => (
                        <div key={pkg.id} className="package-item-box">
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <strong style={{ fontSize: "14px", color: "#0f172a" }}>{pkg.name}</strong>
                              {pkg.badge && (
                                <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>
                                  {pkg.badge}
                                </span>
                              )}
                            </div>
                            <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#64748b" }}>{pkg.description}</p>
                            {pkg.features && pkg.features.length > 0 && (
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {pkg.features.map((feat, idx) => (
                                  <span key={idx} style={{ fontSize: "11px", color: "#059669", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                    <Check size={12} />
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <strong style={{ fontSize: "1.1rem", color: "#0f172a", display: "block", marginBottom: "6px" }}>
                              ₹{pkg.price.toLocaleString("en-IN")}
                            </strong>
                            <button
                              className="primary-button"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                              onClick={() => {
                                const target = selectedVendorForModal;
                                setSelectedVendorForModal(null);
                                handleBookVendor(target, pkg);
                              }}
                            >
                              Select Package
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                        All-Inclusive Custom Package
                      </strong>
                      <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748b" }}>
                        {selectedVendorForModal.specialty}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>Starting Price</span>
                        <strong style={{ fontSize: "1.2rem", color: "#0f172a" }}>
                          ₹{selectedVendorForModal.minPrice.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Portfolio & Case Studies */}
              {modalTab === "portfolio" && (
                <div>
                  <h4 style={{ fontSize: "13px", color: "#334155", margin: "0 0 10px", fontWeight: 700 }}>
                    PORTFOLIO &amp; BEFORE/AFTER TRANSFORMATIONS
                  </h4>

                  {selectedVendorForModal.caseStudies && selectedVendorForModal.caseStudies.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      {selectedVendorForModal.caseStudies.map((cs) => (
                        <div key={cs.id} className="case-study-mini-card">
                          <div className="case-study-images-pair">
                            <div
                              className="case-study-img-half"
                              style={{ backgroundImage: `url(${cs.bareVenueUrl || selectedVendorForModal.imageBg})` }}
                            >
                              <span className="img-half-label">Bare Venue</span>
                            </div>
                            <div
                              className="case-study-img-half"
                              style={{ backgroundImage: `url(${cs.finalSetupUrl || selectedVendorForModal.imageBg})` }}
                            >
                              <span className="img-half-label" style={{ background: "#16a34a" }}>Final Setup</span>
                            </div>
                          </div>
                          <div style={{ padding: "10px" }}>
                            <strong style={{ fontSize: "12px", color: "#0f172a", display: "block" }}>{cs.title}</strong>
                            <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>{cs.clientName || "Event Project"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px dashed #cbd5e1", marginBottom: "16px" }}>
                      <Award size={32} style={{ color: "#94a3b8", margin: "0 auto 8px" }} />
                      <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "#0f172a" }}>Verified High-Quality Work</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                        {selectedVendorForModal.businessName} has completed over {selectedVendorForModal.reviewsCount * 2}+ verified event projects with a {selectedVendorForModal.rating.toFixed(1)} ★ satisfaction score.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Google Verification & Links */}
              {modalTab === "verification" && (
                <div>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #f0f7ff, #e0f2fe)",
                      border: "1.5px solid #bae6fd",
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                      </div>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#0369a1", display: "block" }}>
                          Verified Google Business Profile
                        </strong>
                        <span style={{ fontSize: "12px", color: "#0284c7" }}>
                          Check live web reviews, street photos &amp; map location
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`${selectedVendorForModal.businessName} ${selectedVendorForModal.city} ${selectedVendorForModal.category}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#0284c7",
                          color: "#ffffff",
                          padding: "9px 14px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 6px rgba(2, 132, 199, 0.3)",
                        }}
                      >
                        <span>Google Search</span>
                        <ExternalLink size={13} />
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedVendorForModal.businessName} ${selectedVendorForModal.city}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#ffffff",
                          color: "#0369a1",
                          border: "1px solid #bae6fd",
                          padding: "9px 14px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <MapPin size={14} />
                        <span>Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="social-modal-actions" style={{ gap: "10px", marginTop: "12px" }}>
                <button
                  className="secondary-button"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  onClick={() => {
                    const target = selectedVendorForModal;
                    setSelectedVendorForModal(null);
                    handleOpenDirectChat(target);
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Instant Chat</span>
                </button>

                <button
                  className="primary-button"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  onClick={() => {
                    const target = selectedVendorForModal;
                    setSelectedVendorForModal(null);
                    handleBookVendor(target);
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Book Vendor</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        {bookedVendor && (
          <div
            className="social-modal-backdrop"
            onClick={() => setBookedVendor(null)}
          >
            <div
              className="social-modal-window"
              style={{ maxWidth: "460px", textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <CheckCircle2 size={34} />
              </div>

              <h2 style={{ fontSize: "1.3rem", margin: "0 0 6px", color: "#0f172a" }}>
                Booking Request Sent!
              </h2>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 16px", lineHeight: "1.6" }}>
                Your request for <strong>{selectedPackageForBooking ? selectedPackageForBooking.name : "all-inclusive package"}</strong> has been sent to <strong>{bookedVendor.businessName}</strong> ({bookedVendor.city}).
                An inquiry thread has been initiated in your Messages Hub.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="secondary-button"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => {
                    setBookedVendor(null);
                    navigate("/vendor-messages");
                  }}
                >
                  View Messages
                </button>

                <button
                  className="primary-button"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => {
                    setBookedVendor(null);
                    navigate("/bookings");
                  }}
                >
                  Go to Bookings Hub
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "#0f172a",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              zIndex: 9999,
              animation: "fadeIn 0.2s ease",
            }}
          >
            <Sparkles size={16} className="text-blue" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
