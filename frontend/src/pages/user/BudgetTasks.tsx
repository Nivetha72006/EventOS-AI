import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Wallet,
  CheckCircle2,
  Circle,
  TrendingUp,
  Receipt,
  ListTodo,
  ShieldCheck,
  Layers,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

interface TaskItem {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface BudgetItem {
  id: number;
  category: string;
  allocated: number;
  spent?: number;
}

interface BookingItem {
  id: string;
  vendorName?: string;
  category?: string;
  amount?: number;
  status?: "pending" | "active" | "completed";
  bookingDate?: string;
}

interface EventData {
  id?: string;
  title?: string;
  budget?: number | null;
  eventType?: string;
  city?: string;
}

function getStoredBookings(): BookingItem[] {
  try {
    const s = localStorage.getItem("eventos_bookings");
    if (!s) return [];
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function matchBookingToCategory(bookingCategory: string, bookingName: string, categoryName: string): boolean {
  const catLower = categoryName.toLowerCase();
  const bCat = (bookingCategory || "").toLowerCase();
  const bName = (bookingName || "").toLowerCase();

  if (catLower.includes("cater") || catLower.includes("food") || catLower.includes("dining")) {
    return bCat.includes("cater") || bCat.includes("food") || bName.includes("cater") || bName.includes("sadhya") || bName.includes("feast");
  }
  if (catLower.includes("decor") || catLower.includes("mandap") || catLower.includes("theme") || catLower.includes("stage")) {
    return bCat.includes("decor") || bCat.includes("mandap") || bCat.includes("flower") || bName.includes("decor") || bName.includes("mandap") || bName.includes("floral");
  }
  if (catLower.includes("photo") || catLower.includes("media") || catLower.includes("video") || catLower.includes("cinemat")) {
    return bCat.includes("photo") || bCat.includes("video") || bCat.includes("cinemat") || bName.includes("photo") || bName.includes("studio") || bName.includes("films");
  }
  if (catLower.includes("music") || catLower.includes("dj") || catLower.includes("entertain") || catLower.includes("sound")) {
    return bCat.includes("music") || bCat.includes("dj") || bCat.includes("sound") || bCat.includes("band") || bName.includes("sound") || bName.includes("dj") || bName.includes("beats");
  }
  if (catLower.includes("mehendi") || catLower.includes("henna") || catLower.includes("makeup") || catLower.includes("styling") || catLower.includes("bridal")) {
    return bCat.includes("mehendi") || bCat.includes("henna") || bCat.includes("makeup") || bCat.includes("beauty") || bName.includes("mehendi") || bName.includes("henna") || bName.includes("raziya");
  }
  if (catLower.includes("venue") || catLower.includes("hall") || catLower.includes("resort") || catLower.includes("palace")) {
    return bCat.includes("venue") || bCat.includes("hall") || bCat.includes("resort") || bName.includes("palace") || bName.includes("hall") || bName.includes("resort");
  }
  return bCat.includes(catLower) || catLower.includes(bCat);
}

const STARTER_CHECKLIST: TaskItem[] = [
  { id: 1, title: "Finalize catering guest count & banquet schedule", dueDate: "Upcoming", completed: false },
  { id: 2, title: "Confirm mandap setup start time (12 hrs prior)", dueDate: "Upcoming", completed: false },
  { id: 3, title: "Coordinate traditional vs candid photography shot list", dueDate: "Upcoming", completed: false },
  { id: 4, title: "Schedule bridal & guest mehendi speed artists", dueDate: "Upcoming", completed: false },
  { id: 5, title: "Distribute digital invitations & track RSVPs", dueDate: "Upcoming", completed: true },
];

export default function BudgetTasks() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>(() => getStoredBookings());

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("Upcoming");
  const [newAllocated, setNewAllocated] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const refreshData = () => {
    try {
      const storedEvent = localStorage.getItem("eventos_event");
      const currentBookings = getStoredBookings();
      setBookings(currentBookings);

      if (storedEvent) {
        const parsedEvent: EventData = JSON.parse(storedEvent);
        setEvent(parsedEvent);

        const eventKey = parsedEvent.id;
        if (eventKey) {
          const savedTasks = localStorage.getItem(`eventos_tasks_${eventKey}`);
          if (savedTasks) {
            const list: TaskItem[] = JSON.parse(savedTasks);
            const filtered = Array.isArray(list)
              ? list.filter(
                  (t) =>
                    ![
                      "Finalize catering guest count & banquet schedule",
                      "Confirm mandap setup start time (12 hrs prior)",
                      "Coordinate traditional vs candid photography shot list",
                      "Schedule bridal & guest mehendi speed artists",
                      "Distribute digital invitations & track RSVPs",
                    ].includes(t?.title || "")
                )
              : [];
            setTasks(filtered);
          } else {
            setTasks([]);
          }
        } else {
          setTasks([]);
        }

        const savedBudget = localStorage.getItem(`eventos_budget_${eventKey}`);
        if (savedBudget) {
          setBudgetItems(JSON.parse(savedBudget));
        } else {
          setBudgetItems([]);
        }
      } else {
        setEvent(null);
        setTasks([]);
        setBudgetItems([]);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshData();

    window.addEventListener("eventos_event_changed", refreshData);
    window.addEventListener("eventos_bookings_changed", refreshData);
    window.addEventListener("storage", refreshData);

    return () => {
      window.removeEventListener("eventos_event_changed", refreshData);
      window.removeEventListener("eventos_bookings_changed", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const saveTasksToStorage = (updatedTasks: TaskItem[]) => {
    setTasks(updatedTasks);
    const eventKey = event?.id || "default";
    localStorage.setItem(`eventos_tasks_${eventKey}`, JSON.stringify(updatedTasks));
    window.dispatchEvent(new CustomEvent("eventos_tasks_changed"));
  };

  const saveBudgetToStorage = (updatedBudget: BudgetItem[]) => {
    setBudgetItems(updatedBudget);
    const eventKey = event?.id || "default";
    localStorage.setItem(`eventos_budget_${eventKey}`, JSON.stringify(updatedBudget));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const updated = [
      ...tasks,
      { id: Date.now(), title: newTaskTitle.trim(), dueDate: newDueDate.trim() || "Upcoming", completed: false },
    ];
    saveTasksToStorage(updated);
    setNewTaskTitle("");
    setNewDueDate("Upcoming");
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !newAllocated) return;
    const updated = [
      ...budgetItems,
      { id: Date.now(), category: newCategory.trim(), allocated: parseFloat(newAllocated) },
    ];
    saveBudgetToStorage(updated);
    setNewCategory("");
    setNewAllocated("");
  };

  const toggleTask = (id: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasksToStorage(updated);
  };

  const deleteTask = (id: number) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasksToStorage(updated);
  };

  const deleteBudget = (id: number) => {
    const updated = budgetItems.filter((b) => b.id !== id);
    saveBudgetToStorage(updated);
  };

  const handleLoadStarterTasks = () => {
    saveTasksToStorage(STARTER_CHECKLIST);
  };

  // Only confirmed/active/completed bookings count toward "Spent"
  const confirmedBookings = bookings.filter((b) => b.status === "active" || b.status === "completed");

  // Dynamic calculation of spent per category
  const categoriesWithSpent = budgetItems.map((item) => {
    const spentAmount = confirmedBookings
      .filter((b) => matchBookingToCategory(b.category || "", b.vendorName || "", item.category))
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    return {
      ...item,
      spent: spentAmount,
    };
  });

  const totalEventBudget = event?.budget ? Number(event.budget) : budgetItems.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalAllocated = categoriesWithSpent.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = confirmedBookings.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remainingBudget = Math.max(0, totalEventBudget - totalSpent);
  const spentPercentage = totalEventBudget > 0 ? Math.min(100, Math.round((totalSpent / totalEventBudget) * 100)) : 0;

  const completedCount = tasks.filter((t) => t.completed).length;
  const taskProgressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("cater") || n.includes("food")) return "🍽️";
    if (n.includes("decor") || n.includes("mandap")) return "🌸";
    if (n.includes("photo") || n.includes("media")) return "📸";
    if (n.includes("music") || n.includes("dj")) return "🎵";
    if (n.includes("mehendi") || n.includes("styling")) return "🌿";
    if (n.includes("venue") || n.includes("hall")) return "🏛️";
    return "🏷️";
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main budget-tasks-layout" style={{ paddingBottom: "3rem" }}>
        <Header placeholder="Search budget categories, invoices, tasks..." />

        {/* Header */}
        <div className="bookings-header" style={{ marginBottom: "1.5rem" }}>
          <p className="eyebrow dark">FINANCIAL &amp; TIMELINE OPERATIONS</p>
          <h1>Budget &amp; Tasks Center</h1>
          <p className="sub-text">
            {event
              ? `Real-time expense ledger and day-of checklist for "${event.title}". Confirmed vendor bookings sync into "Spent" automatically.`
              : "Monitor your celebration expenses and coordinate daily tasks in real-time."}
          </p>
        </div>

        {/* 4-Column KPI Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Card 1: Total Budget */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "18px 20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.5px" }}>
                TOTAL EVENT BUDGET
              </span>
              <Wallet size={16} className="text-blue" />
            </div>
            <strong style={{ fontSize: "22px", color: "#0f172a", display: "block" }}>
              {totalEventBudget > 0 ? `₹${totalEventBudget.toLocaleString("en-IN")}` : "Not Set"}
            </strong>
            <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
              {event?.city ? `Allocated for ${event.city}` : "Base allocated budget"}
            </span>
          </div>

          {/* Card 2: Allocated Across Categories */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "18px 20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.5px" }}>
                PLANNED ALLOCATION
              </span>
              <Layers size={16} className="text-blue" />
            </div>
            <strong style={{ fontSize: "22px", color: totalAllocated > totalEventBudget && totalEventBudget > 0 ? "#ef4444" : "#2563eb", display: "block" }}>
              ₹{totalAllocated.toLocaleString("en-IN")}
            </strong>
            <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
              Across {budgetItems.length} active categories
            </span>
          </div>

          {/* Card 3: Spent / Confirmed Vendors */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "18px 20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", letterSpacing: "0.5px" }}>
                SPENT / COMMITTED
              </span>
              <Receipt size={16} color="#16a34a" />
            </div>
            <strong style={{ fontSize: "22px", color: "#16a34a", display: "block" }}>
              ₹{totalSpent.toLocaleString("en-IN")}
            </strong>
            <span style={{ fontSize: "12px", color: "#15803d", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={13} />
              <span>{confirmedBookings.length} confirmed vendor{confirmedBookings.length === 1 ? "" : "s"}</span>
            </span>
          </div>

          {/* Card 4: Remaining Balance */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "18px 20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.5px" }}>
                REMAINING BALANCE
              </span>
              <TrendingUp size={16} className="text-blue" />
            </div>
            <strong style={{ fontSize: "22px", color: "#0f172a", display: "block" }}>
              ₹{remainingBudget.toLocaleString("en-IN")}
            </strong>
            <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
              {100 - spentPercentage}% budget available
            </span>
          </div>
        </div>

        {/* 2-Column Split: Left Budget Ledger / Right Checklist */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "24px", alignItems: "start" }}>
          
          {/* ================= LEFT: BUDGET TRACKER ================= */}
          <section
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wallet size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    Category Budget Ledger
                  </h2>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {spentPercentage}% of total budget spent
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: "120px", textAlign: "right" }}>
                <div style={{ height: "6px", width: "100%", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginTop: "4px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${spentPercentage}%`,
                      background: "linear-gradient(90deg, #2563eb, #16a34a)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Budget Categories Table */}
            <div style={{ overflowX: "auto", marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: "#475569", textAlign: "left", borderBottom: "1.5px solid #e2e8f0" }}>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Category</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>Allocated</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>Spent (Confirmed)</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>Remaining</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, width: "40px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesWithSpent.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "2rem 1rem", textAlign: "center", color: "#64748b" }}>
                        No budget categories added yet.
                      </td>
                    </tr>
                  ) : (
                    categoriesWithSpent.map((item) => {
                      const itemSpent = item.spent || 0;
                      const itemRemaining = Math.max(0, item.allocated - itemSpent);
                      const isOver = itemSpent > item.allocated;

                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#1e293b" }}>
                            <span>{getCategoryIcon(item.category)}</span>
                            <span>{item.category}</span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "right", color: "#334155", fontWeight: 600 }}>
                            ₹{item.allocated.toLocaleString("en-IN")}
                          </td>
                          <td style={{ padding: "12px", textAlign: "right" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                fontWeight: 700,
                                background: itemSpent > 0 ? (isOver ? "#fef2f2" : "#f0fdf4") : "#f8fafc",
                                color: itemSpent > 0 ? (isOver ? "#ef4444" : "#16a34a") : "#64748b",
                              }}
                            >
                              ₹{itemSpent.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "right", color: isOver ? "#ef4444" : "#64748b", fontWeight: 500 }}>
                            ₹{itemRemaining.toLocaleString("en-IN")}
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => deleteBudget(item.id)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#94a3b8",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px",
                              }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ef4444")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                              title="Delete category"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Budget Category Form */}
            <form
              onSubmit={handleAddBudget}
              style={{
                display: "flex",
                gap: "10px",
                padding: "14px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                placeholder="New Category (e.g. Mehendi, Sound & Lighting)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ flex: 1.5, padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none" }}
                required
              />
              <input
                type="number"
                placeholder="Allocated (₹)"
                value={newAllocated}
                onChange={(e) => setNewAllocated(e.target.value)}
                style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none" }}
                required
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <Plus size={15} />
                <span>Add Category</span>
              </button>
            </form>

            {/* Confirmed Vendor Invoices Breakdown */}
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                Confirmed Vendor Commitments ({confirmedBookings.length})
              </h3>

              {confirmedBookings.length === 0 ? (
                <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b", fontSize: "12.5px" }}>
                  No confirmed vendor bookings yet. When you accept or book a vendor in the <strong>Marketplace / Bookings</strong> tab, their contract amount will appear here under "Spent".
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {confirmedBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "16px" }}>{getCategoryIcon(b.category || "")}</span>
                        <div>
                          <strong style={{ color: "#0f172a", display: "block" }}>{b.vendorName || "Verified Vendor"}</strong>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>{b.category || "Service"}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ color: "#16a34a", fontSize: "14px", display: "block" }}>
                          ₹{Number(b.amount || 0).toLocaleString("en-IN")}
                        </strong>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: b.status === "completed" ? "#16a34a" : "#2563eb",
                            background: b.status === "completed" ? "#f0fdf4" : "#eff6ff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {b.status === "completed" ? "Completed & Settled" : "Active / In Escrow"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ================= RIGHT: EVENT CHECKLIST ================= */}
          <section
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ListTodo size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    Event Checklist ({completedCount}/{tasks.length})
                  </h2>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {taskProgressPercent}% tasks completed
                  </span>
                </div>
              </div>

              <div style={{ width: "90px", textAlign: "right" }}>
                <div style={{ height: "6px", width: "100%", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginTop: "4px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${taskProgressPercent}%`,
                      background: "#16a34a",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Task Checklist Items - Clean Flex Alignment */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
              {tasks.length === 0 ? (
                <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                  <p style={{ margin: 0, fontSize: "13px" }}>No tasks created yet.</p>
                  <button
                    type="button"
                    onClick={handleLoadStarterTasks}
                    style={{
                      marginTop: "10px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#2563eb",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    + Load Starter Checklist
                  </button>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      background: task.completed ? "#f8fafc" : "#ffffff",
                      borderRadius: "12px",
                      border: task.completed ? "1px solid #e2e8f0" : "1.5px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Sleek Interactive Checkbox Button */}
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: task.completed ? "#16a34a" : "#94a3b8",
                        transition: "transform 0.15s",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                      }}
                      title={task.completed ? "Mark pending" : "Mark completed"}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} className="text-green" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    {/* Task Title & Badge */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: "13.5px",
                          fontWeight: task.completed ? 400 : 600,
                          color: task.completed ? "#94a3b8" : "#0f172a",
                          textDecoration: task.completed ? "line-through" : "none",
                          wordBreak: "break-word",
                          lineHeight: "1.4",
                        }}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Due Date Tag */}
                    {task.dueDate && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: task.completed ? "#f1f5f9" : "#eff6ff",
                          color: task.completed ? "#94a3b8" : "#2563eb",
                          flexShrink: 0,
                        }}
                      >
                        {task.dueDate}
                      </span>
                    )}

                    {/* Delete Task Button */}
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "#ef4444";
                        (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Clean Add Task Input Form */}
            <form
              onSubmit={handleAddTask}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "14px",
              }}
            >
              <input
                type="text"
                placeholder="Add a new task (e.g. Schedule photography crew, verify garlands)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                required
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Timeline / Slot (e.g. Today, Morning, 2 Days Prior)"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{
                    width: "60%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />

                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Plus size={15} />
                  <span>Add Task</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
