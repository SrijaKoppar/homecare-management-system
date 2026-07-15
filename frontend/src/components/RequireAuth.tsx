import { Navigate, Outlet } from "react-router-dom";

/**
 * Wraps protected routes. If there's no session token, redirects to
 * /login (the app's landing page for signed-out visitors) instead of
 * letting child routes render and hit the API with no credentials.
 */
export function RequireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

/**
 * Wraps /login. If the visitor already has a session, skip straight to
 * the dashboard instead of showing the login/signup form again.
 */
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
