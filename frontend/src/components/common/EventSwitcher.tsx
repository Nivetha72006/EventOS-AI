import { useState, useEffect, useRef } from "react";
import { CalendarDays, ChevronDown, Check, Plus, Trash2, Sparkles, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface EventData {
  id?: string;
  title?: string;
  eventType?: string;
  eventDate?: string;
  city?: string;
  state?: string;
  country?: string;
  guestCount?: number;
  budget?: number;
  description?: string;
}

export function getAllEvents(): EventData[] {
  try {
    const listStr = localStorage.getItem("eventos_events");
    if (listStr) {
      const list = JSON.parse(listStr);
      if (Array.isArray(list) && list.length > 0) return list;
    }
    const singleStr = localStorage.getItem("eventos_event");
    if (singleStr) {
      const single = JSON.parse(singleStr);
      if (single?.title) return [single];
    }
    return [];
  } catch {
    return [];
  }
}

export function getActiveEvent(): EventData | null {
  try {
    const singleStr = localStorage.getItem("eventos_event");
    if (singleStr) return JSON.parse(singleStr);
    const all = getAllEvents();
    return all.length > 0 ? all[0] : null;
  } catch {
    return null;
  }
}

export function switchActiveEvent(event: EventData) {
  localStorage.setItem("eventos_event", JSON.stringify(event));
  if (event.id) {
    localStorage.setItem("eventos_active_event_id", event.id);
  }
  window.dispatchEvent(new CustomEvent("eventos_event_changed", { detail: event }));
}

export function deleteStoredEvent(eventId: string) {
  try {
    const all = getAllEvents();
    const updated = all.filter((e) => e.id !== eventId);
    localStorage.setItem("eventos_events", JSON.stringify(updated));

    const active = getActiveEvent();
    if (active?.id === eventId) {
      if (updated.length > 0) {
        switchActiveEvent(updated[0]);
      } else {
        localStorage.removeItem("eventos_event");
        localStorage.removeItem("eventos_active_event_id");
        window.dispatchEvent(new CustomEvent("eventos_event_changed", { detail: null }));
      }
    }
  } catch {
    // ignore
  }
}

export default function EventSwitcher() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<EventData[]>(() => getAllEvents());
  const [activeEvent, setActiveEvent] = useState<EventData | null>(() => getActiveEvent());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const refreshEvents = () => {
    setEvents(getAllEvents());
    setActiveEvent(getActiveEvent());
  };

  useEffect(() => {
    refreshEvents();

    const handleEventChange = () => {
      refreshEvents();
    };

    window.addEventListener("eventos_event_changed", handleEventChange);
    window.addEventListener("storage", handleEventChange);

    return () => {
      window.removeEventListener("eventos_event_changed", handleEventChange);
      window.removeEventListener("storage", handleEventChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectEvent = (evt: EventData) => {
    switchActiveEvent(evt);
    setActiveEvent(evt);
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, evtId?: string) => {
    e.stopPropagation();
    if (!evtId) return;
    if (window.confirm("Remove this event from your list?")) {
      deleteStoredEvent(evtId);
      refreshEvents();
    }
  };

  return (
    <div className="event-switcher-container" ref={dropdownRef}>
      <button
        type="button"
        className={`event-switcher-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Switch between your events or add a new celebration"
      >
        <div className="event-switcher-icon">
          <CalendarDays size={15} />
        </div>
        <div className="event-switcher-text">
          <span className="switcher-label">ACTIVE EVENT</span>
          <strong className="switcher-title">
            {activeEvent?.title || "No event selected"}
          </strong>
        </div>
        <ChevronDown size={14} className={`switcher-chevron ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <div className="event-switcher-dropdown">
          <div className="event-switcher-header">
            <div className="switcher-header-left">
              <Sparkles size={14} className="text-gold" />
              <span>YOUR CELEBRATIONS ({events.length})</span>
            </div>
            <button
              type="button"
              className="switcher-new-btn"
              onClick={() => {
                setIsOpen(false);
                navigate("/create-event");
              }}
            >
              <Plus size={13} />
              New Event
            </button>
          </div>

          <div className="event-switcher-list">
            {events.length === 0 ? (
              <div className="event-switcher-empty">
                <p>No events created yet.</p>
                <button
                  type="button"
                  className="switcher-create-link"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/create-event");
                  }}
                >
                  Create your first event
                </button>
              </div>
            ) : (
              events.map((evt) => {
                const isSelected = activeEvent?.id === evt.id || activeEvent?.title === evt.title;
                const formattedDate = evt.eventDate
                  ? new Date(evt.eventDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : null;

                return (
                  <div
                    key={evt.id || evt.title}
                    className={`event-switcher-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectEvent(evt)}
                  >
                    <div className="switcher-item-radio">
                      {isSelected ? <Check size={13} /> : <div className="radio-dot" />}
                    </div>

                    <div className="switcher-item-details">
                      <strong className="switcher-item-title">{evt.title}</strong>
                      <div className="switcher-item-meta">
                        {formattedDate && <span>{formattedDate}</span>}
                        {evt.city && (
                          <span>
                            <MapPin size={11} />
                            {evt.city}
                          </span>
                        )}
                        {evt.guestCount != null && <span>{evt.guestCount} guests</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="switcher-item-delete"
                      onClick={(e) => handleDelete(e, evt.id)}
                      title="Delete event"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="event-switcher-footer">
            <button
              type="button"
              className="switcher-footer-add-btn"
              onClick={() => {
                setIsOpen(false);
                navigate("/create-event");
              }}
            >
              <Plus size={15} />
              <span>Create Another Event</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
