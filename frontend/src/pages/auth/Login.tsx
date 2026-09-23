import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  Mail,
  LockKeyhole,
  User,
  Check,
  ShieldCheck,
  Home,
  X,
  Laptop,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import heroImage from "../../assets/festive_hero.jpg";
import Logo from "../../components/common/Logo";
import { restoreAccountData, getRegisteredAccount } from "../../services/accountStorage";
import { API_BASE_URL } from "../../services/api";

type Role = "organizer" | "vendor";

function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role>("organizer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Social Account Chooser Modal State */
  const [socialModal, setSocialModal] = useState<{
    open: boolean;
    provider: "google" | "facebook" | null;
  }>({ open: false, provider: null });

  const [selectedSocialEmail, setSelectedSocialEmail] = useState("");
  const [customSocialEmail, setCustomSocialEmail] = useState("");
  const [isUsingCustomEmail, setIsUsingCustomEmail] = useState(false);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };


  /* Open Social Account Picker Modal */
  const openSocialChooser = (provider: "google" | "facebook") => {
    const defaultEmail =
      email ||
      (selectedRole === "vendor"
        ? "catering@sribalaji.com"
        : provider === "google"
        ? "priya.raman@gmail.com"
        : "priya.raman@facebook.com");

    setSelectedSocialEmail(defaultEmail);
    setCustomSocialEmail("");
    setIsUsingCustomEmail(false);
    setSocialModal({ open: true, provider });
  };

  /* Confirm sign-in with chosen laptop email */
  const handleConfirmSocialLogin = (chosenEmail: string) => {
    const finalEmail = chosenEmail.trim();
    if (!finalEmail || !finalEmail.includes("@")) {
      setError("Please select or enter a valid email address.");
      return;
    }

    setSocialModal({ open: false, provider: null });
    setLoading(true);
    setError("");

    const isVendor =
      selectedRole === "vendor" ||
      finalEmail.toLowerCase().includes("catering") ||
      finalEmail.toLowerCase().includes("vendor");

    const namePart = finalEmail.split("@")[0].replace(/[._-]/g, " ");
    const userName =
      fullName ||
      namePart.replace(/\b\w/g, (l) => l.toUpperCase()) ||
      (isVendor ? "Vendor Partner" : "Event Organizer");

    const userRole: "USER" | "VENDOR" = isVendor ? "VENDOR" : "USER";

    const userObj = {
      id: `social-${socialModal.provider || "oauth"}-${Date.now()}`,
      name: userName,
      email: finalEmail,
      role: userRole,
      provider: socialModal.provider,
    };

    localStorage.setItem("eventos_token", `token-${socialModal.provider}-${Date.now()}`);
    localStorage.setItem("eventos_user", JSON.stringify(userObj));

    // Restore full user details & celebrations
    restoreAccountData(userObj);

    setTimeout(() => {
      setLoading(false);
      navigate(userRole === "VENDOR" ? "/vendor-dashboard" : "/dashboard");
    }, 350);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const registered = getRegisteredAccount(email || fullName);

      // Verify password for registered accounts
      if (registered && registered.password && registered.password !== password) {
        setError("Incorrect password for this account. Please verify and try again.");
        setLoading(false);
        return;
      }

      const isVendor =
        (registered && registered.role === "VENDOR") ||
        selectedRole === "vendor" ||
        email.toLowerCase().includes("catering") ||
        email.toLowerCase().includes("balaji") ||
        email.toLowerCase().includes("vendor");

      const userRole: "USER" | "VENDOR" = isVendor ? "VENDOR" : "USER";

      /* Try real backend */
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const result = await res.json();
        if (res.ok) {
          const data = result.data ?? result;
          if (data.token) localStorage.setItem("eventos_token", data.token);
          if (data.user) {
            const userWithReg = {
              ...data.user,
              vendorProfile: registered?.vendorProfile || data.user.vendorProfile,
            };
            localStorage.setItem("eventos_user", JSON.stringify(userWithReg));
            restoreAccountData(userWithReg);
            navigate(userWithReg.role === "VENDOR" ? "/vendor-dashboard" : "/dashboard");
            return;
          }
        }
      } catch {
        /* Backend unavailable – use localStorage mock */
      }

      /* Mock authentication with exact record restoration */
      const userObj = {
        id: userRole === "VENDOR" ? (registered?.email ? `vendor-${registered.email}` : "vendor-1") : (registered?.email ? `user-${registered.email}` : "user-1"),
        name: registered?.name || fullName || (userRole === "VENDOR" ? "Vendor Partner" : "Event Organizer"),
        email: registered?.email || email || (userRole === "VENDOR" ? "vendor@business.com" : "user@example.com"),
        role: (registered?.role || userRole) as "USER" | "VENDOR",
        phone: registered?.phone || undefined,
        vendorProfile: registered?.vendorProfile || undefined,
      };

      localStorage.setItem("eventos_token", `mock-token-${Date.now()}`);
      localStorage.setItem("eventos_user", JSON.stringify(userObj));

      // Restore full user details, celebration records, vendor calendar & bookings
      restoreAccountData(userObj);

      navigate(userObj.role === "VENDOR" ? "/vendor-dashboard" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      {/* ─── LEFT SIDE ─── */}
      <section className="login-visual">
        <div
          className="login-hero-image"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
        />
        <div className="login-blue-overlay" />

        <div className="login-visual-content">
          <div style={{ width: "fit-content" }}>
            <Logo variant="light" size="lg" />
          </div>

          <div className="login-hero-text">
            <p className="login-eyebrow">BUILT FOR CELEBRATIONS</p>
            <h1>
              Every detail of your event,
              <br />
              planned with an AI partner
              <br />
              that never sleeps.
            </h1>
            <p className="login-hero-description">
              From the mandap to the menu — EventOS AI coordinates vendors,
              budgets and timelines so you can be present for the moments that
              matter.
            </p>
          </div>

          <div className="login-stats">
            <div className="login-stat">
              <div className="login-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <strong>12,400+</strong>
              <span>Events planned</span>
            </div>
            <div className="login-stat">
              <div className="login-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <strong>3,80,000+</strong>
              <span>Verified vendors</span>
            </div>
            <div className="login-stat">
              <div className="login-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <strong>4.9/5</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RIGHT SIDE ─── */}
      <section className="login-form-side login-form-side-white">
        {/* Organic Multi-Wave Curve Divider between blue and white */}
        <svg
          className="login-curve-divider"
          viewBox="0 0 50 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M50,0 C20,100 2,260 18,460 C32,640 10,800 24,910 C38,970 46,990 50,1000 L50,0 Z"
            fill="#ffffff"
          />
        </svg>

        {/* Concentric rings decoration (like reference UI) */}
        <div className="login-concentric-rings login-rings-tr" />
        <div className="login-concentric-rings login-rings-br" />

        {/* Decorative dot grids */}
        <div className="login-dot-grid login-dot-grid-tr" />
        <div className="login-dot-grid login-dot-grid-bl" />

        {/* Content Container — Exactly matches reference UI */}
        <div className="login-onepage-container">

          {/* Step Progress Bar */}
          <div className="login-steps-bar">

            <div className="login-step active">
              <div className="login-step-circle">1</div>
              <span>Choose role</span>
            </div>
            <div className="login-step-connector" />
            <div className="login-step">
              <div className="login-step-circle">2</div>
              <span>Account details</span>
            </div>
            <div className="login-step-connector" />
            <div className="login-step">
              <div className="login-step-circle">3</div>
              <span>Verify email</span>
            </div>
          </div>

          {/* Heading */}
          <div className="login-onepage-heading">
            <h2>Welcome to EventOS AI</h2>
            <p>How will you use EventOS?</p>
          </div>

          {/* Role Cards (Side by Side) */}
          <div className="role-cards-grid-compact">
            {/* Organizer Card */}
            <button
              type="button"
              className={`role-card-compact ${selectedRole === "organizer" ? "selected" : ""}`}
              onClick={() => handleSelectRole("organizer")}
            >
              {selectedRole === "organizer" ? (
                <div className="role-card-badge-check">
                  <Check size={12} />
                </div>
              ) : (
                <div className="role-card-badge-radio" />
              )}

              <div className="role-card-icon-box blue">
                <ShieldCheck size={18} />
              </div>

              <h3>Event Organizer</h3>
              <p>
                Plan and manage your events with AI — from budget to booking, in one place.
              </p>
            </button>

            {/* Vendor Card */}
            <button
              type="button"
              className={`role-card-compact ${selectedRole === "vendor" ? "selected" : ""}`}
              onClick={() => handleSelectRole("vendor")}
            >
              {selectedRole === "vendor" ? (
                <div className="role-card-badge-check">
                  <Check size={12} />
                </div>
              ) : (
                <div className="role-card-badge-radio" />
              )}

              <div className="role-card-icon-box grey">
                <Home size={18} />
              </div>

              <h3>Vendor</h3>
              <p>
                Offer your services and grow your business with qualified, AI-matched leads.
              </p>
            </button>
          </div>

          {/* Account Details Box */}
          <div className="login-account-card-box">
            {/* Context Badge */}
            <div className="login-role-badge-pill">
              {selectedRole === "organizer" ? (
                <ShieldCheck size={13} />
              ) : (
                <Home size={13} />
              )}
              <span>
                Signing up as{" "}
                <strong>
                  {selectedRole === "organizer" ? "Event Organizer" : "Vendor"}
                </strong>
              </span>
            </div>

            {error && <div className="login-error-compact">{error}</div>}

            <form className="login-form-compact-grid" onSubmit={handleSubmit}>
              {/* Full Name & Email */}
              <div className="compact-field">
                <label htmlFor="login-name">Full name</label>
                <div className="compact-input-wrapper">
                  <User size={15} />
                  <input
                    id="login-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === "vendor" ? "e.g. Sri Balaji Catering" : "e.g. Priya Raman"}
                    required
                  />
                </div>
              </div>

              <div className="compact-field">
                <label htmlFor="login-email">Email address</label>
                <div className="compact-input-wrapper">
                  <Mail size={15} />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === "vendor" ? "vendor@business.com" : "name@example.com"}
                    required
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="compact-field">
                <label htmlFor="login-password">Password</label>
                <div className="compact-input-wrapper">
                  <LockKeyhole size={15} />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "#64748b", fontSize: "10px", cursor: "pointer", padding: "0 2px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>


              <div className="compact-field">
                <label htmlFor="login-confirm">Confirm password</label>
                <div className="compact-input-wrapper">
                  <LockKeyhole size={15} />
                  <input
                    id="login-confirm"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>


              {/* Terms Checkbox */}
              <label className="compact-terms-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="compact-custom-checkbox">
                  <Check size={11} />
                </span>
                <span>
                  I agree to EventOS AI's{" "}
                  <button
                    type="button"
                    className="inline-link-btn"
                    onClick={() => alert("Terms of Service")}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="inline-link-btn"
                    onClick={() => alert("Privacy Policy")}
                  >
                    Privacy Policy
                  </button>
                  , and consent to AI-assisted recommendations based on my event details.
                </span>
              </label>

              {/* Submit Button */}
              <button
                className="compact-submit-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="login-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer with social options & login link */}
            <div className="login-card-footer">
              <div className="login-social-inline">
                <span>Or sign in with:</span>
                <button
                  type="button"
                  className="social-pill-btn"
                  onClick={() => openSocialChooser("google")}
                  title="Sign in with Google"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.73 14.93 1 12 1 7.37 1 3.4 3.67 1.48 7.57l3.69 2.87c.88-2.63 3.34-4.4 6.83-4.4z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.47-1.11 2.71-2.36 3.56l3.66 2.84c2.14-1.98 3.39-4.89 3.39-8.51z" />
                    <path fill="#FBBC05" d="M5.17 10.44c-.23-.69-.36-1.42-.36-2.19s.13-1.5.36-2.19L1.48 3.19C.53 5.09 0 7.23 0 9.5s.53 4.41 1.48 6.31l3.69-2.87c-.23-.69-.36-1.42-.36-2.19z" />
                    <path fill="#34A853" d="M12 18.96c-3.49 0-5.95-1.77-6.83-4.4L1.48 17.43C3.4 21.33 7.37 24 12 24c2.93 0 5.4-.97 7.2-2.63l-3.54-2.75c-1 .67-2.28 1.34-3.66 1.34z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="social-pill-btn"
                  onClick={() => openSocialChooser("facebook")}
                  title="Sign in with Facebook"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              <div className="login-switch-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="inline-link-btn bold"
                  onClick={handleSubmit as any}
                >
                  Log in
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── GOOGLE / FACEBOOK ACCOUNT CHOOSER MODAL (Laptop Accounts) ─── */}
      {socialModal.open && (
        <div
          className="social-modal-backdrop"
          onClick={() => setSocialModal({ open: false, provider: null })}
        >
          <div
            className="social-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="social-modal-top">
              <div className="social-modal-brand-icon">
                {socialModal.provider === "google" ? (
                  <svg viewBox="0 0 24 24" width="26" height="26">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.73 14.93 1 12 1 7.37 1 3.4 3.67 1.48 7.57l3.69 2.87c.88-2.63 3.34-4.4 6.83-4.4z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.47-1.11 2.71-2.36 3.56l3.66 2.84c2.14-1.98 3.39-4.89 3.39-8.51z" />
                    <path fill="#FBBC05" d="M5.17 10.44c-.23-.69-.36-1.42-.36-2.19s.13-1.5.36-2.19L1.48 3.19C.53 5.09 0 7.23 0 9.5s.53 4.41 1.48 6.31l3.69-2.87c-.23-.69-.36-1.42-.36-2.19z" />
                    <path fill="#34A853" d="M12 18.96c-3.49 0-5.95-1.77-6.83-4.4L1.48 17.43C3.4 21.33 7.37 24 12 24c2.93 0 5.4-.97 7.2-2.63l-3.54-2.75c-1 .67-2.28 1.34-3.66 1.34z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </div>
              <button
                className="social-modal-close-btn"
                onClick={() => setSocialModal({ open: false, provider: null })}
                type="button"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="social-modal-heading">
              <h3>
                {socialModal.provider === "google"
                  ? "Choose an account"
                  : "Sign in with Facebook"}
              </h3>
              <p>
                to continue to <strong>EventOS AI</strong>
              </p>
            </div>

            <div className="social-modal-device-badge">
              <Laptop size={14} />
              <span>Which email ID on this laptop would you like to use?</span>
            </div>

            {/* Account List */}
            <div className="social-accounts-list">
              {/* Detected Primary Laptop Account */}
              <div
                className={`social-account-item ${
                  !isUsingCustomEmail && selectedSocialEmail ? "active" : ""
                }`}
                onClick={() => {
                  setIsUsingCustomEmail(false);
                  setSelectedSocialEmail(
                    email ||
                      (selectedRole === "vendor"
                        ? "vendor.contact@gmail.com"
                        : "myaccount@gmail.com")
                  );
                }}
              >
                <div className="social-account-avatar">
                  {(fullName || (selectedRole === "vendor" ? "Vendor" : "User"))
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="social-account-info">
                  <strong>
                    {fullName ||
                      (selectedRole === "vendor"
                        ? "Vendor Partner Account"
                        : "Personal Google Account")}
                  </strong>
                  <span>
                    {selectedSocialEmail ||
                      (selectedRole === "vendor"
                        ? "vendor.contact@gmail.com"
                        : "myaccount@gmail.com")}
                  </span>
                </div>
                {!isUsingCustomEmail && (
                  <Check size={16} className="text-blue" />
                )}
              </div>


              {/* Use another email on this laptop */}
              <div
                className={`social-account-item ${
                  isUsingCustomEmail ? "active" : ""
                }`}
                onClick={() => setIsUsingCustomEmail(true)}
              >
                <div className="social-account-avatar custom">
                  <Plus size={16} />
                </div>
                <div className="social-account-info">
                  <strong>Use another email</strong>
                  <span>Type any email ID from this laptop</span>
                </div>
                {isUsingCustomEmail && (
                  <Check size={16} className="text-blue" />
                )}
              </div>
            </div>

            {/* Custom Email Input */}
            {isUsingCustomEmail && (
              <div className="social-custom-input-box">
                <label>Enter your email address:</label>
                <div className="social-input-wrapper">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={customSocialEmail}
                    onChange={(e) => setCustomSocialEmail(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="social-modal-actions">
              <button
                type="button"
                className="social-modal-cancel"
                onClick={() => setSocialModal({ open: false, provider: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="social-modal-confirm"
                onClick={() => {
                  const targetEmail = isUsingCustomEmail
                    ? customSocialEmail
                    : selectedSocialEmail;
                  handleConfirmSocialLogin(targetEmail);
                }}
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;