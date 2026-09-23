import { useState } from "react";
import {
  Sparkles,
  Download,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Palette,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { API_BASE_URL } from "../../services/api";

interface DesignConcept {
  title: string;
  description: string;
  elements: string[];
}

export default function DesignStudio() {
  const [eventType, setEventType] = useState("");
  const [theme, setTheme] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("#C9A35B");
  const [designType, setDesignType] = useState("");
  const [description, setDescription] = useState("");

  const [generating, setGenerating] = useState(false);
  const [concept, setConcept] = useState<DesignConcept | null>(null);
  const [saved, setSaved] = useState(false);
  const [genError, setGenError] = useState("");

  const designTypes = [
    "Mehendi",
    "Invitation",
    "Decoration",
    "Stage",
    "Mandap",
    "Floral",
    "Lighting",
  ];

  const allSuggestedColors = [
    { name: "Emerald Green", hex: "#004B23" },
    { name: "Antique Gold", hex: "#C9A35B" },
    { name: "Cream Soft", hex: "#F6EFE2" },
    { name: "Royal Navy", hex: "#10294D" },
    { name: "Marigold Yellow", hex: "#E89B17" },
    { name: "Rose Pink", hex: "#E91E8C" },
    { name: "Deep Maroon", hex: "#7B1E1E" },
    { name: "Ivory White", hex: "#FAF7F0" },
  ];

  const toggleColor = (hex: string) => {
    if (colors.includes(hex)) {
      setColors(colors.filter((c) => c !== hex));
    } else {
      setColors([...colors, hex]);
    }
  };

  const addCustomColor = () => {
    if (!colors.includes(customColor)) {
      setColors([...colors, customColor]);
    }
  };

  const handleGenerate = async () => {
    setGenError("");

    if (!eventType || !designType) {
      setGenError("Please select an event type and design type first.");
      return;
    }

    setGenerating(true);
    setConcept(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/design/describe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          theme: theme || "Classic Indian",
          designType,
          colors,
          description,
        }),
      });
      const json = await res.json();
      if (json?.success && json?.data) {
        setConcept(json.data);
      } else {
        throw new Error("Invalid response from design AI");
      }
    } catch {
      setGenError(
        "Could not generate design concept. Please check that the backend is running."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!concept) return;
    const saved = {
      ...concept,
      eventType,
      theme,
      designType,
      colors,
      savedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(
      localStorage.getItem("eventos_designs") || "[]"
    );
    existing.push(saved);
    localStorage.setItem("eventos_designs", JSON.stringify(existing));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDownload = () => {
    if (!concept) return;
    const blob = new Blob(
      [
        `Design Concept: ${concept.title}\n\nDescription:\n${concept.description}\n\nElements:\n${concept.elements.join(", ")}\n\nColors: ${colors.join(", ")}`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${concept.title.replace(/\s/g, "_")}_concept.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="dashboard-main design-studio-page-layout">
        <Header />

        {/* Studio Workspace */}
        <div className="studio-workspace-container">
          {/* Left Column: Design Generator Parameters */}
          <section className="generator-control-panel">
            <div className="panel-title-row">
              <Sparkles className="icon-sparkle" size={18} />
              <h2>Design generator</h2>
            </div>

            <div className="form-field-studio">
              <label>Event type *</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="">Select event type</option>
                <option>Traditional Tamil Wedding</option>
                <option>North Indian Wedding</option>
                <option>Modern Reception</option>
                <option>North Indian Sangeet</option>
                <option>Intimate Engagement</option>
                <option>Birthday Celebration</option>
                <option>Baby Shower</option>
                <option>Corporate Event</option>
              </select>
            </div>

            <div className="form-field-studio">
              <label>Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="">Select theme (optional)</option>
                <option>Temple-inspired Heritage</option>
                <option>Royal Palace Luxury</option>
                <option>Floral Paradise</option>
                <option>Modern Minimalist</option>
                <option>Rustic Outdoor</option>
                <option>Bollywood Glam</option>
              </select>
            </div>

            <div className="form-field-studio">
              <label>Preferred colours</label>
              <div className="swatches-row">
                {allSuggestedColors.map((color) => {
                  const isSelected = colors.includes(color.hex);
                  return (
                    <button
                      key={color.hex}
                      className={`color-swatch-btn ${isSelected ? "selected" : ""}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      onClick={() => toggleColor(color.hex)}
                      type="button"
                    >
                      {isSelected && <Check size={12} className="check-swatch" />}
                    </button>
                  );
                })}
              </div>
              <div className="custom-color-row" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                <Palette size={16} style={{ color: "var(--text-muted)" }} />
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  title="Pick custom colour"
                  style={{ width: "36px", height: "36px", border: "none", cursor: "pointer", borderRadius: "50%" }}
                />
                <button
                  type="button"
                  className="add-swatch-btn"
                  onClick={addCustomColor}
                  title="Add custom colour"
                >
                  + Add colour
                </button>
              </div>
              {colors.length > 0 && (
                <div className="palette-strip-large" style={{ marginTop: "0.5rem" }}>
                  {colors.map((hex, i) => (
                    <div
                      key={i}
                      className="strip-item"
                      style={{ backgroundColor: hex, cursor: "pointer" }}
                      title={`Remove ${hex}`}
                      onClick={() => toggleColor(hex)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="form-field-studio">
              <label>Design type *</label>
              <div className="design-type-grid">
                {designTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`type-grid-btn ${designType === type ? "active" : ""}`}
                    onClick={() => setDesignType(type)}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>
              <button
                className={`full-event-studio-btn ${designType === "Full Event" ? "active" : ""}`}
                onClick={() => setDesignType("Full Event")}
                type="button"
              >
                <span>▣ Full Event</span>
              </button>
            </div>

            <div className="form-field-studio">
              <label>Describe your design</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                placeholder="E.g., A luxury floral backdrop with white roses and golden accents…"
              />
              <span className="char-counter">{description.length}/500</span>
            </div>

            {genError && (
              <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                {genError}
              </p>
            )}

            <button
              className="generate-design-submit-btn"
              onClick={handleGenerate}
              disabled={generating}
              type="button"
            >
              {generating ? (
                <Loader2 size={16} className="login-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              <span>{generating ? "Generating…" : "Generate Design Concept"}</span>
            </button>
          </section>

          {/* Center Column: Render Pane */}
          <section className="generator-render-pane">
            <div className="render-header-row">
              <div>
                <h2>{concept ? concept.title : "Your Design Concept"}</h2>
                <div className="badge-row">
                  {concept && (
                    <>
                      <span className="render-badge ai-badge">✦ AI Generated</span>
                      {designType && (
                        <span className="render-badge">{designType}</span>
                      )}
                      {eventType && (
                        <span className="render-badge">{eventType}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="render-actions">
                <button
                  className="btn-render-action"
                  onClick={handleGenerate}
                  title="Regenerate"
                  disabled={!concept && !generating}
                  type="button"
                >
                  <RotateCcw size={15} />
                  <span>Regenerate</span>
                </button>
                <button
                  className="btn-render-action"
                  onClick={handleDownload}
                  title="Download"
                  disabled={!concept}
                  type="button"
                >
                  <Download size={15} />
                  <span>Download</span>
                </button>
                <button
                  className={`btn-render-action btn-save-design ${saved ? "saved" : ""}`}
                  onClick={handleSave}
                  title="Save Design"
                  disabled={!concept}
                  type="button"
                >
                  <Save size={15} />
                  <span>{saved ? "Saved!" : "Save Design"}</span>
                </button>
              </div>
            </div>

            <div className="render-viewframe">
              {generating ? (
                <div className="generating-overlay">
                  <div className="loading-spinner" />
                  <h3>Creating design concept...</h3>
                  <p>EventOS AI is crafting your unique design.</p>
                </div>
              ) : concept ? (
                <div className="concept-display-card" style={{ padding: "2rem", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <Sparkles size={24} style={{ color: "var(--gold)" }} />
                    <h3 style={{ margin: 0, fontSize: "1.4rem", color: "var(--gold)" }}>
                      {concept.title}
                    </h3>
                  </div>
                  <p style={{ lineHeight: "1.8", color: "var(--text-primary)", fontSize: "1rem", marginBottom: "1.5rem" }}>
                    {concept.description}
                  </p>
                  {colors.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.08em" }}>
                        COLOUR PALETTE
                      </p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {colors.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              backgroundColor: c,
                              border: "2px solid rgba(255,255,255,0.15)",
                            }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="generating-overlay" style={{ opacity: 0.6 }}>
                  <Sparkles size={40} style={{ color: "var(--gold)", marginBottom: "1rem", opacity: 0.5 }} />
                  <h3>Ready to generate</h3>
                  <p>Select an event type and design type, then click Generate.</p>
                </div>
              )}
            </div>

            {concept && (
              <div className="render-caption-card">
                <h4>{concept.title}</h4>
                <p>{concept.description.slice(0, 120)}…</p>
              </div>
            )}
          </section>

          {/* Right Column: Colors, Elements, Concepts */}
          <section className="generator-concepts-panel">
            {/* Color Palette Card */}
            {colors.length > 0 && (
              <div className="palette-card-studio">
                <h3>Colour palette</h3>
                <div className="palette-strip-large">
                  {colors.map((hex, i) => (
                    <div
                      key={i}
                      className="strip-item"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Design Elements list */}
            {concept && concept.elements.length > 0 && (
              <div className="elements-card-studio">
                <h3>Design elements</h3>
                <div className="elements-tags-container">
                  {concept.elements.map((elem) => (
                    <span key={elem} className="element-tag">
                      {elem}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related concepts */}
            {concept && (
              <div className="related-concepts-card">
                <h3>Related concepts</h3>

                <div className="concept-row-item">
                  <div className="concept-image-thumb text-thumb">✿</div>
                  <div className="concept-info-detail">
                    <strong>Mehendi Concept</strong>
                    <p>
                      Peacock & floral motif with gold-dust accents inspired by
                      your colour palette
                    </p>
                  </div>
                </div>

                <div className="concept-row-item">
                  <div className="concept-image-thumb text-thumb">✉</div>
                  <div className="concept-info-detail">
                    <strong>Invitation Concept</strong>
                    <p>
                      Elegant card design with foil printing echoing your{" "}
                      {designType || "event"} theme
                    </p>
                  </div>
                </div>

                <div className="concept-row-item">
                  <div className="concept-image-thumb text-thumb">🏛</div>
                  <div className="concept-info-detail">
                    <strong>Stage Concept</strong>
                    <p>
                      Layered floral backdrop echoing the{" "}
                      {eventType || "event"}'s colour palette
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!concept && (
              <div className="related-concepts-card" style={{ opacity: 0.5, textAlign: "center", padding: "2rem" }}>
                <Palette size={32} style={{ margin: "0 auto 0.75rem", display: "block", color: "var(--gold)" }} />
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Generate a concept to see colours, elements and related ideas.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
