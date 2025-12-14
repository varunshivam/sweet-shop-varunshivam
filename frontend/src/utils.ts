// utils.ts

/**
 * Returns the current user's role based on localStorage.
 * Never decodes JWT to avoid runtime crashes.
 */
export function getRole(): "admin" | "user" | null {
  const role = localStorage.getItem("role");

  if (role === "admin" || role === "user") {
    return role;
  }

  return null;
}

/**
 * Checks whether the user is authenticated.
 */
export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("token"));
}

/**
 * Logs out the user safely.
 * Clears auth data and redirects to login.
 */
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
}
