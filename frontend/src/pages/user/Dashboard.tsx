import {
  CalendarDays,
  ChevronRight,
  Clock3,
  DollarSign,
  Sparkles,
  Store,
  Users,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import VendorDashboard from "../vendor/VendorDashboard";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: "USER" | "VENDOR";
};

type EventData = {
  id?: string;
  title?: string;
  eventType?: string;
  eventDate?: string;
  city?: string;
  state?: string;
  country?: string;
  guestCount?: number;
  budget?: number;
};

type BookingItem = {
  id: string;
  status?: "pending" | "active" | "completed";
  vendorName?: string;
  category?: string;
  amount?: number;
};

type TaskItem = {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
};

function getUser(): User {
  try {
    const stored = localStorage.getItem("eventos_user");
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function getEvent(): EventData | null {
  try {
    const stored = localStorage.getItem("eventos_event");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getBookings(): BookingItem[] {
  try {
    const stored = localStorage.getItem("eventos_bookings");
    if (!stored) return [];
    const list = JSON.parse(stored);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

const STARTER_TASK_TITLES = [
  "Finalize catering guest count & banquet schedule",
  "Confirm mandap setup start time (12 hrs prior)",
  "Coordinate traditional vs candid photography shot list",
  "Schedule bridal & guest mehendi speed artists",
  "Distribute digital invitations & track RSVPs",
];

function getTasks(eventKey?: string): TaskItem[] {
  try {
    if (!eventKey) {
      try { localStorage.removeItem("eventos_tasks_default"); } catch {}
      return [];
    }
    const stored = localStorage.getItem(`eventos_tasks_${eventKey}`);
    if (!stored) return [];
    const list: TaskItem[] = JSON.parse(stored);
    if (!Array.isArray(list)) return [];
    
    const filtered = list.filter((t) => !STARTER_TASK_TITLES.includes(t?.title || ""));
    if (filtered.length !== list.length) {
      try { localStorage.setItem(`eventos_tasks_${eventKey}`, JSON.stringify(filtered)); } catch {}
    }
    return filtered;
  } catch {
    return [];
  }
}

function Dashboard() {
  const [user, setUser] = useState<User>(() => getUser());

  useEffect(() => {
    const handleUserChange = () => setUser(getUser());
    window.addEventListener("eventos_user_changed", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("eventos_user_changed", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  if (user.role === "VENDOR") {
    return <VendorDashboard user={user} />;
  }

  return <OrganizerDashboard user={user} />;
}

/* =========================================================
   ORGANIZER DASHBOARD
   ========================================================= */

function OrganizerDashboard({ user }: { user: User }) {
  const [currentUser, setCurrentUser] = useState<User>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const handleUserChange = () => setCurrentUser(getUser());
    window.addEventListener("eventos_user_changed", handleUserChange);
    return () => {
      window.removeEventListener("eventos_user_changed", handleUserChange);
    };
  }, []);

  const displayName = currentUser.name || "Organizer";
  const [event, setEvent] = useState<EventData | null>(() => getEvent());
  const [bookings, setBookings] = useState<BookingItem[]>(() => getBookings());
  const [tasks, setTasks] = useState<TaskItem[]>(() => getTasks(getEvent()?.id));

  const refreshData = () => {
    const currentEvt = getEvent();
    setEvent(currentEvt);
    setBookings(getBookings());
    setTasks(getTasks(currentEvt?.id));
  };

  useEffect(() => {
    refreshData();

    window.addEventListener("eventos_event_changed", refreshData);
    window.addEventListener("eventos_bookings_changed", refreshData);
    window.addEventListener("eventos_tasks_changed", refreshData);
    window.addEventListener("storage", refreshData);

    return () => {
      window.removeEventListener("eventos_event_changed", refreshData);
      window.removeEventListener("eventos_bookings_changed", refreshData);
      window.removeEventListener("eventos_tasks_changed", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const handleDeleteEvent = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to remove this event and start fresh?")) {
      localStorage.removeItem("eventos_event");
      refreshData();
    }
  };

  const currentDate = new Date();
  const greeting =
    currentDate.getHours() < 12
      ? "Good morning"
      : currentDate.getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const eventDate = event?.eventDate ? new Date(event.eventDate) : null;
  const eventLocation = [event?.city, event?.state, event?.country]
    .filter(Boolean)
    .join(" · ");

  // Bookings metrics calculations
  const completedVendors = bookings.filter((b) => b.status === "completed");
  const activeVendors = bookings.filter((b) => b.status === "active");
  const pendingVendors = bookings.filter((b) => b.status === "pending" || !b.status);

  // Vendor count display logic
  let vendorValue = "0";
  let vendorSubtitle = "No vendors booked yet";

  if (completedVendors.length > 0) {
    vendorValue = `${completedVendors.length} Completed`;
    vendorSubtitle = activeVendors.length > 0
      ? `${completedVendors.length} completed · ${activeVendors.length} active`
      : `${completedVendors.length} delivered & settled`;
  } else if (activeVendors.length > 0) {
    vendorValue = `${activeVendors.length} Active`;
    vendorSubtitle = `${activeVendors.length} confirmed vendor${activeVendors.length > 1 ? "s" : ""}`;
  } else if (pendingVendors.length > 0) {
    vendorValue = `${pendingVendors.length} Pending`;
    vendorSubtitle = `${pendingVendors.length} quotation${pendingVendors.length > 1 ? "s" : ""} in review`;
  }

  // Tasks calculations
  const completedTasks = tasks.filter((t) => t.completed);
  const taskValue = tasks.length > 0 ? `${completedTasks.length}/${tasks.length}` : "0";
  const taskSubtitle = tasks.length > 0
    ? `${tasks.length - completedTasks.length} pending task${tasks.length - completedTasks.length === 1 ? "" : "s"}`
    : "0 pending tasks";

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main">
        <Header />

        {/* Welcome Greeting */}
        <div className="vendor-welcome-header">
          <p className="eyebrow dark">{formattedDate.toUpperCase()}</p>
          <h1>
            {greeting}, {displayName} ✦
          </h1>
          <p>
            {event
              ? "Your celebration is coming together beautifully."
              : "Start planning your celebration with EventOS AI."}
          </p>
        </div>

        {/* EVENT BANNER */}
        {event ? (
          <section className="event-banner">
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <p className="eyebrow" style={{ margin: 0 }}>YOUR NEXT CELEBRATION</p>
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    color: "#fca5a5",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  title="Delete event and start fresh"
                >
                  <Trash2 size={11} />
                  <span>Delete</span>
                </button>
              </div>
              <h2>{event.title || "Your Event"}</h2>
              <p>{eventLocation || "Event details will appear here."}</p>
            </div>

            {eventDate && !isNaN(eventDate.getTime()) ? (
              <div className="date-card">
                <span>
                  {eventDate
                    .toLocaleDateString("en-US", { month: "short" })
                    .toUpperCase()}
                </span>
                <strong>{eventDate.getDate()}</strong>
                <small>{eventDate.getFullYear()}</small>
              </div>
            ) : (
              <div className="date-card">
                <CalendarDays size={28} />
                <small>DATE NOT SET</small>
              </div>
            )}
          </section>
        ) : (
          <section className="event-banner">
            <div>
              <p className="eyebrow">YOUR NEXT CELEBRATION</p>
              <h2>No events created yet</h2>
              <p>
                Create your first event and start planning everything in one place.
              </p>
            </div>
            <Link to="/create-event" className="dashboard-banner-button">
              Create Event
              <ChevronRight size={17} />
            </Link>
          </section>
        )}

        {/* STATS */}
        <section className="stats-grid">
          <StatCard
            icon={<DollarSign size={18} />}
            title="EVENT BUDGET"
            value={
              event?.budget != null && Number(event.budget) > 0
                ? `₹${Number(event.budget).toLocaleString("en-IN")}`
                : "—"
            }
            subtitle={
              event?.budget != null && Number(event.budget) > 0
                ? "Allocated budget"
                : "No budget set"
            }
          />

          <StatCard
            icon={<Users size={18} />}
            title="GUESTS"
            value={
              event?.guestCount != null && Number(event.guestCount) > 0
                ? Number(event.guestCount).toLocaleString("en-IN")
                : "—"
            }
            subtitle={
              event?.guestCount != null && Number(event.guestCount) > 0
                ? "Expected guests"
                : "No guests added"
            }
          />

          <StatCard
            icon={<Clock3 size={18} />}
            title="TASKS"
            value={taskValue}
            subtitle={taskSubtitle}
          />

          <StatCard
            icon={<Store size={18} />}
            title="VENDORS"
            value={vendorValue}
            subtitle={vendorSubtitle}
          />
        </section>

        {/* LOWER DASHBOARD */}
        <section className="dashboard-columns">
          {/* TASKS */}
          <div className="tasks-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">PLANNING</p>
                <h2>Upcoming Tasks</h2>
              </div>
              <Link to="/budget-tasks" className="text-button">
                View all
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="tasks-checklist-container">
              {!event ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", padding: "1rem 0" }}>
                  No events created yet — <Link to="/create-event" style={{ color: "#2563EB", fontWeight: 600 }}>Create your event</Link> to get started.
                </p>
              ) : tasks.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", padding: "1rem 0" }}>
                  No tasks yet — go to <Link to="/budget-tasks" style={{ color: "#2563EB", fontWeight: 600 }}>Budget &amp; Tasks</Link> to add your first task.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tasks.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "13px",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        style={{ color: t.completed ? "#16a34a" : "#94a3b8" }}
                      />
                      <span style={{ textDecoration: t.completed ? "line-through" : "none", color: t.completed ? "#94a3b8" : "#0f172a", flex: 1 }}>
                        {t.title}
                      </span>
                      {t.dueDate && (
                        <span style={{ fontSize: "11px", color: "#64748b" }}>{t.dueDate}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI CARD */}
          <div className="ai-card">
            <div className="ai-icon">
              <Sparkles size={20} />
            </div>
            <p className="eyebrow dark">EVENTOS AI</p>
            <h2>Let AI handle the planning.</h2>
            <p>
              Get personalized help with vendors, budgets, tasks and your event planning.
            </p>
            <Link to="/ai-assistant">
              Open AI Assistant
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper">{icon}</div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <strong>{value}</strong>
        <span className="stat-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}

export default Dashboard;
