import {
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Plus,
  ArrowRight,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

interface EventData {
  id?: string;
  title: string;
  eventType: string;
  eventDate: string;
  city: string;
  state: string;
  country: string;
  guestCount: number;
  budget?: number | null;
  description?: string | null;
}

function MyEvent() {
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();

    const handleEventChange = () => {
      loadEvent();
    };

    window.addEventListener("eventos_event_changed", handleEventChange);
    window.addEventListener("storage", handleEventChange);
    return () => {
      window.removeEventListener("eventos_event_changed", handleEventChange);
      window.removeEventListener("storage", handleEventChange);
    };
  }, []);


  const loadEvent = async () => {
    // 1. Load from localStorage immediately so the present created event shows without delay
    let currentEvent: EventData | null = null;
    try {
      const stored = localStorage.getItem("eventos_event");
      if (stored) {
        currentEvent = JSON.parse(stored);
        setEvent(currentEvent);
        setLoading(false);
      }
    } catch {
      // ignore
    }

    // 2. Refresh from backend to sync fresh server state
    try {
      const response = await api.get("/events");
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data) && data.length > 0) {
        // data[0] is the latest event created by the user
        setEvent(data[0]);
        localStorage.setItem("eventos_event", JSON.stringify(data[0]));
      } else if (!currentEvent) {
        setEvent(null);
      }
    } catch {
      // Backend offline – currentEvent from localStorage is retained
    } finally {
      setLoading(false);
    }
  };


  const formatEventType = (type: string) => {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatBudget = (budget?: number | null) => {
    if (budget == null) return "Not specified";
    return `₹${Number(budget).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="dashboard-main">
          <Header />
          <div className="my-event-loading">
            <div className="loading-icon">
              <Sparkles size={22} />
            </div>
            <h2>Loading your event...</h2>
            <p>Getting your celebration details ready.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="dashboard-main">
          <Header />
          <div className="my-event-header">
            <div>
              <p className="page-eyebrow">MY EVENT</p>
              <h1>Your event</h1>
              <p>Create your first event and start planning your celebration.</p>
            </div>
            <button
              className="create-event-top-button"
              onClick={() => navigate("/create-event")}
              type="button"
            >
              <Plus size={18} />
              Create Event
            </button>
          </div>

          <div className="empty-event-card">
            <div className="empty-event-icon">
              <CalendarDays size={32} />
            </div>
            <p className="page-eyebrow">READY WHEN YOU ARE</p>
            <h2>No event created yet</h2>
            <p>
              Create your event to start managing your celebration, discovering
              vendors and planning everything with EventOS AI.
            </p>
            <button
              className="create-event-button-large"
              onClick={() => navigate("/create-event")}
              type="button"
            >
              Create your first event
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleDeleteEvent = () => {
    if (window.confirm("Are you sure you want to delete this event and start fresh?")) {
      localStorage.removeItem("eventos_event");
      setEvent(null);
      navigate("/dashboard");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="dashboard-main">
        <Header />

        <div className="my-event-header">
          <div>
            <p className="page-eyebrow">CELEBRATION OVERVIEW</p>
            <h1>My Event</h1>
            <p>Everything about your celebration, organized in one place.</p>
          </div>


          <div className="my-event-header-actions">
            <button
              className="secondary-event-button"
              type="button"
              onClick={handleDeleteEvent}
              style={{ color: "#ef4444", borderColor: "#fecaca" }}
            >
              <Trash2 size={16} />
              Delete Event
            </button>
            <button
              className="create-event-top-button"
              onClick={() => navigate("/create-event")}
              type="button"
            >
              <Plus size={18} />
              New Event
            </button>
          </div>
        </div>


        <div className="event-hero-card">
          <div className="event-hero-content">
            <div className="event-hero-badge">
              <Sparkles size={14} />
              YOUR CELEBRATION
            </div>
            <h2>{event.title}</h2>
            <p className="event-type">{formatEventType(event.eventType)}</p>
            <div className="event-hero-location">
              <MapPin size={16} />
              <span>
                {event.city}, {event.state}, {event.country}
              </span>
            </div>
          </div>

          <div className="event-date-card">
            <CalendarDays size={21} />
            <span>EVENT DATE</span>
            <strong>{formatDate(event.eventDate)}</strong>
          </div>
        </div>

        <div className="event-details-grid">
          <div className="event-detail-card">
            <div className="event-detail-icon">
              <MapPin size={20} />
            </div>
            <div>
              <span>LOCATION</span>
              <strong>
                {event.city}, {event.state}
              </strong>
              <small>{event.country}</small>
            </div>
          </div>

          <div className="event-detail-card">
            <div className="event-detail-icon">
              <Users size={20} />
            </div>
            <div>
              <span>EXPECTED GUESTS</span>
              <strong>{event.guestCount.toLocaleString("en-IN")}</strong>
              <small>Guests</small>
            </div>
          </div>

          <div className="event-detail-card">
            <div className="event-detail-icon">
              <Wallet size={20} />
            </div>
            <div>
              <span>BUDGET</span>
              <strong>{formatBudget(event.budget)}</strong>
              <small>
                {event.budget == null ? "Add when you're ready" : "Planning budget"}
              </small>
            </div>
          </div>
        </div>

        {event.description && (
          <div className="event-description-card">
            <p className="page-eyebrow">ABOUT YOUR EVENT</p>
            <h3>Event notes</h3>
            <p>{event.description}</p>
          </div>
        )}

        <div className="event-next-section">
          <div>
            <p className="page-eyebrow">WHAT'S NEXT</p>
            <h2>Let's bring your celebration together.</h2>
            <p>
              Discover trusted vendors, organize your bookings and let EventOS AI
              help you plan the details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/marketplace")}
            className="event-next-button"
          >
            Explore vendors
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default MyEvent;