import { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Store,
  Trash2,
  Building2,
  FileText,
  Download,
  X,
  Lock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

interface Quotation {
  id: string;
  eventId?: string;
  vendorId?: string;
  vendorName: string;
  category: string;
  eventName: string;
  city?: string;
  amount: number;
  status: "pending" | "active" | "completed";
  statusText: string;
  details: string;
  vendorPrice: number;
  userBudget: number;
  aiOffer: number;
  strategy: string;
  potentialSavings: string;
  reasoning: string;
  confidence: number;
  suggestedMessage: string;
  iconBg: string;
  imageBg?: string;
  bookingDate?: string;
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

function getStoredEvent(): EventData | null {
  try {
    const s = localStorage.getItem("eventos_event");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function getStoredBookings(): Quotation[] {
  try {
    const s = localStorage.getItem("eventos_bookings");
    if (s) {
      const list = JSON.parse(s);
      if (Array.isArray(list)) {
        return list;
      }
    }
  } catch {}
  return [];
}

export default function Bookings() {
  const [event, setEvent] = useState<EventData | null>(() => getStoredEvent());
  const [quotations, setQuotations] = useState<Quotation[]>(() => getStoredBookings());
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "completed">("pending");
  const [selectedQuotationId, setSelectedQuotationId] = useState<string>("");
  const [selectedContractBooking, setSelectedContractBooking] = useState<Quotation | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const reloadData = () => {
    const currentEvt = getStoredEvent();
    setEvent(currentEvt);
    const list = getStoredBookings();
    setQuotations(list);
  };

  useEffect(() => {
    reloadData();

    const handleUpdate = () => reloadData();
    window.addEventListener("eventos_bookings_changed", handleUpdate);
    window.addEventListener("eventos_event_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("eventos_bookings_changed", handleUpdate);
      window.removeEventListener("eventos_event_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filter lists by tab
  const pendingQuotes = quotations.filter((q) => q.status === "pending" || !q.status);
  const activeBookings = quotations.filter((q) => q.status === "active");
  const completedBookings = quotations.filter((q) => q.status === "completed");

  // Keep selected quote ID in sync
  useEffect(() => {
    if (pendingQuotes.length > 0) {
      const exists = pendingQuotes.some((q) => q.id === selectedQuotationId);
      if (!exists) {
        setSelectedQuotationId(pendingQuotes[0].id);
      }
    } else {
      setSelectedQuotationId("");
    }
  }, [pendingQuotes, selectedQuotationId]);

  const activeQuote = pendingQuotes.find((q) => q.id === selectedQuotationId) || pendingQuotes[0];

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  const handleNegotiationSubmit = () => {
    if (!activeQuote) return;
    const updated = quotations.map((q) => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          statusText: `Negotiation Sent (Offer: ₹${q.aiOffer.toLocaleString("en-IN")})`,
        };
      }
      return q;
    });
    setQuotations(updated);
    localStorage.setItem("eventos_bookings", JSON.stringify(updated));
    showToast(`AI Negotiation message sent to ${activeQuote.vendorName} with offer ₹${activeQuote.aiOffer.toLocaleString("en-IN")}!`);
  };

  const handleAcceptQuote = (quote: Quotation) => {
    const updated = quotations.map((q) => {
      if (q.id === quote.id) {
        return {
          ...q,
          status: "active" as const,
          statusText: "Booking Confirmed & Active",
        };
      }
      return q;
    });
    setQuotations(updated);
    localStorage.setItem("eventos_bookings", JSON.stringify(updated));
    window.dispatchEvent(new Event("eventos_bookings_changed"));
    showToast(`🎉 Booking confirmed with ${quote.vendorName}! Moved to Active Bookings.`);
    setActiveTab("active");
  };

  const handleMarkAsCompleted = (quote: Quotation) => {
    const updated = quotations.map((q) => {
      if (q.id === quote.id) {
        return {
          ...q,
          status: "completed" as const,
          statusText: "Service Completed & Settled",
        };
      }
      return q;
    });
    setQuotations(updated);
    localStorage.setItem("eventos_bookings", JSON.stringify(updated));
    window.dispatchEvent(new Event("eventos_bookings_changed"));
    showToast(`✨ Service marked as Completed for ${quote.vendorName}!`);
    setActiveTab("completed");
  };

  const handleRejectQuote = (quote: Quotation) => {
    const updated = quotations.filter((q) => q.id !== quote.id);
    setQuotations(updated);
    localStorage.setItem("eventos_bookings", JSON.stringify(updated));
    window.dispatchEvent(new Event("eventos_bookings_changed"));
    showToast(`Removed "${quote.vendorName}" from pending quotations.`);
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main bookings-page-layout">
        <Header placeholder="Search bookings, invoices, quotations..." />

        {/* Notification Toast */}
        {notificationToast && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 9999,
              background: "#0f172a",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              fontWeight: 600,
              animation: "fadeIn 0.3s ease",
            }}
          >
            <CheckCircle2 size={18} className="text-green" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Title area */}
        <div className="bookings-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="eyebrow dark">BOOKINGS &amp; CONTRACTS</p>
            <h1>Your Bookings</h1>
            <p className="sub-text">
              Track quotations, negotiate with AI, and manage confirmed vendor partners for "{event?.title || "Your Event"}".
            </p>
          </div>

          <Link
            to="/marketplace"
            className="primary-button"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", padding: "10px 18px" }}
          >
            <Store size={16} />
            <span>Explore Marketplace</span>
          </Link>
        </div>

        {/* Tabs switcher */}
        <div className="bookings-tabs-row">
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Quotations <span className="tab-count-badge font-secondary">{pendingQuotes.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Bookings <span className="tab-count-badge font-secondary">{activeBookings.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed <span className="tab-count-badge font-secondary">{completedBookings.length}</span>
          </button>
        </div>

        {/* PENDING QUOTATIONS TAB */}
        {activeTab === "pending" && (
          pendingQuotes.length === 0 ? (
            <div className="bookings-placeholder-pane">
              <div className="placeholder-content">
                <Store size={48} style={{ color: "#2563EB", margin: "0 auto 12px" }} />
                <h3>No Pending Quotations</h3>
                <p>You haven't requested any vendor quotes yet. Visit the Marketplace to explore 48+ verified caterers, decorators, photographers &amp; venues!</p>
                <Link to="/marketplace" className="primary-button" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span>Browse Verified Marketplace</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bookings-grid-workspace">
              {/* Left pane: Quotations List + Selected Detail */}
              <div className="bookings-left-panel">
                <div className="section-title-label">Pending quotations ({pendingQuotes.length})</div>

                <div className="quotation-list-scroll">
                  {pendingQuotes.map((q) => (
                    <div
                      key={q.id}
                      className={`quotation-list-card ${q.id === (activeQuote?.id || selectedQuotationId) ? "active" : ""}`}
                      onClick={() => setSelectedQuotationId(q.id)}
                      style={{ cursor: "pointer", position: "relative" }}
                    >
                      <div className="quote-left-accent" style={{ background: q.iconBg || "#2563EB" }} />
                      <div className="quote-body-info" style={{ flex: 1 }}>
                        <div className="quote-vendor-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong>{q.vendorName}</strong>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className="quote-card-amount">₹{q.amount.toLocaleString("en-IN")}</span>
                            <button
                              type="button"
                              title={`Remove ${q.vendorName} from pending quotations`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectQuote(q);
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#94a3b8",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.color = "#ef4444";
                                (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <div className="quote-category">{q.category} · {q.city || q.eventName}</div>
                        <div className="quote-status-badge">{q.statusText}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quotation Detail card */}
                {activeQuote && (
                  <div className="quotation-detail-card">
                    <div className="detail-header-row">
                      <div>
                        <h3>{activeQuote.vendorName} — Quotation Detail</h3>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                          {activeQuote.category} • {activeQuote.city || event?.city || "Local Verified"}
                        </p>
                      </div>
                      <span className="verified-badge"><ShieldCheck size={14} /> Verified Partner</span>
                    </div>

                    <p className="detail-description-text">{activeQuote.details}</p>

                    <div className="pricing-cards-grid">
                      <div className="pricing-card card-vendor">
                        <span className="price-label">VENDOR PRICE</span>
                        <strong className="price-val">₹{activeQuote.vendorPrice.toLocaleString("en-IN")}</strong>
                      </div>

                      <div className="pricing-card card-budget">
                        <span className="price-label">YOUR BUDGET</span>
                        <strong className="price-val">₹{activeQuote.userBudget.toLocaleString("en-IN")}</strong>
                      </div>

                      <div className="pricing-card card-ai-suggested">
                        <span className="price-label">AI SUGGESTED OFFER</span>
                        <strong className="price-val text-blue">₹{activeQuote.aiOffer.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    <div className="pricing-actions-row">
                      <button
                        className="btn-secondary text-danger"
                        type="button"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onClick={() => handleRejectQuote(activeQuote)}
                      >
                        <Trash2 size={14} />
                        <span>Remove Quotation</span>
                      </button>
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => handleAcceptQuote(activeQuote)}
                      >
                        Accept Quote
                      </button>
                      <button
                        className="btn-primary"
                        type="button"
                        onClick={handleNegotiationSubmit}
                      >
                        Send Negotiation
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right pane: AI Negotiation Assistant */}
              {activeQuote && (
                <div className="bookings-right-panel">
                  <div className="ai-negotiation-header">
                    <div className="spark-box">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3>AI Negotiation Assistant</h3>
                      <p>Customized for {activeQuote.vendorName}</p>
                    </div>
                  </div>

                  <div className="ai-negotiation-body">
                    <div className="negotiation-row-kpi">
                      <div className="kpi-cell">
                        <span>Suggested offer</span>
                        <strong>₹{activeQuote.aiOffer.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="kpi-cell">
                        <span>Potential savings</span>
                        <strong className="text-green">{activeQuote.potentialSavings}</strong>
                      </div>
                    </div>

                    <div className="negotiation-strategy-badge">
                      <span>Negotiation strategy:</span>
                      <strong>{activeQuote.strategy}</strong>
                    </div>

                    <div className="negotiation-reasoning-box">
                      <h4>Reasoning</h4>
                      <p>{activeQuote.reasoning}</p>
                    </div>

                    <div className="confidence-level-indicator">
                      <div className="confidence-label">
                        <span>Confidence score</span>
                        <strong>High · {activeQuote.confidence}%</strong>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${activeQuote.confidence}%` }} />
                      </div>
                    </div>

                    <div className="suggested-message-card">
                      <h4>Suggested message</h4>
                      <div className="message-quote-box">
                        <p>"{activeQuote.suggestedMessage}"</p>
                      </div>
                    </div>

                    <button
                      className="btn-primary w-full send-message-vendor-btn"
                      type="button"
                      onClick={handleNegotiationSubmit}
                    >
                      <span>Send this message to vendor</span>
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* ACTIVE BOOKINGS TAB */}
        {activeTab === "active" && (
          activeBookings.length === 0 ? (
            <div className="bookings-placeholder-pane">
              <div className="placeholder-content">
                <Clock size={48} style={{ color: "#2563EB", margin: "0 auto 12px" }} />
                <h3>No Active Confirmed Bookings Yet</h3>
                <p>When you accept quotations or conclude negotiations, your verified vendor bookings will appear here.</p>
                <button
                  className="dashboard-banner-button"
                  type="button"
                  onClick={() => setActiveTab("pending")}
                >
                  View Pending Quotations
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", marginTop: "1rem" }}>
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <span
                          style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "4px 8px",
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <CheckCircle2 size={12} />
                          CONFIRMED &amp; ACTIVE
                        </span>
                        <h3 style={{ fontSize: "1.15rem", margin: "8px 0 2px", color: "#0f172a" }}>
                          {b.vendorName}
                        </h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                          {b.category} • {b.city || "Local Service"}
                        </p>
                      </div>
                    </div>

                    <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", margin: "0 0 16px" }}>
                      {b.details}
                    </p>

                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#64748b" }}>Agreed Contract Price</span>
                      <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                        ₹{b.amount.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="primary-button"
                      style={{ flex: 1, padding: "8px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      onClick={() => setSelectedContractBooking(b)}
                    >
                      <FileText size={14} />
                      <span>View Contract</span>
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ padding: "8px 12px", fontSize: "12px", color: "#15803d", borderColor: "#86efac", background: "#f0fdf4" }}
                      onClick={() => handleMarkAsCompleted(b)}
                      title="Mark service as completed after event"
                    >
                      Mark Done
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-danger"
                      style={{ padding: "8px 10px", fontSize: "12px" }}
                      onClick={() => handleRejectQuote(b)}
                      title="Cancel Booking"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* COMPLETED TAB */}
        {activeTab === "completed" && (
          completedBookings.length === 0 ? (
            <div className="bookings-placeholder-pane">
              <div className="placeholder-content">
                <Building2 size={48} style={{ color: "#94a3b8", margin: "0 auto 12px" }} />
                <h3>No Completed Bookings Yet</h3>
                <p>When an event concludes and vendor services are delivered, the archived agreements and settled receipts will appear here.</p>
                <button
                  className="dashboard-banner-button"
                  type="button"
                  onClick={() => setActiveTab("active")}
                >
                  View Active Bookings
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", marginTop: "1rem" }}>
              {completedBookings.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <span
                        style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Award size={12} className="text-blue" />
                        COMPLETED &amp; SETTLED
                      </span>
                      <h3 style={{ fontSize: "1.15rem", margin: "8px 0 2px", color: "#0f172a" }}>
                        {c.vendorName}
                      </h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                        {c.category} • {c.city || "Delivered Service"}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "14px 0",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Settled Amount</span>
                    <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                      ₹{c.amount.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ flex: 1, justifyContent: "center", padding: "8px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      onClick={() => setSelectedContractBooking(c)}
                    >
                      <FileText size={14} />
                      <span>View Archival Contract</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-danger"
                      style={{ padding: "8px 10px", fontSize: "12px" }}
                      onClick={() => handleRejectQuote(c)}
                      title="Remove from completed records"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}


        {/* OFFICIAL DIGITAL CONTRACT VIEWER MODAL */}
        {selectedContractBooking && (
          <div
            className="social-modal-backdrop"
            onClick={() => setSelectedContractBooking(null)}
          >
            <div
              className="social-modal-window"
              style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Contract Top Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0f172a", paddingBottom: "16px", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <ShieldCheck size={20} className="text-blue" />
                    <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", color: "#0284c7" }}>
                      EVENTOS SMART ESCROW CONTRACT
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#0f172a", fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Service Agreement &amp; Vendor Contract
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Contract ID: CTR-{selectedContractBooking.id.slice(-8).toUpperCase()} • Generated on {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>

                <button
                  type="button"
                  className="social-modal-close-btn"
                  onClick={() => setSelectedContractBooking(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Parties Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>CLIENT (ORGANIZER)</span>
                  <h4 style={{ margin: "4px 0 2px", fontSize: "14px", color: "#0f172a" }}>{event?.title || "Your Event"}</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                    Location: {event?.city ? `${event.city}${event.state ? `, ${event.state}` : ""}` : "Location not set"}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>SERVICE PROVIDER (VENDOR)</span>
                  <h4 style={{ margin: "4px 0 2px", fontSize: "14px", color: "#0f172a" }}>{selectedContractBooking.vendorName}</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                    Category: {selectedContractBooking.category} • {selectedContractBooking.city || "Verified Partner"}
                  </p>
                </div>
              </div>

              {/* Scope of Work */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "6px", textTransform: "uppercase" }}>
                  1. Scope of Services &amp; Deliverables
                </h4>
                <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", margin: 0, background: "#ffffff", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  {selectedContractBooking.details}
                </p>
              </div>

              {/* Payment & Escrow Milestones */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", textTransform: "uppercase" }}>
                  2. Financial Consideration &amp; Escrow Milestones
                </h4>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#f1f5f9", fontWeight: 700, fontSize: "12px" }}>
                    <span>Milestone Stage</span>
                    <span>Allocation</span>
                    <span>Amount</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderTop: "1px solid #e2e8f0", fontSize: "13px" }}>
                    <span>1. Advance Booking Deposit</span>
                    <span style={{ color: "#64748b" }}>30% (Escrow Locked)</span>
                    <strong>₹{Math.round(selectedContractBooking.amount * 0.3).toLocaleString("en-IN")}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderTop: "1px solid #e2e8f0", fontSize: "13px" }}>
                    <span>2. On-Site Setup &amp; Delivery</span>
                    <span style={{ color: "#64748b" }}>50% (Event Day)</span>
                    <strong>₹{Math.round(selectedContractBooking.amount * 0.5).toLocaleString("en-IN")}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderTop: "1px solid #e2e8f0", fontSize: "13px" }}>
                    <span>3. Final Settlement</span>
                    <span style={{ color: "#64748b" }}>20% (Upon Completion)</span>
                    <strong>₹{Math.round(selectedContractBooking.amount * 0.2).toLocaleString("en-IN")}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "#eff6ff", borderTop: "2px solid #bfdbfe", fontWeight: 800, fontSize: "14px", color: "#1d4ed8" }}>
                    <span>Total Agreed Contract Value</span>
                    <span>100%</span>
                    <span>₹{selectedContractBooking.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees & Terms */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 14px", borderRadius: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#15803d", fontWeight: 700, fontSize: "12px", marginBottom: "4px" }}>
                  <Lock size={14} />
                  <span>EVENTOS ESCROW &amp; BACKUP GUARANTEE</span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#166534", lineHeight: "1.5" }}>
                  This contract is covered by EventOS Escrow Protection. Funds are only released after milestone approval. In the unlikely event of vendor cancellation, EventOS provides an equivalent verified replacement at no additional cost.
                </p>
              </div>

              {/* Signatures */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase" }}>CLIENT SIGNATURE</span>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#0f172a", fontStyle: "italic", margin: "6px 0 2px" }}>
                    {event?.title || "Authorized Organizer"}
                  </div>
                  <span style={{ fontSize: "11px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={11} /> Digitally Signed via EventOS Auth
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase" }}>VENDOR SIGNATURE</span>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#0f172a", fontStyle: "italic", margin: "6px 0 2px" }}>
                    {selectedContractBooking.vendorName}
                  </div>
                  <span style={{ fontSize: "11px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={11} /> Verified Partner Seal (ID: VEN-2026)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSelectedContractBooking(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="primary-button"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  onClick={() => {
                    showToast(`Contract PDF for ${selectedContractBooking.vendorName} downloaded successfully!`);
                  }}
                >
                  <Download size={15} />
                  <span>Download Official PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
