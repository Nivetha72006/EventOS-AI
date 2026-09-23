import { useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, Users, Wallet, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title || !eventType || !eventDate || !city || !state || !country) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!guestCount || Number(guestCount) < 1) {
      setError("Please enter a valid guest count.");
      return;
    }

    setLoading(true);

    const eventPayload = {
      id: `evt-${Date.now()}`,
      title,
      eventType,
      eventDate,
      city,
      state,
      country,
      guestCount: Number(guestCount),
      budget: budget ? Number(budget) : null,
      description: description.trim() || null,
    };

    // Save to multi-event list in localStorage
    try {
      const storedEventsStr = localStorage.getItem("eventos_events");
      const existingEvents: any[] = storedEventsStr ? JSON.parse(storedEventsStr) : [];
      const currentStored = localStorage.getItem("eventos_event");
      if (currentStored && existingEvents.length === 0) {
        const oldEvt = JSON.parse(currentStored);
        if (oldEvt?.id && oldEvt.id !== eventPayload.id) {
          existingEvents.push(oldEvt);
        }
      }
      const updatedEvents = [eventPayload, ...existingEvents.filter((e) => e.id !== eventPayload.id)];
      localStorage.setItem("eventos_events", JSON.stringify(updatedEvents));
      localStorage.setItem("eventos_active_event_id", eventPayload.id);
    } catch {
      // ignore
    }

    // Set active event as source of truth
    localStorage.setItem("eventos_event", JSON.stringify(eventPayload));
    window.dispatchEvent(new CustomEvent("eventos_event_changed", { detail: eventPayload }));

    // Silently attempt backend sync (non-blocking)
    try {
      await api.post("/events", eventPayload);
    } catch {
      // backend unavailable – localStorage is already saved, continue
    }

    setLoading(false);
    navigate("/my-event");
  };



  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <p className="create-eyebrow">EVENTOS AI</p>

          <h1>Create your event</h1>

          <p>
            Tell us about your celebration and we'll help you plan every detail.
          </p>
        </div>
      </div>

      <div className="create-event-layout">

        <div className="create-event-card">

          {error && (
            <div className="create-error">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="section-title">
              <Sparkles size={18} />
              <div>
                <h2>Event details</h2>
                <p>Start with the basics of your celebration.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group full">
                <label>Event name *</label>

                <input
                  type="text"
                  placeholder="e.g. Nivetha's Wedding"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Event type *</label>

                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="">Select event type</option>
                  <option value="WEDDING">Wedding</option>
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="GRADUATION">Graduation</option>
                  <option value="BABY_SHOWER">Baby Shower</option>
                  <option value="RITUAL">Ritual</option>
                  <option value="CORPORATE">Corporate</option>
                  <option value="ENGAGEMENT">Engagement</option>
                  <option value="ANNIVERSARY">Anniversary</option>
                </select>
              </div>

              <div className="form-group">
                <label>Event date *</label>

                <div className="input-icon">
                  <CalendarDays size={17} />

                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>

            </div>

            <div className="section-title location-title">
              <MapPin size={18} />

              <div>
                <h2>Location</h2>
                <p>Where will your event take place?</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>City *</label>

                <input
                  type="text"
                  placeholder="Coimbatore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>State *</label>

                <input
                  type="text"
                  placeholder="Tamil Nadu"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Country *</label>

                <input
                  type="text"
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

            </div>

            <div className="section-title planning-title">
              <Users size={18} />

              <div>
                <h2>Planning information</h2>
                <p>These fields are optional. Add them when you're ready.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Expected guests *</label>

<input
  type="number"
  min="1"
  placeholder="Enter guest count"
  value={guestCount}
  onChange={(e) => setGuestCount(e.target.value)}
  required
/>
              </div>

              <div className="form-group">
                <label>Budget</label>

                <div className="input-icon">
                  <Wallet size={17} />

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter your budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Description</label>

                <textarea
                  placeholder="Tell us anything important about your event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

            </div>

            <div className="create-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Event"}
                {!loading && <Sparkles size={17} />}
              </button>

            </div>

          </form>
        </div>

        <div className="create-event-info">

          <div className="info-icon">
            <Sparkles size={22} />
          </div>

          <p className="info-eyebrow">EVENTOS AI</p>

          <h2>
            Your celebration,
            <br />
            your way.
          </h2>

          <p>
            You don't need to have everything figured out yet.
            Start with the basics and let EventOS AI help you
            organize the rest.
          </p>

          <div className="info-points">
            <div>
              <span>01</span>
              <p>Create your event</p>
            </div>

            <div>
              <span>02</span>
              <p>Discover vendors</p>
            </div>

            <div>
              <span>03</span>
              <p>Plan with AI</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CreateEvent;