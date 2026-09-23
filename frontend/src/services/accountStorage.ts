export interface VendorProfile {
  businessName?: string;
  category?: string;
  categories?: string[];
  experienceYears?: number | string;
  city?: string;
  basePrice?: number;
  phone?: string;
  bio?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "USER" | "VENDOR";
  avatarUrl?: string;
  provider?: string | null;
  vendorProfile?: VendorProfile;
}

export interface RegisteredAccount {
  email: string;
  name: string;
  role: "USER" | "VENDOR";
  password?: string;
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  vendorProfile?: VendorProfile;
  registeredAt?: string;
}

export function saveRegisteredAccount(account: RegisteredAccount) {
  try {
    const key = (account.email || account.name || "").toLowerCase().trim();
    if (!key) return;
    const raw = localStorage.getItem("eventos_registered_accounts");
    const accounts: Record<string, RegisteredAccount> = raw ? JSON.parse(raw) : {};
    accounts[key] = {
      ...account,
      registeredAt: new Date().toISOString(),
    };
    // Also index by name if different
    const nameKey = (account.name || "").toLowerCase().trim();
    if (nameKey && nameKey !== key) {
      accounts[nameKey] = accounts[key];
    }
    localStorage.setItem("eventos_registered_accounts", JSON.stringify(accounts));
  } catch (e) {
    console.error("Failed to save registered account:", e);
  }
}

export function getRegisteredAccount(emailOrName: string): RegisteredAccount | null {
  try {
    const key = (emailOrName || "").toLowerCase().trim();
    if (!key) return null;
    const raw = localStorage.getItem("eventos_registered_accounts");
    if (!raw) return null;
    const accounts: Record<string, RegisteredAccount> = JSON.parse(raw);
    if (accounts[key]) return accounts[key];
    return (
      Object.values(accounts).find(
        (a) =>
          a.email?.toLowerCase().trim() === key ||
          a.name?.toLowerCase().trim() === key
      ) || null
    );
  } catch {
    return null;
  }
}

export function updateRegisteredAccount(emailOrName: string, updates: Partial<RegisteredAccount>) {
  try {
    const existing = getRegisteredAccount(emailOrName);
    if (!existing) return;
    const merged: RegisteredAccount = {
      ...existing,
      ...updates,
      vendorProfile: {
        ...existing.vendorProfile,
        ...updates.vendorProfile,
      },
    };
    saveRegisteredAccount(merged);
  } catch (e) {
    console.error("Failed to update registered account:", e);
  }
}

export function backupAccountData(currentUser: StoredUser | null) {
  if (!currentUser) return;
  const userKey = (currentUser.email || currentUser.name || "default_user").toLowerCase();

  const event = localStorage.getItem("eventos_event");
  const events = localStorage.getItem("eventos_events");
  const bookings = localStorage.getItem("eventos_bookings");
  const activeEventId = localStorage.getItem("eventos_active_event_id");
  const chatThreads = localStorage.getItem("eventos_chat_threads");

  const tasksKeys: Record<string, string> = {};
  const budgetKeys: Record<string, string> = {};
  const invKeys: Record<string, string> = {};
  const rsvpKeys: Record<string, string> = {};
  const vendorCalendarKeys: Record<string, string> = {};
  const vendorReviewsKeys: Record<string, string> = {};
  const vendorServicesKeys: Record<string, string> = {};
  const vendorPortfolioKeys: Record<string, string> = {};
  const vendorMessagesKeys: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith("eventos_tasks_")) tasksKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_budget_")) budgetKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_invitation_")) invKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_rsvps_")) rsvpKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_vendor_calendar_")) vendorCalendarKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_vendor_reviews_")) vendorReviewsKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_vendor_services_")) vendorServicesKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_vendor_portfolio_")) vendorPortfolioKeys[k] = localStorage.getItem(k) || "";
    if (k.startsWith("eventos_vendor_messages_")) vendorMessagesKeys[k] = localStorage.getItem(k) || "";
  }

  const readNotifications = localStorage.getItem("eventos_read_notifications");

  const payload = {
    user: currentUser,
    event: event ? JSON.parse(event) : null,
    events: events ? JSON.parse(events) : null,
    bookings: bookings ? JSON.parse(bookings) : null,
    activeEventId,
    chatThreads: chatThreads ? JSON.parse(chatThreads) : null,
    readNotifications: readNotifications ? JSON.parse(readNotifications) : [],
    tasksKeys,
    budgetKeys,
    invKeys,
    rsvpKeys,
    vendorCalendarKeys,
    vendorReviewsKeys,
    vendorServicesKeys,
    vendorPortfolioKeys,
    vendorMessagesKeys,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`eventos_saved_account_${userKey}`, JSON.stringify(payload));
  } catch (e) {
    console.error("Failed to backup account data:", e);
  }
}

