import { useNavigate } from "react-router-dom";
import { clearAuth, getDisplayName } from "../auth/auth";
import { ArrowRight } from "lucide-react";

export default function AppHeader({ title, showBack = false }) {
  const nav = useNavigate();

  function logout() {
    clearAuth();
    nav("/");
  }

  return (
    <div className="appHeader">
      <div className="headerRight">
        {showBack ? (
          <button className="iconBtn" onClick={() => nav(-1)} title="חזרה" type="button">
            <ArrowRight size={20} />
          </button>
        ) : (
          <div style={{ width: 42, height: 42 }} />
        )}
      </div>

      <div className="headerTitle">{title}</div>

      <div className="headerLeft">
        <span className="userText">שלום, {getDisplayName()}</span>
        <button className="linkBtn danger" onClick={logout} type="button">
          התנתק
        </button>
      </div>
    </div>
  );
}
