export function saveAuth({ token, displayName, username }) {
  localStorage.setItem("token", token);
  localStorage.setItem("displayName", displayName || "");

  // ✅ username יציב למפתחות החיפוש
  if (username) localStorage.setItem("username", username);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getDisplayName() {
  return localStorage.getItem("displayName") || "";
}

export function getUsername() {
  return localStorage.getItem("username") || "";
}

export function isLoggedIn() {
  return !!getToken();
}

export function clearAuth() {
  const u = getUsername() || "anon";
  sessionStorage.removeItem(`session_last_results__${u}`);
  sessionStorage.removeItem(`session_last_term__${u}`);

  localStorage.removeItem("token");
  localStorage.removeItem("displayName");
  localStorage.removeItem("username");
}