export function restoreAccountData(userObj: StoredUser): boolean {
  const userKey = (userObj.email || userObj.name || "").toLowerCase();
  // Strictly query ONLY backup saved for this specific user account
  const backupRaw = localStorage.getItem(`eventos_saved_account_${userKey}`);

  // Also check registry for registered account vendor details
  const registered = getRegisteredAccount(userObj.email || userObj.name || "");

  try {
    if (backupRaw) {
      const backup = JSON.parse(backupRaw);

      if (backup.event) {
        localStorage.setItem("eventos_event", JSON.stringify(backup.event));
      } else {
        localStorage.removeItem("eventos_event");
      }

      if (backup.events) {
        localStorage.setItem("eventos_events", JSON.stringify(backup.events));
      } else {
        localStorage.removeItem("eventos_events");
      }

      if (backup.bookings) {
        localStorage.setItem("eventos_bookings", JSON.stringify(backup.bookings));
      } else {
        localStorage.removeItem("eventos_bookings");
      }

      if (backup.activeEventId) {
        localStorage.setItem("eventos_active_event_id", backup.activeEventId);
      } else {
        localStorage.removeItem("eventos_active_event_id");
      }

      if (backup.chatThreads) {
        localStorage.setItem("eventos_chat_threads", JSON.stringify(backup.chatThreads));
      } else {
        localStorage.removeItem("eventos_chat_threads");
      }

      if (backup.readNotifications) {
        localStorage.setItem("eventos_read_notifications", JSON.stringify(backup.readNotifications));
      }

      if (backup.tasksKeys) {
        Object.entries(backup.tasksKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.budgetKeys) {
        Object.entries(backup.budgetKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.invKeys) {
        Object.entries(backup.invKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.rsvpKeys) {
        Object.entries(backup.rsvpKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.vendorCalendarKeys) {
        Object.entries(backup.vendorCalendarKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.vendorReviewsKeys) {
        Object.entries(backup.vendorReviewsKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.vendorServicesKeys) {
        Object.entries(backup.vendorServicesKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.vendorPortfolioKeys) {
        Object.entries(backup.vendorPortfolioKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.vendorMessagesKeys) {
        Object.entries(backup.vendorMessagesKeys).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }

      // Restore saved avatar & vendorProfile
      let userModified = false;
      if (backup.user?.avatarUrl && !userObj.avatarUrl) {
        userObj.avatarUrl = backup.user.avatarUrl;
        userModified = true;
      }
      if (backup.user?.vendorProfile && !userObj.vendorProfile) {
        userObj.vendorProfile = backup.user.vendorProfile;
        userModified = true;
      }
      if (userModified) {
        localStorage.setItem("eventos_user", JSON.stringify(userObj));
      }
    } else {
      // Brand new user registration or user with no saved events: clear session events
      localStorage.removeItem("eventos_event");
      localStorage.removeItem("eventos_events");
      localStorage.removeItem("eventos_active_event_id");
      localStorage.removeItem("eventos_bookings");
      localStorage.removeItem("eventos_chat_threads");
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith("eventos_tasks_")) localStorage.removeItem(k);
      }
    }

    // If registered vendor profile exists, ensure userObj is fully populated
    if (registered && registered.vendorProfile) {
      userObj.vendorProfile = {
        ...registered.vendorProfile,
        ...(userObj.vendorProfile || {}),
      };
      if (registered.name && !userObj.name) userObj.name = registered.name;
      if (registered.role) userObj.role = registered.role;
      localStorage.setItem("eventos_user", JSON.stringify(userObj));
    }

    // Dispatch global events so UI updates instantly
    window.dispatchEvent(new CustomEvent("eventos_event_changed"));
    window.dispatchEvent(new CustomEvent("eventos_bookings_changed"));
    window.dispatchEvent(new CustomEvent("eventos_tasks_changed"));
    window.dispatchEvent(new CustomEvent("eventos_user_changed"));

    return true;
  } catch (e) {
    console.error("Failed to restore account data:", e);
    return false;
  }
}

export function clearActiveSession(backupCurrentUser = true) {
  let currentUser: StoredUser | null = null;
  try {
    const s = localStorage.getItem("eventos_user");
    if (s) currentUser = JSON.parse(s);
  } catch {}

  if (backupCurrentUser && currentUser) {
    backupAccountData(currentUser);
  }

  // Clear session keys
  localStorage.removeItem("eventos_token");
  localStorage.removeItem("eventos_user");
  localStorage.removeItem("eventos_event");
  localStorage.removeItem("eventos_events");
  localStorage.removeItem("eventos_active_event_id");
  localStorage.removeItem("eventos_bookings");
  localStorage.removeItem("eventos_read_notifications");
  localStorage.removeItem("eventos_last_saved_account");
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith("eventos_tasks_")) localStorage.removeItem(k);
  }

  // Dispatch events to refresh views to clean state
  window.dispatchEvent(new CustomEvent("eventos_event_changed"));
  window.dispatchEvent(new CustomEvent("eventos_bookings_changed"));
  window.dispatchEvent(new CustomEvent("eventos_tasks_changed"));
  window.dispatchEvent(new CustomEvent("eventos_user_changed"));
}
