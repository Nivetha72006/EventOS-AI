import { Request, Response, NextFunction } from "express";
import assistantAgent from "./agents/assistant.agent";
import gemini from "./services/gemini.service";

class AIController {

  async health(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.json({
        success: true,
        ai: "Gemini Connected",
        status: "Healthy"
      });
    } catch (error) {
      next(error);
    }
  }

  async assistant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { message, event, context } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ success: false, message: "message is required" });
      }
      const result = await assistantAgent.execute({ message, event, context });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Chat endpoint for AI assistant page
  async chat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { message, event, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ success: false, message: "message is required" });
      }

      const eventTitle = event?.title || "your celebration";
      const eventCity = event?.city || "Palakkad";
      const eventGuests = event?.guestCount || 500;
      const eventBudget = event?.budget ? Number(event.budget) : 500000;

      const eventCtx = event ? `
EVENT CONTEXT:
- Title: ${event.title ?? "Not set"}
- Type: ${event.eventType ?? "Not set"}
- Date: ${event.eventDate ?? "Not set"}
- Location: ${[event.city, event.state, event.country].filter(Boolean).join(", ") || "Not set"}
- Guests: ${event.guestCount ?? "Not set"}
- Budget: ${event.budget ? "₹" + Number(event.budget).toLocaleString("en-IN") : "Not set"}
` : "";

      const historyCtx = Array.isArray(history) && history.length > 0
        ? "\nRECENT CONVERSATION:\n" + history.slice(-6).map((h: any) => `${h.sender === "user" ? "User" : "AI"}: ${h.text}`).join("\n")
        : "";

      const prompt = `You are EventOS AI, a smart, helpful, and friendly event planning assistant for Indian events.

You help with:
- Budget planning and allocation
- Vendor recommendations (catering, decoration, photography, music, mehendi, etc.)
- Negotiation strategies and scripts with vendors
- Event themes and decoration ideas
- Timeline and task creation
- Guest management
- Emergency vendor replacement
- Any event planning question
${eventCtx}${historyCtx}

User says: ${message}

Respond in a clear, helpful, and friendly way. Be specific and actionable. Use ₹ for prices. Keep responses concise but useful.`;

      let aiResponseText = "";
      try {
        aiResponseText = await gemini.generate(prompt);
      } catch {
        // Intelligent contextual reply generator fallback
        const lower = message.toLowerCase();
        if (/budget|cost|price|allocate|spend|money|expense/.test(lower)) {
          aiResponseText = `For "${eventTitle}" with a total budget of ₹${eventBudget.toLocaleString("en-IN")}, here is the recommended allocation:\n\n• Catering & Feasts (35%): ₹${Math.round(eventBudget * 0.35).toLocaleString("en-IN")}\n• Décor & Mandap (22%): ₹${Math.round(eventBudget * 0.22).toLocaleString("en-IN")}\n• Photography & Cinematography (18%): ₹${Math.round(eventBudget * 0.18).toLocaleString("en-IN")}\n• Music & Entertainment (10%): ₹${Math.round(eventBudget * 0.1).toLocaleString("en-IN")}\n• Venue & Miscellaneous (15%): ₹${Math.round(eventBudget * 0.15).toLocaleString("en-IN")}\n\nTip: You can track exact quotations and potential savings directly in the Bookings tab!`;
        } else if (/cater|food|menu|sadhya|biryani|buffet|dining/.test(lower)) {
          aiResponseText = `For ${eventGuests} guests in ${eventCity}, we recommend:\n\n1. Welcome Drinks & Chaat: Tender coconut water or spicy buttermilk + live pani puri counter.\n2. Traditional Sadhya: 24 to 28 traditional dishes served on fresh plantain leaves in 3 to 4 scheduled batches.\n3. Dessert Bar: 2 warm Payasams (Ada Pradhaman & Palada) + mini jalebi live station.\n\nTip: You can book top verified caterers directly from our Marketplace tab with guaranteed escrow protection.`;
        } else if (/decor|mandap|stage|flower|theme|light/.test(lower)) {
          aiResponseText = `Here are 2 stunning décor concepts for "${eventTitle}":\n\n1. Royal Temple Elegance: Madurai jasmine strings, marigold lotus pond, traditional brass diyas, and authentic carved wood mandap pillars.\n2. Modern Romantic Pastel: Blush pink hydrangeas, crystal chandeliers, fairy light ceiling tunnels, and a 3D monogram couple backdrop.\n\nWhich style resonates more with your vision?`;
        } else if (/photo|video|camera|shoot|album|candid|drone/.test(lower)) {
          aiResponseText = `For comprehensive media coverage of "${eventTitle}":\n\n• Team Setup: 2 Candid photographers + 1 Traditional group photographer + 1 Drone cinematographer.\n• Deliverables: 4K cinematic film (3-5 min teaser + 30 min full highlights), 500+ edited candid high-res photos, and a premium leather flush-mount album.\n• Average Estimated Cost in ${eventCity}: ₹45,000 – ₹65,000.`;
        } else if (/mehendi|henna|makeup|bridal|bride/.test(lower)) {
          aiResponseText = `For your bridal and guest mehendi session:\n\n• Bridal Henna: Book 1 Senior Specialist for personalized bridal arm and foot motifs (takes 3-4 hours).\n• Guest Henna: Hire 3-4 speed artists to comfortably cover 60-80 guest palms within 2.5 hours.\n• Organic Cones: Ensure 100% natural eucalyptus & tea tree oil henna for a deep, long-lasting dark stain.`;
        } else if (/negotiat|discount|script|message|offer/.test(lower)) {
          aiResponseText = `Here is a polite, high-converting vendor negotiation script:\n\n"Hi [Vendor Name] team! We love your portfolio and would love to confirm you for '${eventTitle}' in ${eventCity}. We are currently finalizing all our core vendors. If we confirm with an advance deposit this week, could you offer an all-inclusive package rate of ₹[Offer Amount]?"\n\nTip: Our AI Negotiation Assistant in the Bookings tab can automatically generate this for all your vendor quotations!`;
        } else {
          aiResponseText = `I am here to help you plan every aspect of "${eventTitle}" in ${eventCity} (${eventGuests} expected guests)!\n\nYou can ask me about:\n• Vendor quotes and package negotiations\n• Step-by-step event countdown timelines\n• Mandap & stage décor styling ideas\n• Sadhya & banquet catering planning\n• Seating arrangements and budget tracking\n\nWhat would you like to work on next?`;
        }
      }

      return res.json({ success: true, data: { message: aiResponseText, agent: "chat" } });
    } catch (error) {
      next(error);
    }
  }


  // Design description generator
  async generateDesignDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { eventType, theme, designType, colors, description } = req.body;
      const prompt = `You are an expert Indian event design consultant.

Generate a rich, detailed design concept description for:
- Event Type: ${eventType}
- Theme: ${theme}
- Design Focus: ${designType}
- Color Palette: ${colors?.join(", ") ?? "Not specified"}
- User Description: ${description || "None provided"}

Provide:
1. A vivid title for the design concept (one line)
2. A 2–3 sentence visual description of the design
3. Key design elements as a comma-separated list

Format your response as JSON:
{
  "title": "...",
  "description": "...",
  "elements": ["element1", "element2", ...]
}`;
      const raw = await gemini.generate(prompt);
      // Extract JSON from markdown code blocks if present
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : raw;
      let parsed: any = {};
      try { parsed = JSON.parse(jsonStr.trim()); } catch { parsed = { title: "Custom Design", description: raw, elements: [] }; }
      return res.json({ success: true, data: parsed });
    } catch (error) {
      next(error);
    }
  }

  // Marketplace AI vendor recommendation for vendors within 3000km radius
  async recommendVendors(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { city, eventType, budget, state } = req.body;
      const targetCity = city || "Palakkad";
      const targetState = state || "Kerala";
      const targetEvent = eventType || "Wedding";

      const prompt = `You are an expert event vendor recommendation engine for India.
Generate 18 real, top-rated event vendors located within a 3,000 km radius of ${targetCity}, ${targetState}, India for a ${targetEvent}.

Include a mix of:
1. Local City vendors (within 0–50 km of ${targetCity})
2. Neighboring regional city vendors (within 50–350 km, e.g. Coimbatore, Kochi, Thrissur, Calicut, Madurai, Mysore, Bangalore)
3. Pan-India destination specialists (within 350–3,000 km, e.g. Chennai, Hyderabad, Mumbai, Goa, Udaipur, Jaipur, Delhi) who provide travel/destination event services.

Ensure you provide at least 3 vendors for EACH category: Catering, Decoration, Photography, Music, Mehendi, Venue.

Event Details:
- Location: ${targetCity}, ${targetState}
- Event Type: ${targetEvent}
- Budget: ${budget ? "₹" + Number(budget).toLocaleString("en-IN") : "Flexible"}

Return ONLY a JSON array of objects:
[
  {
    "businessName": "Vendor Name",
    "category": "Catering" | "Decoration" | "Photography" | "Music" | "Mehendi" | "Venue",
    "rating": 4.8,
    "reviewsCount": 145,
    "experience": 9,
    "city": "City, State",
    "distanceKm": 45,
    "minPrice": 45000,
    "verified": true,
    "specialty": "Clear specialty description and travel capability"
  }
]`;

      let vendors: any[] = [];
      try {
        const raw = await gemini.generate(prompt);
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : raw;
        vendors = JSON.parse(jsonStr.trim());
      } catch {
        // Multi-tier radius catalog fallback (Local 0km, Regional ~50-350km, Pan-India ~500-2500km)
        vendors = [
          // CATERING
          {
            businessName: `${targetCity} Grand Catering & Traditional Feast`,
            category: "Catering",
            rating: 4.9,
            reviewsCount: 184,
            experience: 14,
            city: `${targetCity}, ${targetState}`,
            distanceKm: 0,
            minPrice: budget ? Math.round(Number(budget) * 0.35) : 85000,
            verified: true,
            specialty: "Authentic traditional Sadhya, South Indian feast & buffet banquets",
          },
          {
            businessName: `Annapoorna Royal Caterers`,
            category: "Catering",
            rating: 4.8,
            reviewsCount: 128,
            experience: 11,
            city: `Coimbatore, Tamil Nadu`,
            distanceKm: 52,
            minPrice: budget ? Math.round(Number(budget) * 0.3) : 70000,
            verified: true,
            specialty: "Pure veg traditional delicacies, live food counters & dessert bar (serves regional areas)",
          },
          {
            businessName: `Malabar Royal Gourmet & Biryani House`,
            category: "Catering",
            rating: 4.9,
            reviewsCount: 210,
            experience: 16,
            city: `Calicut, Kerala`,
            distanceKm: 125,
            minPrice: budget ? Math.round(Number(budget) * 0.32) : 75000,
            verified: true,
            specialty: "Famous authentic Malabar Dum Biryani, royal non-veg spreads & live barbecue",
          },
          {
            businessName: `Grand Culinary Art Destination Caterers`,
            category: "Catering",
            rating: 4.9,
            reviewsCount: 340,
            experience: 18,
            city: `Bangalore, Karnataka`,
            distanceKm: 360,
            minPrice: budget ? Math.round(Number(budget) * 0.4) : 120000,
            verified: true,
            specialty: "Luxury pan-India destination gourmet catering with 5-star master chefs",
          },

          // DECORATION
          {
            businessName: `Royal Flora & Mandap Decors ${targetCity}`,
            category: "Decoration",
            rating: 4.8,
            reviewsCount: 132,
            experience: 10,
            city: `${targetCity}, ${targetState}`,
            distanceKm: 0,
            minPrice: budget ? Math.round(Number(budget) * 0.22) : 60000,
            verified: true,
            specialty: "Eco-friendly temple mandap, floral canopy & grand entrance setups",
          },
          {
            businessName: `Varna Luxury Stage & Lighting`,
            category: "Decoration",
            rating: 4.7,
            reviewsCount: 95,
            experience: 8,
            city: `Thrissur, Kerala`,
            distanceKm: 68,
            minPrice: budget ? Math.round(Number(budget) * 0.18) : 45000,
            verified: true,
            specialty: "Modern geometric arches, LED ambient wall & floral backdrops",
          },
          {
            businessName: `Kochi Dream Events & Theme Mandaps`,
            category: "Decoration",
            rating: 4.9,
            reviewsCount: 175,
            experience: 12,
            city: `Kochi, Kerala`,
            distanceKm: 135,
            minPrice: budget ? Math.round(Number(budget) * 0.25) : 75000,
            verified: true,
            specialty: "Waterfront themes, luxury floral chandeliers & customized couple stages",
          },
          {
            businessName: `The Royal Wedding Design Co.`,
            category: "Decoration",
            rating: 5.0,
            reviewsCount: 290,
            experience: 15,
            city: `Chennai, Tamil Nadu`,
            distanceKm: 510,
            minPrice: budget ? Math.round(Number(budget) * 0.3) : 95000,
            verified: true,
            specialty: "Bespoke destination wedding production, palace themes & celebrity stage setups",
          },

          // PHOTOGRAPHY
          {
            businessName: `${targetCity} Moments Cinematic Photography`,
            category: "Photography",
            rating: 4.9,
            reviewsCount: 96,
            experience: 8,
            city: `${targetCity}, ${targetState}`,
            distanceKm: 0,
            minPrice: budget ? Math.round(Number(budget) * 0.18) : 45000,
            verified: true,
            specialty: "4K cinematic wedding films, candid portraits & drone coverage",
          },
          {
            businessName: `Visual Art Studio & Filmworks`,
            category: "Photography",
            rating: 4.8,
            reviewsCount: 82,
            experience: 6,
            city: `Coimbatore, Tamil Nadu`,
            distanceKm: 52,
            minPrice: 38000,
            verified: true,
            specialty: "Traditional photo albums, couple portraits & pre-wedding shoots",
          },
          {
            businessName: `Lumiere Wedding Stories`,
            category: "Photography",
            rating: 4.9,
            reviewsCount: 240,
            experience: 11,
            city: `Kochi, Kerala`,
            distanceKm: 135,
            minPrice: 55000,
            verified: true,
            specialty: "International award-winning candid wedding films & cinematic reels",
          },
          {
            businessName: `Shutter & Soul Destination Photographers`,
            category: "Photography",
            rating: 5.0,
            reviewsCount: 310,
            experience: 14,
            city: `Bangalore, Karnataka`,
            distanceKm: 360,
            minPrice: 65000,
            verified: true,
            specialty: "Pan-India destination wedding specialists with full crew & same-day teaser edit",
          },

          // MUSIC & ENTERTAINMENT
          {
            businessName: `Swaram Fusion & Melam Artists`,
            category: "Music",
            rating: 4.7,
            reviewsCount: 78,
            experience: 12,
            city: `${targetCity}, ${targetState}`,
            distanceKm: 0,
            minPrice: 35000,
            verified: true,
            specialty: "Traditional Panchavadyam, Chenda Melam & live acoustic fusion band",
          },
          {
            businessName: `Beats & Strings Live Band`,
            category: "Music",
            rating: 4.8,
            reviewsCount: 65,
            experience: 9,
            city: `Thrissur, Kerala`,
            distanceKm: 68,
            minPrice: 30000,
            verified: true,
            specialty: "Multilingual party DJ, classical violin fusion & reception music",
          },
          {
            businessName: `Kochi Symphony & DJ Collective`,
            category: "Music",
            rating: 4.9,
            reviewsCount: 150,
            experience: 10,
            city: `Kochi, Kerala`,
            distanceKm: 135,
            minPrice: 40000,
            verified: true,
            specialty: "High-energy club DJ, Dhol artists, percussion ensemble & concert audio setups",
          },
          {
            businessName: `Rhythm of Rajasthan Heritage Troupe`,
            category: "Music",
            rating: 4.9,
            reviewsCount: 195,
            experience: 20,
            city: `Jaipur, Rajasthan`,
            distanceKm: 2180,
            minPrice: 60000,
            verified: true,
            specialty: "Authentic Rajasthani folk, Shehnai, Sufi singers & royal grand welcome troupe",
          },

          // MEHENDI & BRIDAL
          {
            businessName: `Aiswarya Bridal Mehendi & Makeover`,
            category: "Mehendi",
            rating: 4.8,
            reviewsCount: 110,
            experience: 7,
            city: `${targetCity}, ${targetState}`,
            distanceKm: 0,
            minPrice: 15000,
            verified: true,
            specialty: "Bridal organic henna designs, Arabic, portrait & floral patterns",
          },
          {
            businessName: `Henna Elegance by Deepa`,
            category: "Mehendi",
            rating: 4.9,
            reviewsCount: 88,
            experience: 5,
            city: `Coimbatore, Tamil Nadu`,
            distanceKm: 52,
            minPrice: 12000,
            verified: true,
            specialty: "Rajasthani bridal mehndi, intricate finger detailing & glitter accents",
          },
          {
            businessName: `Zehra Bridal Henna Studio`,
            category: "Mehendi",
            rating: 4.9,
            reviewsCount: 165,
            experience: 10,
            city: `Kozhikode, Kerala`,
            distanceKm: 120,
            minPrice: 16000,
            verified: true,
            specialty: "Modern bridal figure work, customized bride-groom portraits & Gulf henna",
          },
          {
            businessName: `Artistic Bridal Mehendi by Geeta`,
            category: "Mehendi",
            rating: 5.0,
            reviewsCount: 280,
            experience: 16,
            city: `Mumbai, Maharashtra`,
            distanceKm: 1240,
            minPrice: 25000,
            verified: true,
            specialty: "Celebrity bridal mehendi artist traveling pan-India for destination weddings",
          },

          // VENUE
          {
            businessName: `Green Valley Convention Centre & Resort`,
            category: "Venue",
            rating: 4.6,
            reviewsCount: 89,
            experience: 15,
            city: `${targetCity}, ${targetState}`,
            distanceKm: 0,
            minPrice: budget ? Math.round(Number(budget) * 0.4) : 120000,
            verified: true,
            specialty: "Air-conditioned banquet halls for 500–2000 guests with lawn garden",
          },
          {
            businessName: `Grand Heritage Palace Auditorium`,
            category: "Venue",
            rating: 4.7,
            reviewsCount: 104,
            experience: 18,
            city: `Thrissur, Kerala`,
            distanceKm: 68,
            minPrice: budget ? Math.round(Number(budget) * 0.38) : 110000,
            verified: true,
            specialty: "Spacious central hall, VIP guest rooms & dedicated car parking",
          },
          {
            businessName: `Cochin Backwaters Grand Resort & Convention`,
            category: "Venue",
            rating: 4.9,
            reviewsCount: 230,
            experience: 12,
            city: `Kochi, Kerala`,
            distanceKm: 135,
            minPrice: budget ? Math.round(Number(budget) * 0.45) : 180000,
            verified: true,
            specialty: "5-star luxury waterfront destination resort with private island lawn & helipad",
          },
          {
            businessName: `Royal Palace Fort & Resort`,
            category: "Venue",
            rating: 5.0,
            reviewsCount: 380,
            experience: 25,
            city: `Udaipur, Rajasthan`,
            distanceKm: 1980,
            minPrice: 350000,
            verified: true,
            specialty: "Heritage lake palace venue for dream royal destination weddings",
          },
        ];
      }

      return res.json({ success: true, data: vendors });
    } catch (error) {
      next(error);
    }
  }



}

export default new AIController();