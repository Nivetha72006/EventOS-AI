import { useState, useEffect } from "react";
import {
  FolderOpen,
  Plus,
  Edit3,
  Trash2,
  Share2,
  Sparkles,
  Award,
  ShieldCheck,
  Eye,
  X,
  Check,
  Palette,
  MapPin,
  Users,
  Calendar,
  Sliders,
  Heart,
  Camera,
  Briefcase,
  UploadCloud,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  eventType: "Royal Wedding" | "Traditional Muhurtham" | "Sangeet & Cocktail" | "Grand Reception" | "Intimate Engagement";
  venue: string;
  city: string;
  date: string;
  guestScale: string;
  heroImage: string;
  beforeImage?: string;
  afterImage?: string;
  badge?: string;
  summary: string;
  clientQuote?: string;
  clientNames?: string;
  highlights: string[];
  colorPalette?: string[];
  featured?: boolean;
  isFromBooking?: boolean;
}

export interface AestheticMoodboard {
  id: string;
  title: string;
  description: string;
  colors: string[];
  colorNames: string[];
  materials: string[];
  category: string;
  image: string;
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

function getStoredUser(): StoredUser {
  try {
    const stored = localStorage.getItem("eventos_user");
    return stored ? JSON.parse(stored) : { name: "Sri Balaji Catering & Decor", role: "VENDOR" };
  } catch {
    return { name: "Sri Balaji Catering & Decor", role: "VENDOR" };
  }
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

function getPreviousWorksFromBookings(user: StoredUser, vendorCategories: string[]): PortfolioProject[] {
  const previousProjects: PortfolioProject[] = [];
  try {
    const raw = localStorage.getItem("eventos_bookings");
    if (raw) {
      const bookings: BookingItem[] = JSON.parse(raw);
      if (Array.isArray(bookings)) {
        bookings.forEach((b, idx) => {
          const isMyBooking =
            (b.vendorName && user.name && b.vendorName.toLowerCase().includes(user.name.toLowerCase())) ||
            matchesVendorRole(b.category, vendorCategories);

          if (isMyBooking && (b.status === "completed" || b.status === "active")) {
            const cat = b.category || vendorCategories[0] || "Stage & Mandap Decorators";
            const ic = cat.toLowerCase();

            const heroImg = ic.includes("cater")
              ? "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80"
              : ic.includes("decor")
              ? "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              : ic.includes("photo")
              ? "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80"
              : ic.includes("dj") || ic.includes("music")
              ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
              : ic.includes("makeup")
              ? "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80"
              : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80";

            previousProjects.push({
              id: `prev-work-${b.id || idx}`,
              title: b.eventName ? `${b.eventName}` : `Confirmed Celebration for ${b.clientName || "Client"}`,
              category: cat,
              eventType: b.eventName?.toLowerCase().includes("reception")
                ? "Grand Reception"
                : b.eventName?.toLowerCase().includes("sangeet")
                ? "Sangeet & Cocktail"
                : b.eventName?.toLowerCase().includes("muhurtham")
                ? "Traditional Muhurtham"
                : "Royal Wedding",
              venue: b.city ? `${b.city} Grand Heritage Hall` : `${user.vendorProfile?.city || "Palakkad"} Palace Center`,
              city: b.city || user.vendorProfile?.city || "Palakkad",
              date: b.eventDate || "Recent 2026 Celebration",
              guestScale: b.guestCount ? `${b.guestCount} Guests` : "600 Guests",
              heroImage: heroImg,
              beforeImage: ic.includes("decor")
                ? "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"
                : ic.includes("cater")
                ? "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                : undefined,
              afterImage: (ic.includes("decor") || ic.includes("cater")) ? heroImg : undefined,
              badge: b.status === "completed" ? "✓ Verified Completed Work" : "⚡ Confirmed Active Contract",
              summary: b.details || `Professional ${cat} arrangements contracted for ₹${(b.amount || b.vendorPrice || 50000).toLocaleString("en-IN")} with 100% on-time execution.`,
              clientNames: b.clientName || "Ram & Seetha Family",
              clientQuote: `Working with ${user.name || "the vendor team"} was smooth and memorable. Everything was prepared to perfection!`,
              highlights: [
                `Contract confirmed at ₹${(b.amount || b.vendorPrice || 50000).toLocaleString("en-IN")}`,
                "Executed strictly on client schedule with zero delays",
                "Full dedicated support crew and lead coordinator",
              ],
              colorPalette: ["#D4AF37", "#800020", "#FFFDD0", "#046307"],
              featured: true,
              isFromBooking: true,
            });
          }
        });
      }
    }
  } catch (e) {
    console.error("Error generating previous works from bookings:", e);
  }
  return previousProjects;
}

function getDefaultProjectsForRoles(roles: string[], city: string = "Palakkad"): PortfolioProject[] {
  const list: PortfolioProject[] = [];

  const hasCatering = roles.some((r) => r.toLowerCase().includes("cater") || r.toLowerCase().includes("feast"));
  const hasDecor = roles.some((r) => r.toLowerCase().includes("decor") || r.toLowerCase().includes("mandap"));
  const hasPhoto = roles.some((r) => r.toLowerCase().includes("photo") || r.toLowerCase().includes("cinema"));
  const hasMusic = roles.some((r) => r.toLowerCase().includes("music") || r.toLowerCase().includes("dj") || r.toLowerCase().includes("sound"));
  const hasMakeup = roles.some((r) => r.toLowerCase().includes("makeup") || r.toLowerCase().includes("beauty") || r.toLowerCase().includes("hair"));
  const hasPriest = roles.some((r) => r.toLowerCase().includes("priest") || r.toLowerCase().includes("vedic") || r.toLowerCase().includes("pandit"));
  const hasMehendi = roles.some((r) => r.toLowerCase().includes("mehendi") || r.toLowerCase().includes("henna"));
  const hasVenue = roles.some((r) => r.toLowerCase().includes("venue") || r.toLowerCase().includes("hall") || r.toLowerCase().includes("resort"));

  if (hasDecor) {
    list.push(
      {
        id: "proj-dec-1",
        title: "The Royal Lotus Mandap at Leela Palace",
        category: "Stage & Mandap Decorators",
        eventType: "Royal Wedding",
        venue: "The Leela Palace Grand Ballroom",
        city: city || "Chennai",
        date: "January 2026",
        guestScale: "1,200 Guests",
        heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        beforeImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
        afterImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        badge: "🏆 WeddingSutra Featured",
        summary: "Transformed an empty 10,000 sq.ft hall into an ethereal temple sanctum with 4,000 fresh lotus stems, antique gold pillars, and warm brass deepams.",
        clientNames: "Arun & Deepa",
        clientQuote: "The mandap left our families speechless. Walking into the hall felt like stepping into an ancient royal palace!",
        highlights: [
          "Hand-carved gold mandap pillars with fresh jasmine cascading ropes",
          "Custom illuminated brass uruli water features at guest walkway",
          "Architectural warm amber mood lighting grid",
          "Flawless 6-hour overnight execution by a crew of 24 artisans",
        ],
        colorPalette: ["#D4AF37", "#800020", "#FFFDD0", "#046307"],
        featured: true,
      },
      {
        id: "proj-dec-2",
        title: "Sunset Bohemian Sangeet Canopy",
        category: "Stage & Mandap Decorators",
        eventType: "Sangeet & Cocktail",
        venue: "Taj Fisherman's Cove Lawn",
        city: city || "Kovalam",
        date: "February 2026",
        guestScale: "450 Guests",
        heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
        beforeImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        afterImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        badge: "✨ Client Favorite",
        summary: "Created an open-air coastal celebration paradise featuring cascading fairy light tunnels, macramé cabanas, and a floral swing photo installation.",
        clientNames: "Vikram & Ananya",
        clientQuote: "The lighting during dusk was magical. All our dance videos look straight out of a Bollywood film!",
        highlights: [
          "1.2 km of fairy light tunnel canopy over the beach lawn",
          "Custom neon dance floor backdrop with couple monogram",
          "Low seating Moroccan diwans with handcrafted cushions",
        ],
        colorPalette: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#1A535C"],
        featured: false,
      }
    );
  }

  if (hasCatering || list.length === 0) {
    list.push(
      {
        id: "proj-cat-1",
        title: "Grand 28-Course Heritage Sadhya Feast",
        category: "Catering & Feasts",
        eventType: "Traditional Muhurtham",
        venue: "Palakkad Heritage Palace Grounds",
        city: city || "Palakkad",
        date: "December 2025",
        guestScale: "1,800 Guests",
        heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
        beforeImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        afterImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
        badge: "👑 1,800 Guests Served",
        summary: "Masterminded a legendary 28-dish traditional feast served simultaneously to 1,800 guests across 3 seating batches with zero wait time.",
        clientNames: "Dr. K. Nambiar Family",
        clientQuote: "Every single guest praised the Ada Pradhaman and tender mango pickle. Flawless hospitality!",
        highlights: [
          "Served on organic plantain leaves sourced fresh that morning",
          "3 Artisanal Payasams (Ada Pradhaman, Parippu, Paal)",
          "Synchronized service team of 45 uniformed traditional servers",
          "100% zero food wastage with surplus donated to local community kitchen",
        ],
        colorPalette: ["#2E7D32", "#FBC02D", "#E65100", "#795548"],
        featured: true,
      },
      {
        id: "proj-cat-2",
        title: "Royal Fusion Reception & Live Gourmet Stations",
        category: "Catering & Feasts",
        eventType: "Grand Reception",
        venue: "ITC Grand Chola Banquet Hall",
        city: city || "Chennai",
        date: "January 2026",
        guestScale: "800 Guests",
        heroImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        badge: "⭐ 5.0 Star Rated",
        summary: "Curated a luxury multi-cuisine reception buffet featuring live artisan Chaat, clay oven Tandoor, Italian pasta live toss, and signature mocktails.",
        clientNames: "Siddharth & Meera",
        clientQuote: "The live dessert station with hot jalebis and saffron rabri was the absolute star of our evening.",
        highlights: [
          "4 Interactive live culinary stations with celebrity master chefs",
          "Exotic cold-pressed welcome drink bar with 6 signature recipes",
          "Custom porcelain fine-dining setup with crystal stemware",
        ],
        colorPalette: ["#C2185B", "#7B1FA2", "#FFB300", "#00897B"],
        featured: false,
      }
    );
  }

  if (hasPhoto) {
    list.push({
      id: "proj-pho-1",
      title: "Cinematic Royal Lakeview Wedding Film & Candids",
      category: "Photography & Cinematography",
      eventType: "Royal Wedding",
      venue: "Bolgatty Palace Resort",
      city: city || "Kochi",
      date: "February 2026",
      guestScale: "600 Guests",
      heroImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
      badge: "🎬 4K Teaser Trended",
      summary: "Documented a 3-day royal waterfront celebration capturing candid family moments, sunset drone landscapes, and couple portraits.",
      clientNames: "Gautham & Nithya",
      clientQuote: "The highlight reel brought tears of joy to our parents. The drone Muhurtham shot was breathtaking!",
      highlights: [
        "4K 10-bit cinema cameras + dual drone aerial Muhurtham coverage",
        "Next-day 60-second Instagram reel delivery for couple social reveal",
        "Over 1,400 edited high-res candid frames in private client cloud gallery",
      ],
      colorPalette: ["#0288D1", "#F57C00", "#512DA8", "#388E3C"],
      featured: true,
    });
  }

  if (hasMusic) {
    list.push({
      id: "proj-mus-1",
      title: "Electrifying Sangeet Concert & Laser Showcase",
      category: "Music, DJ & Sound",
      eventType: "Sangeet & Cocktail",
      venue: "Grand Hyatt Lawn",
      city: city || "Kochi",
      date: "January 2026",
      guestScale: "500 Guests",
      heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      badge: "🎧 6-Hour Non-Stop",
      summary: "Power-packed dance floor with line-array concert audio, moving head intelligent lasers, and custom family medley mixes.",
      clientNames: "Karthik & Sneha",
      clientQuote: "The entire crowd of 500 danced non-stop until 2 AM! The energy was unbelievable.",
      highlights: [
        "Custom couple walk-in song mashup with cold pyro sparkulars",
        "10KW Line-array festival concert sound system",
        "Moving head beam lights & heavy CO2 smoke blast drops",
      ],
      colorPalette: ["#E91E63", "#00E5FF", "#76FF03", "#D500F9"],
      featured: false,
    });
  }

  if (hasMakeup) {
    list.push({
      id: "proj-mua-1",
      title: "Royal Vedic Muhurtham Bridal Artistry",
      category: "Makeup & Hair Styling",
      eventType: "Traditional Muhurtham",
      venue: "Taj Connemara Bridal Suite",
      city: city || "Chennai",
      date: "February 2026",
      guestScale: "Bride & Family",
      heroImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      badge: "💄 18-Hour Waterproof Glow",
      summary: "HD Airbrush bridal makeup tailored for morning Muhurtham lighting, complete with silk saree pleating and fresh jasmine veni hair braiding.",
      clientNames: "Sowmya & Family",
      clientQuote: "The makeup stayed fresh and flawless from 5 AM until the evening reception. Received endless compliments!",
      highlights: [
        "Luxury MAC & Charlotte Tilbury HD formulation",
        "Traditional temple jewelry placement & silk saree drape",
        "Complete 18-hour sweatproof and waterproof guarantee",
      ],
      colorPalette: ["#E91E63", "#D4AF37", "#800020", "#FFFDD0"],
      featured: true,
    });
  }

  if (hasPriest) {
    list.push({
      id: "proj-pri-1",
      title: "Grand Vedic Muhurtham & Navagraha Homa",
      category: "Priest & Vedic Rituals",
      eventType: "Traditional Muhurtham",
      venue: "Sri Krishna Temple Mandapam",
      city: city || "Guruvayur",
      date: "January 2026",
      guestScale: "1,000 Guests",
      heroImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
      badge: "🪔 Strict Shastric Vidhi",
      summary: "Solemnized auspicious Vedic wedding ceremonies with precision astrological timing, Sanskrit chant explanations, and consecrated Homa rituals.",
      clientNames: "Srinivasan & Lakshmi",
      clientQuote: "The priest explained the deeper meaning of every mantra to our NRI friends and family. A deeply sacred atmosphere.",
      highlights: [
        "Astrological Muhurtham timing alignment",
        "Complete 108 Pooja samagri provision",
        "Bilingual English/Tamil Vedic mantra explanation",
      ],
      colorPalette: ["#E65100", "#FFD600", "#800020", "#FFFDD0"],
      featured: true,
    });
  }

  if (hasMehendi) {
    list.push({
      id: "proj-meh-1",
      title: "Intricate Rajasthani Bridal Mehndi & Doli Motifs",
      category: "Mehendi & Henna Art",
      eventType: "Sangeet & Cocktail",
      venue: "Heritage Garden Pavilion",
      city: city || "Palakkad",
      date: "February 2026",
      guestScale: "Bride + 60 Guests",
      heroImage: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
      badge: "🌿 100% Organic Dark Stain",
      summary: "Crafted intricate full-arm bridal henna depicting couple portrait caricatures, Lord Ganesha motifs, and wedding vow inscriptions.",
      clientNames: "Pooja & Rohan",
      clientQuote: "The henna stain was a deep rich mahogany red on our wedding day. Best mehndi artist!",
      highlights: [
        "100% Organic Rajasthani Sojat Henna",
        "Custom love story & couple initials embedded in pattern",
        "Fast application with zero chemical colorants",
      ],
      colorPalette: ["#3E2723", "#8D6E63", "#FF6F00", "#4CAF50"],
      featured: false,
    });
  }

  if (hasVenue) {
    list.push({
      id: "proj-ven-1",
      title: "Palace Waterfront Lawn & Banquet Consecration",
      category: "Venues & Banquet Halls",
      eventType: "Royal Wedding",
      venue: "Grand Heritage Waterfront Estate",
      city: city || "Kochi",
      date: "January 2026",
      guestScale: "2,000 Capacity",
      heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      badge: "🏰 2,000 Capacity",
      summary: "Hosted a majestic waterfront celebration featuring central air-conditioned dining halls, vast guest parking, and private bridal villas.",
      clientNames: "Menon & Varma Families",
      clientQuote: "The venue hospitality and facilities made hosting 2,000 guests effortless.",
      highlights: [
        "Central AC hall with 2,000 seating capacity",
        "Separate 500-car valet parking facility",
        "Dedicated green room suites for bride & groom",
      ],
      colorPalette: ["#1A237E", "#D4AF37", "#ECEFF1", "#2E7D32"],
      featured: true,
    });
  }

  return list;
}

function getMoodboardsForRoles(roles: string[]): AestheticMoodboard[] {
  const allMb: AestheticMoodboard[] = [
    {
      id: "mb-1",
      title: "Vedic Temple Royal Gold",
      description: "Sacred South Indian heritage aesthetic inspired by ancient Dravidian temple architecture, brass deepams, and fresh fragrant jasmine.",
      colors: ["#800020", "#D4AF37", "#FFFDD0", "#046307"],
      colorNames: ["Kumkum Red", "Temple Gold", "Raw Silk Cream", "Banana Leaf Emerald"],
      materials: ["Solid Brass Urulis", "Fresh White Jasmine", "Marigold Garlands", "Raw Silk Drapes"],
      category: "Stage & Mandap Decorators",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "mb-2",
      title: "Pastel Enchanted Garden",
      description: "Soft romantic European-inspired botanical floral canopy with subtle blush roses, white hydrangeas, and twinkling fairylight grids.",
      colors: ["#FFD1DC", "#E0BBE4", "#F0E68C", "#E8F5E9"],
      colorNames: ["Blush Rose", "Lavender Mist", "Soft Champagne", "Eucalyptus Green"],
      materials: ["Imported Hydrangeas", "Warm Micro-LED Drops", "Chiffon Fabric", "Crystal Chandeliers"],
      category: "Stage & Mandap Decorators",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "mb-3",
      title: "Royal Heritage Culinary Sadhya",
      description: "Traditional feast presentation emphasizing eco-friendly raw plantain leaf spreads, bell-metal kinnam bowls, and artisanal brass service ware.",
      colors: ["#2E7D32", "#FF8F00", "#4E342E", "#FFF8E1"],
      colorNames: ["Plantain Green", "Turmeric Amber", "Earthen Clay", "Pure Ghee Cream"],
      materials: ["Organic Banana Leaves", "Handcrafted Clay Pots", "Brass Payasam Samovars", "Khadi Attire"],
      category: "Catering & Feasts",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "mb-4",
      title: "Warm Golden-Hour Cinematic Film",
      description: "Cinematography color grading palette tailored for romantic twilight receptions, candlelit banquets, and sunset Muhurtham rituals.",
      colors: ["#FFA000", "#3E2723", "#0D47A1", "#ECEFF1"],
      colorNames: ["Sunset Amber", "Espresso Shadow", "Twilight Navy", "Pure Linen"],
      materials: ["4K Cinema LUTs", "Anamorphic Lenses", "Ambient Flame", "Warm Tungsten Glow"],
      category: "Photography & Cinematography",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "mb-5",
      title: "Heritage South Indian Bridal Makeup",
      description: "Timeless temple bridal aesthetic with warm golden undertones, winged kohl eyes, and traditional Lakshmi coin jewelry styling.",
      colors: ["#C2185B", "#FFD700", "#880E4F", "#FFF8E1"],
      colorNames: ["Ruby Vermilion", "24K Gold", "Deep Maroon", "Ivory Silk"],
      materials: ["MAC Studio HD", "Fresh Jasmine Veni", "Pure Gold Foil", "Kohl & Kumkum"],
      category: "Makeup & Hair Styling",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const matched = allMb.filter((mb) => matchesVendorRole(mb.category, roles));
  return matched.length > 0 ? matched : allMb.slice(0, 3);
}

export default function Portfolio() {
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const vp = user.vendorProfile || {};
  const vendorCategories: string[] =
    vp.categories && vp.categories.length > 0
      ? vp.categories
      : vp.category
      ? [vp.category]
      : ["Catering & Feasts", "Stage & Mandap Decorators"];

  const vendorKey = (user.name || "default_vendor").toLowerCase().replace(/\s+/g, "_");

  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    try {
      const stored = localStorage.getItem(`eventos_vendor_portfolio_${vendorKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // Combine previous works from real bookings + role-calibrated case studies
    const previousWorks = getPreviousWorksFromBookings(user, vendorCategories);
    const defaultRoleProjects = getDefaultProjectsForRoles(vendorCategories, vp.city || "Palakkad");

    // Deduplicate by title
    const seen = new Set<string>();
    const combined = [...previousWorks, ...defaultRoleProjects].filter((p) => {
      const k = (p.title || "").toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    return combined;
  });

  const [selectedEventType, setSelectedEventType] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"projects" | "before_after" | "moodboards">("projects");

  // Before & After Interactive Slider State
  const [beforeAfterSliderPos, setBeforeAfterSliderPos] = useState<number>(50);
  const [selectedBAProject, setSelectedBAProject] = useState<PortfolioProject>(() => {
    return projects.find((p) => p.beforeImage && p.afterImage) || projects[0];
  });

  // Modal State for Adding/Editing Project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState(vendorCategories[0] || "Catering & Feasts");
  const [formEventType, setFormEventType] = useState<PortfolioProject["eventType"]>("Royal Wedding");
  const [formVenue, setFormVenue] = useState("");
  const [formCity, setFormCity] = useState(vp.city || "Palakkad");
  const [formDate, setFormDate] = useState("February 2026");
  const [formGuestScale, setFormGuestScale] = useState("1,000 Guests");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formBeforeImage, setFormBeforeImage] = useState("");
  const [formAfterImage, setFormAfterImage] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formClientNames, setFormClientNames] = useState("");
  const [formClientQuote, setFormClientQuote] = useState("");
  const [formHighlights, setFormHighlights] = useState("");
  const [uploadModeHero, setUploadModeHero] = useState<"file" | "url">("file");

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Please select a photo under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormHeroImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBeforeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Please select a photo under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormBeforeImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAfterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Please select a photo under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormAfterImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Lightbox / Detail View Modal State
  const [selectedDetailProject, setSelectedDetailProject] = useState<PortfolioProject | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const moodboards = getMoodboardsForRoles(vendorCategories);

  useEffect(() => {
    const handleUserChange = () => {
      const u = getStoredUser();
      setUser(u);
    };
    window.addEventListener("eventos_user_changed", handleUserChange);
    window.addEventListener("eventos_bookings_changed", () => {
      const u = getStoredUser();
      const updatedPrev = getPreviousWorksFromBookings(u, vendorCategories);
      setProjects((current) => {
        const customAdded = current.filter((p) => !p.isFromBooking);
        const seen = new Set<string>();
        return [...updatedPrev, ...customAdded].filter((p) => {
          const k = (p.title || "").toLowerCase();
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      });
    });

    return () => {
      window.removeEventListener("eventos_user_changed", handleUserChange);
      window.removeEventListener("eventos_bookings_changed", handleUserChange);
    };
  }, [vendorCategories]);

  const saveProjectsToStorage = (updated: PortfolioProject[]) => {
    setProjects(updated);
    localStorage.setItem(`eventos_vendor_portfolio_${vendorKey}`, JSON.stringify(updated));
  };

  const handleOpenAddModal = () => {
    setEditingProjectId(null);
    setFormTitle("");
    setFormCategory(vendorCategories[0] || "Catering & Feasts");
    setFormEventType("Royal Wedding");
    setFormVenue(`${vp.city || "Palakkad"} Heritage Convention Hall`);
    setFormCity(vp.city || "Palakkad");
    setFormDate("February 2026");
    setFormGuestScale("600 Guests");
    setFormHeroImage("");
    setFormBeforeImage("");
    setFormAfterImage("");
    setUploadModeHero("file");
    setFormBadge("⭐ Verified Case Study");
    setFormSummary("Grand custom celebration execution delivered with certified craftsmanship and flawless timing.");
    setFormClientNames("");
    setFormClientQuote("");
    setFormHighlights("Custom tailored service execution\nStrict timeline adherence & on-site supervisor\n100% Client satisfaction guarantee");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: PortfolioProject) => {
    setEditingProjectId(proj.id);
    setFormTitle(proj.title);
    setFormCategory(proj.category);
    setFormEventType(proj.eventType);
    setFormVenue(proj.venue);
    setFormCity(proj.city);
    setFormDate(proj.date);
    setFormGuestScale(proj.guestScale);
    setFormHeroImage(proj.heroImage);
    setFormBeforeImage(proj.beforeImage || "");
    setFormAfterImage(proj.afterImage || "");
    setFormBadge(proj.badge || "");
    setFormSummary(proj.summary);
    setFormClientNames(proj.clientNames || "");
    setFormClientQuote(proj.clientQuote || "");
    setFormHighlights(proj.highlights.join("\n"));
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const hlList = formHighlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProjectId) {
      const updated = projects.map((p) => {
        if (p.id === editingProjectId) {
          return {
            ...p,
            title: formTitle.trim(),
            category: formCategory,
            eventType: formEventType,
            venue: formVenue.trim(),
            city: formCity.trim(),
            date: formDate.trim(),
            guestScale: formGuestScale.trim(),
            heroImage: formHeroImage.trim() || p.heroImage,
            beforeImage: formBeforeImage.trim() || undefined,
            afterImage: formAfterImage.trim() || undefined,
            badge: formBadge.trim() || undefined,
            summary: formSummary.trim(),
            clientNames: formClientNames.trim() || undefined,
            clientQuote: formClientQuote.trim() || undefined,
            highlights: hlList.length > 0 ? hlList : p.highlights,
          };
        }
        return p;
      });
      saveProjectsToStorage(updated);
    } else {
      const newProj: PortfolioProject = {
        id: `proj-${Date.now()}`,
        title: formTitle.trim() || "Signature Celebration Work",
        category: formCategory,
        eventType: formEventType,
        venue: formVenue.trim() || `${vp.city || "Heritage"} Convention Center`,
        city: formCity.trim() || vp.city || "Palakkad",
        date: formDate.trim() || "2026",
        guestScale: formGuestScale.trim() || "500 Guests",
        heroImage:
          formHeroImage.trim() ||
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        beforeImage: formBeforeImage.trim() || undefined,
        afterImage: formAfterImage.trim() || undefined,
        badge: formBadge.trim() || undefined,
        summary: formSummary.trim() || "Grand celebration execution.",
        clientNames: formClientNames.trim() || undefined,
        clientQuote: formClientQuote.trim() || undefined,
        highlights: hlList.length > 0 ? hlList : ["Custom artisanal execution", "On-time delivery", "5-Star Rating"],
        colorPalette: ["#D4AF37", "#800020", "#FFFDD0", "#046307"],
        featured: false,
      };
      saveProjectsToStorage([newProj, ...projects]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to remove this case study from your portfolio?")) {
      const updated = projects.filter((p) => p.id !== id);
      saveProjectsToStorage(updated);
    }
  };

  const handleShareProject = (proj: PortfolioProject, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareText = `🌟 *${proj.title}*
📍 Venue: ${proj.venue}, ${proj.city}
👥 Scale: ${proj.guestScale} (${proj.eventType})
✨ Key Highlights:
${proj.highlights.map((h) => `• ${h}`).join("\n")}
💬 Client Review: "${proj.clientQuote || "Spectacular execution!"}"
_Executed by ${user.name || "EventOS Partner"} (${proj.category})._`;

    navigator.clipboard.writeText(shareText);
    setCopiedShareId(proj.id);
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  // AI Auto-Fill Helper for Project Modal
  const handleAIGenerateProject = () => {
    if (formCategory.toLowerCase().includes("cater")) {
      setFormTitle("Grand 24-Course Traditional Sadhya Feast");
      setFormVenue("Sri Krishna Heritage Convention Center");
      setFormCity(vp.city || "Palakkad");
      setFormGuestScale("1,500 Guests");
      setFormSummary("Seamless authentic banana leaf sadhya feast serving 1,500 guests with 3 artisanal payasams and pure cold-pressed coconut oil curries.");
      setFormClientNames("Narayanan & Shreya");
      setFormClientQuote("The food was the biggest highlight of our wedding. All 1,500 guests loved the Ada Pradhaman!");
      setFormHighlights("24 Traditional Sadhya curries & live payasam bar\nUniformed 35-member traditional serving staff\nZero food waste management");
      setFormBadge("👑 1,500 Guests Served");
    } else if (formCategory.toLowerCase().includes("decor")) {
      setFormTitle("The Golden Lotus Mandap & Amber Deepam Walkway");
      setFormVenue("The Leela Palace Heritage Lawn");
      setFormCity(vp.city || "Chennai");
      setFormGuestScale("1,200 Guests");
      setFormSummary("Grand 40ft carved gold temple mandap draped with fresh lotus flowers, cascading jasmine garlands, and 108 brass deepams.");
      setFormClientNames("Aditya & Meenakshi");
      setFormClientQuote("Our mandap was a dream come true. It felt like stepping into an ancient temple sanctum!");
      setFormHighlights("4,000 Fresh lotus stems & jasmine ropes\n108 Hand-polished brass deepam water features\nCompleted in 5.5 hours overnight");
      setFormBadge("🏆 Best Decor 2025");
    } else if (formCategory.toLowerCase().includes("photo")) {
      setFormTitle("4K Lakeview Muhurtham Story & Candid Master");
      setFormVenue("Bolgatty Palace Resort");
      setFormCity(vp.city || "Kochi");
      setFormGuestScale("600 Guests");
      setFormSummary("High-definition cinematic coverage capturing sunset drone perspectives, spontaneous family emotions, and couple memories.");
      setFormClientNames("Gautham & Nithya");
      setFormClientQuote("The drone Muhurtham video brought tears to our eyes. Pure cinematic brilliance!");
      setFormHighlights("Dual 4K cinema cameras + aerial drone shoot\nSame-day 60-second social media teaser\n100-Page luxury embossed silk album");
      setFormBadge("🎬 4K Master Coverage");
    } else {
      setFormTitle("Signature Celebration Execution");
      setFormVenue("Heritage Gateway Ballrooms");
      setFormCity(vp.city || "Palakkad");
      setFormGuestScale("800 Guests");
      setFormSummary("Precision execution delivered with state-of-the-art expertise and client satisfaction.");
      setFormClientNames("Vivek & Rashmi");
      setFormClientQuote("Absolute professionals who made our dream celebration effortless!");
      setFormHighlights("Custom tailored service execution\nFull team coordination and standby backup\n5.0 Star verified client rating");
      setFormBadge("⭐ Signature Project");
    }
  };

  // Filtered Project List
  const filteredProjects = projects.filter((p) => {
    const matchEvent = selectedEventType === "All" || p.eventType === selectedEventType;
    const matchCat = selectedCategory === "All" || matchesVendorRole(p.category, [selectedCategory]);
    return matchEvent && matchCat;
  });

  const baProjects = projects.filter((p) => p.beforeImage && p.afterImage);
  const previousWorksCount = projects.filter((p) => p.isFromBooking).length;

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main vendor-dashboard-layout">
        <Header placeholder="Search portfolio projects, venues, styles..." />

        {/* Portfolio Page Top Welcome & Action Header */}
        <div className="vendor-welcome-header">
          <span className="eyebrow dark">SHOWCASE & PREVIOUS WORKS</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                <h1 style={{ margin: 0 }}>Visual Portfolio & Verified Works 📸✨</h1>
                {vendorCategories.map((cat) => (
                  <span key={cat} style={{ fontSize: "11px", fontWeight: 700, background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
                    {cat}
                  </span>
                ))}
              </div>
              <p style={{ margin: 0 }}>
                Tailored showcase for <strong>{user.name || "Vendor Partner"}</strong> in <strong>{vp.city || "your region"}</strong> with verified past celebration records.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
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
                <span>Add Case Study</span>
              </button>
            </div>
          </div>
        </div>

        {/* Industry Awards & Verified Trust Bar */}
        <section
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#ffffff",
            borderRadius: "16px",
            padding: "18px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            border: "1px solid #334155",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.35)",
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "15px", color: "#f8fafc" }}>
                  {user.name || "Master Vendor"} Official Portfolio
                </strong>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#059669", color: "#ffffff", padding: "2px 8px", borderRadius: "20px" }}>
                  ★ {vp.rating || 4.9} RATED
                </span>
                {previousWorksCount > 0 && (
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#2563eb", color: "#ffffff", padding: "2px 8px", borderRadius: "20px" }}>
                    {previousWorksCount} PREVIOUS BOOKINGS
                  </span>
                )}
              </div>
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#94a3b8" }}>
                Specialized in <strong>{vendorCategories.join(" & ")}</strong> with {vp.experienceYears || "8+"} years of celebratory excellence.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }}>
              <ShieldCheck size={15} color="#10b981" />
              <span>Safety & Quality Verified</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }}>
              <Heart size={15} color="#f43f5e" />
              <span>100% Client Love</span>
            </div>
          </div>
        </section>

        {/* View Mode Navigation Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", background: "#f1f5f9", padding: "4px", borderRadius: "12px", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: activeTab === "projects" ? 700 : 500,
                border: "none",
                background: activeTab === "projects" ? "#ffffff" : "transparent",
                color: activeTab === "projects" ? "#0f172a" : "#64748b",
                boxShadow: activeTab === "projects" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <FolderOpen size={15} />
              <span>Role Works & Case Studies ({projects.length})</span>
            </button>

            {baProjects.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("before_after")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: activeTab === "before_after" ? 700 : 500,
                  border: "none",
                  background: activeTab === "before_after" ? "#ffffff" : "transparent",
                  color: activeTab === "before_after" ? "#0f172a" : "#64748b",
                  boxShadow: activeTab === "before_after" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Sliders size={15} />
                <span>Before & After Transformations ({baProjects.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("moodboards")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: activeTab === "moodboards" ? 700 : 500,
                border: "none",
                background: activeTab === "moodboards" ? "#ffffff" : "transparent",
                color: activeTab === "moodboards" ? "#0f172a" : "#64748b",
                boxShadow: activeTab === "moodboards" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <Palette size={15} />
              <span>Role Lookbooks & Palettes ({moodboards.length})</span>
            </button>
          </div>

          {/* Event & Category Filter Pills */}
          {activeTab === "projects" && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["All", ...vendorCategories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      border: selectedCategory === cat ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                      background: selectedCategory === cat ? "#eff6ff" : "#ffffff",
                      color: selectedCategory === cat ? "#1d4ed8" : "#475569",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ width: "1px", height: "20px", background: "#cbd5e1" }} />

              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["All", "Royal Wedding", "Traditional Muhurtham", "Sangeet & Cocktail", "Grand Reception"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedEventType(type)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "11.5px",
                      fontWeight: selectedEventType === type ? 700 : 500,
                      border: selectedEventType === type ? "1.5px solid #059669" : "1px solid #e2e8f0",
                      background: selectedEventType === type ? "#ecfdf5" : "#ffffff",
                      color: selectedEventType === type ? "#059669" : "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── TAB 1: ROLE-CALIBRATED CASE STUDIES & PREVIOUS WORKS ─── */}
        {activeTab === "projects" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "22px" }}>
            {filteredProjects.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "60px 20px", textAlign: "center", background: "#ffffff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                <Camera size={44} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>No case studies in this category</h3>
                <p style={{ margin: "6px 0 16px", fontSize: "13px", color: "#64748b" }}>
                  Add a new project case study tailored for your {vendorCategories.join(" & ")} services.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  style={{ padding: "9px 20px", borderRadius: "8px", background: "#2563eb", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Create Case Study
                </button>
              </div>
            ) : (
              filteredProjects.map((proj) => {
                const isCopied = copiedShareId === proj.id;
                return (
                  <div
                    key={proj.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: proj.isFromBooking ? "1.5px solid #93c5fd" : "1px solid #e2e8f0",
                      boxShadow: proj.isFromBooking ? "0 4px 18px rgba(37, 99, 235, 0.08)" : "0 4px 14px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {/* Hero Image Container */}
                    <div style={{ position: "relative", height: "210px", width: "100%", overflow: "hidden", background: "#0f172a" }}>
                      <img
                        src={proj.heroImage}
                        alt={proj.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s",
                        }}
                      />
                      {/* Top Badges */}
                      <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(15, 23, 42, 0.8)", color: "#ffffff", backdropFilter: "blur(4px)", padding: "3px 8px", borderRadius: "6px" }}>
                          {proj.eventType}
                        </span>
                        {proj.badge && (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              background: proj.isFromBooking ? "#2563eb" : "#f59e0b",
                              color: proj.isFromBooking ? "#ffffff" : "#000000",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {proj.isFromBooking && <Briefcase size={11} />}
                            {proj.badge}
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Overlay with Venue */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          insetInline: 0,
                          padding: "24px 14px 10px",
                          background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.0))",
                          color: "#ffffff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <span style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", color: "#cbd5e1" }}>
                          <MapPin size={13} color="#f59e0b" /> {proj.venue}, {proj.city}
                        </span>
                        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                          {proj.date}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                        <div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {proj.category}
                          </span>
                          <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "#0f172a", fontWeight: 700, lineHeight: 1.3 }}>
                            {proj.title}
                          </h3>
                        </div>
                      </div>

                      <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 14px", lineHeight: 1.45 }}>
                        {proj.summary}
                      </p>

                      {/* Highlights bullets */}
                      <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px", marginBottom: "14px", border: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                          Verified Execution Highlights:
                        </span>
                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: "#334155", display: "flex", flexDirection: "column", gap: "3px" }}>
                          {proj.highlights.slice(0, 2).map((hl, i) => (
                            <li key={i}>{hl}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Client Testimonial Quote */}
                      {proj.clientQuote && (
                        <div style={{ padding: "10px 12px", borderLeft: "3px solid #f59e0b", background: "#fffbeb", borderRadius: "0 8px 8px 0", marginBottom: "16px", fontSize: "12px", color: "#78350f", fontStyle: "italic" }}>
                          "{proj.clientQuote}"
                          {proj.clientNames && <strong style={{ display: "block", marginTop: "3px", fontStyle: "normal", color: "#92400e", fontSize: "11px" }}>— {proj.clientNames}</strong>}
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Users size={13} /> {proj.guestScale}
                        </span>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedDetailProject(proj)}
                            title="View Full Case Study"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              background: "#ffffff",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#0f172a",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Eye size={13} /> View
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleShareProject(proj, e)}
                            title="Copy Shareable Case Study Summary"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: isCopied ? "1px solid #10b981" : "1px solid #cbd5e1",
                              background: isCopied ? "#ecfdf5" : "#ffffff",
                              color: isCopied ? "#059669" : "#475569",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {isCopied ? <Check size={13} /> : <Share2 size={13} />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(proj)}
                            title="Edit Project"
                            style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", color: "#2563eb" }}
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            title="Delete Project"
                            style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", color: "#dc2626" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── TAB 2: INTERACTIVE BEFORE & AFTER TRANSFORMATION ─── */}
        {activeTab === "before_after" && baProjects.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", alignItems: "start" }}>
            {/* Left: Interactive Before & After Visual Slider */}
            <div style={{ background: "#ffffff", borderRadius: "18px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                    {selectedBAProject?.title || "Transformation Story"}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    📍 {selectedBAProject?.venue}, {selectedBAProject?.city}
                  </span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "3px 10px", borderRadius: "20px" }}>
                  SLIDE TO COMPARE
                </span>
              </div>

              {/* Slider View Container */}
              <div
                style={{
                  position: "relative",
                  height: "380px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  userSelect: "none",
                  border: "1px solid #cbd5e1",
                  background: "#0f172a",
                }}
              >
                {/* AFTER IMAGE (Full width behind) */}
                <img
                  src={selectedBAProject?.afterImage || selectedBAProject?.heroImage}
                  alt="After Setup"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(0,0,0,0.75)", color: "#ffffff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                  ✨ FINAL DELIVERED SETUP
                </div>

                {/* BEFORE IMAGE (Clipped with width %) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${beforeAfterSliderPos}%`,
                    overflow: "hidden",
                    borderRight: "3px solid #ffffff",
                    boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
                  }}
                >
                  <img
                    src={selectedBAProject?.beforeImage || "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"}
                    alt="Before Setup"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                      maxWidth: "none",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.75)", color: "#ffffff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                    🏚️ BARE VENUE BEFORE
                  </div>
                </div>

                {/* Center Handle */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${beforeAfterSliderPos}%`,
                    transform: "translate(-50%, -50%)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "ew-resize",
                    pointerEvents: "none",
                  }}
                >
                  <Sliders size={18} color="#2563eb" />
                </div>
              </div>

              {/* Slider Control input */}
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                  <span>◀ Drag left for Final Setup</span>
                  <span>Drag right for Bare Space ▶</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={beforeAfterSliderPos}
                  onChange={(e) => setBeforeAfterSliderPos(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#2563eb" }}
                />
              </div>
            </div>

            {/* Right: Select Transformation Project */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "18px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#0f172a" }}>
                  Your Role Transformations
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {baProjects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedBAProject(p)}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: selectedBAProject?.id === p.id ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                        background: selectedBAProject?.id === p.id ? "#eff6ff" : "#ffffff",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={p.afterImage || p.heroImage}
                        alt=""
                        style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: "13px", color: "#0f172a", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.title}
                        </strong>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                          {p.venue} · {p.guestScale}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transformation Metrics */}
              <div style={{ background: "linear-gradient(135deg, #eff6ff, #f8fafc)", borderRadius: "14px", padding: "16px", border: "1px solid #bfdbfe" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <Sparkles size={16} color="#2563eb" />
                  <strong style={{ fontSize: "13px", color: "#1e40af" }}>Client Conversion Impact</strong>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#334155", lineHeight: 1.45 }}>
                  Real before & after proof of work boosts client inquiries by <strong>4.8x</strong> for wedding organizers in {vp.city || "your region"}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: AESTHETIC LOOKBOOKS & COLOR PALETTES ─── */}
        {activeTab === "moodboards" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "22px" }}>
            {moodboards.map((mb) => (
              <div
                key={mb.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: "180px", width: "100%", overflow: "hidden", position: "relative" }}>
                  <img
                    src={mb.image}
                    alt={mb.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(15, 23, 42, 0.8)", color: "#ffffff", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px" }}>
                    {mb.category}
                  </div>
                </div>

                <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#0f172a", fontWeight: 700 }}>
                    {mb.title}
                  </h3>
                  <p style={{ margin: "0 0 14px", fontSize: "12.5px", color: "#475569", lineHeight: 1.45 }}>
                    {mb.description}
                  </p>

                  {/* Color Palette Swatches */}
                  <div style={{ marginBottom: "14px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                      Curated Color Swatches:
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {mb.colors.map((c, i) => (
                        <div key={i} style={{ flex: 1, textAlign: "center" }}>
                          <div
                            style={{
                              height: "28px",
                              borderRadius: "6px",
                              background: c,
                              border: "1px solid rgba(0,0,0,0.1)",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                              marginBottom: "3px",
                            }}
                          />
                          <span style={{ fontSize: "10px", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {mb.colorNames[i] || c}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materials List */}
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px", marginTop: "auto", border: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Key Craft Materials & Elements:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {mb.materials.map((mat, i) => (
                        <span key={i} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", padding: "2px 7px", borderRadius: "4px", color: "#334155" }}>
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─── FULLSCREEN CASE STUDY LIGHTBOX / MODAL ─── */}
      {selectedDetailProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(6px)",
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
              borderRadius: "20px",
              maxWidth: "720px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Modal Image Header */}
            <div style={{ position: "relative", height: "260px", width: "100%", background: "#0f172a" }}>
              <img
                src={selectedDetailProject.heroImage}
                alt={selectedDetailProject.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => setSelectedDetailProject(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "rgba(15, 23, 42, 0.75)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: "absolute", bottom: "14px", left: "16px", display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#2563eb", color: "#ffffff", padding: "3px 10px", borderRadius: "6px" }}>
                  {selectedDetailProject.eventType}
                </span>
                {selectedDetailProject.badge && (
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#f59e0b", color: "#000000", padding: "3px 10px", borderRadius: "6px" }}>
                    {selectedDetailProject.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{selectedDetailProject.category}</span>
                  <h2 style={{ margin: "2px 0 0", fontSize: "20px", color: "#0f172a" }}>{selectedDetailProject.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleShareProject(selectedDetailProject, e)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {copiedShareId === selectedDetailProject.id ? (
                    <>
                      <Check size={14} color="#10b981" />
                      <span style={{ color: "#059669" }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={14} />
                      <span>Share Story</span>
                    </>
                  )}
                </button>
              </div>

              {/* Venue & Scale Strip */}
              <div style={{ display: "flex", gap: "16px", padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", color: "#475569", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={14} color="#2563eb" /> {selectedDetailProject.venue}, {selectedDetailProject.city}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Users size={14} color="#2563eb" /> {selectedDetailProject.guestScale}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={14} color="#2563eb" /> {selectedDetailProject.date}
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ margin: "0 0 6px", fontSize: "14px", color: "#0f172a" }}>Project Overview & Client Brief</h4>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: 1.5 }}>
                  {selectedDetailProject.summary}
                </p>
              </div>

              {/* Full Highlights */}
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#0f172a" }}>Deliverables & Execution Highlights</h4>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", display: "flex", flexDirection: "column", gap: "5px" }}>
                  {selectedDetailProject.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>

              {/* Client Quote */}
              {selectedDetailProject.clientQuote && (
                <div style={{ padding: "14px 16px", borderLeft: "4px solid #f59e0b", background: "#fffbeb", borderRadius: "0 10px 10px 0", marginBottom: "16px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#78350f", fontStyle: "italic" }}>
                    "{selectedDetailProject.clientQuote}"
                  </p>
                  {selectedDetailProject.clientNames && (
                    <strong style={{ display: "block", marginTop: "4px", fontSize: "12px", color: "#92400e" }}>
                      — {selectedDetailProject.clientNames}
                    </strong>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setSelectedDetailProject(null)}
                  style={{ padding: "8px 20px", borderRadius: "8px", background: "#2563eb", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Close Case Study
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD / EDIT CASE STUDY MODAL ─── */}
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
              maxWidth: "580px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Camera size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                  {editingProjectId ? "Edit Portfolio Case Study" : "Create New Case Study"}
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

            <form onSubmit={handleSaveProject} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                    Project Title
                  </label>
                  <button
                    type="button"
                    onClick={handleAIGenerateProject}
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
                    <Sparkles size={12} /> Auto-fill with AI
                  </button>
                </div>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. The Royal Lotus Mandap at Leela Palace"
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
                    Event Type
                  </label>
                  <select
                    value={formEventType}
                    onChange={(e) => setFormEventType(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="Royal Wedding">Royal Wedding</option>
                    <option value="Traditional Muhurtham">Traditional Muhurtham</option>
                    <option value="Sangeet & Cocktail">Sangeet & Cocktail</option>
                    <option value="Grand Reception">Grand Reception</option>
                    <option value="Intimate Engagement">Intimate Engagement</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. The Leela Palace"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    City & Guest Scale
                  </label>
                  <input
                    type="text"
                    value={formGuestScale}
                    onChange={(e) => setFormGuestScale(e.target.value)}
                    placeholder="e.g. 1,200 Guests"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                    required
                  />
                </div>
              </div>

              {/* Hero Showcase Photo Upload Section */}
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                    Hero Showcase Photo (Main Cover) *
                  </label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      type="button"
                      onClick={() => setUploadModeHero("file")}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: uploadModeHero === "file" ? 700 : 500,
                        border: uploadModeHero === "file" ? "1px solid #2563eb" : "1px solid #cbd5e1",
                        background: uploadModeHero === "file" ? "#eff6ff" : "#ffffff",
                        color: uploadModeHero === "file" ? "#1d4ed8" : "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      📷 Upload from Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadModeHero("url")}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: uploadModeHero === "url" ? 700 : 500,
                        border: uploadModeHero === "url" ? "1px solid #2563eb" : "1px solid #cbd5e1",
                        background: uploadModeHero === "url" ? "#eff6ff" : "#ffffff",
                        color: uploadModeHero === "url" ? "#1d4ed8" : "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      🔗 Paste URL
                    </button>
                  </div>
                </div>

                {uploadModeHero === "file" ? (
                  <div>
                    {formHeroImage ? (
                      <div style={{ position: "relative", height: "150px", borderRadius: "10px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                        <img src={formHeroImage} alt="Hero Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                          <label
                            htmlFor="hero-file-upload-input"
                            style={{
                              background: "rgba(15, 23, 42, 0.85)",
                              color: "#ffffff",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <UploadCloud size={13} /> Change Photo
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormHeroImage("")}
                            style={{
                              background: "rgba(220, 38, 38, 0.85)",
                              color: "#ffffff",
                              border: "none",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="hero-file-upload-input"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "24px 16px",
                          borderRadius: "10px",
                          border: "2px dashed #93c5fd",
                          background: "#ffffff",
                          cursor: "pointer",
                          textAlign: "center",
                          gap: "6px",
                        }}
                      >
                        <UploadCloud size={28} color="#2563eb" />
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e40af" }}>
                          Click to choose a celebration photo from your device
                        </span>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                          Supports JPG, PNG, WEBP (Camera photos or gallery)
                        </span>
                      </label>
                    )}
                    <input
                      id="hero-file-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={formHeroImage}
                      onChange={(e) => setFormHeroImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#ffffff" }}
                      required
                    />
                    {formHeroImage && (
                      <div style={{ marginTop: "8px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                        <img src={formHeroImage} alt="Hero Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Before & After Photos Device Upload Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Before Photo */}
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#334155" }}>
                      Before Setup Photo
                    </label>
                    {formBeforeImage && (
                      <button
                        type="button"
                        onClick={() => setFormBeforeImage("")}
                        style={{ background: "none", border: "none", color: "#dc2626", fontSize: "11px", cursor: "pointer" }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  {formBeforeImage ? (
                    <div style={{ height: "90px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1", position: "relative" }}>
                      <img src={formBeforeImage} alt="Before Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <label
                      htmlFor="before-file-upload-input"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px 10px",
                        borderRadius: "8px",
                        border: "1.5px dashed #cbd5e1",
                        background: "#ffffff",
                        cursor: "pointer",
                        textAlign: "center",
                        gap: "4px",
                      }}
                    >
                      <Camera size={18} color="#64748b" />
                      <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#475569" }}>
                        Upload Bare Venue
                      </span>
                    </label>
                  )}
                  <input
                    id="before-file-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleBeforeFileUpload}
                    style={{ display: "none" }}
                  />
                </div>

                {/* After Photo */}
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#334155" }}>
                      After Setup Photo
                    </label>
                    {formAfterImage && (
                      <button
                        type="button"
                        onClick={() => setFormAfterImage("")}
                        style={{ background: "none", border: "none", color: "#dc2626", fontSize: "11px", cursor: "pointer" }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  {formAfterImage ? (
                    <div style={{ height: "90px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1", position: "relative" }}>
                      <img src={formAfterImage} alt="After Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <label
                      htmlFor="after-file-upload-input"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px 10px",
                        borderRadius: "8px",
                        border: "1.5px dashed #cbd5e1",
                        background: "#ffffff",
                        cursor: "pointer",
                        textAlign: "center",
                        gap: "4px",
                      }}
                    >
                      <Sparkles size={18} color="#2563eb" />
                      <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#2563eb" }}>
                        Upload Final Setup
                      </span>
                    </label>
                  )}
                  <input
                    id="after-file-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAfterFileUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Project Summary & Story
                </label>
                <textarea
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  rows={2}
                  placeholder="Brief description of the transformation and execution..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Key Deliverables / Highlights (One per line)
                </label>
                <textarea
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                  rows={3}
                  placeholder="Enter highlights, one per line..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Client Names (Optional)
                  </label>
                  <input
                    type="text"
                    value={formClientNames}
                    onChange={(e) => setFormClientNames(e.target.value)}
                    placeholder="e.g. Arun & Deepa"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Client Review Quote (Optional)
                  </label>
                  <input
                    type="text"
                    value={formClientQuote}
                    onChange={(e) => setFormClientQuote(e.target.value)}
                    placeholder="e.g. The execution was breathtaking!"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
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
                  {editingProjectId ? "Save Changes" : "Publish Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
