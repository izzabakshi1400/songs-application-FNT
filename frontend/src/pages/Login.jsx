import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/apiClient";
import { saveAuth } from "../auth/auth";

export default function Login() {
  const nav = useNavigate();

  const [mode, setMode] = useState("login"); 
  const isRegister = mode === "register";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const cleanUsername = username.trim();

      if (isRegister) {
        await api.post("/api/auth/register", {
          username: cleanUsername,
          password,
          displayName,
        });

        setSuccess("נרשמת בהצלחה! ניתן כעת להתחבר.");
        setMode("login");
        setPassword("");
        setDisplayName("");
        return;
      }

      // התחברות
      const res = await api.post("/api/auth/login", {
        username: cleanUsername,
        password,
      });

      
      const me = await api.get("/api/me", {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      // שמירה פעם אחת בלבד
      saveAuth({
        token: res.data.token,
        displayName: res.data.displayName,
        username: me.data.username,
      });

      nav("/songs");
    } catch (e2) {
      const msg = e2?.response?.data?.message;
      setError(msg || (isRegister ? "שגיאה בהרשמה." : "שם משתמש או סיסמה שגויים."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginWrap" dir="rtl">
      <div className="card loginCard">
        <h2 style={{ marginTop: 0 }}>{isRegister ? "הרשמה" : "התחברות"}</h2>

        <form onSubmit={onSubmit}>
          <div className="loginField">
            <label>שם משתמש</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="הקלד שם משתמש"
              autoComplete="username"
            />
          </div>

          {isRegister && (
            <div className="loginField">
              <label>שם תצוגה</label>
              <input
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="איך נציג אותך?"
              />
            </div>
          )}

          <div className="loginField">
            <label>סיסמה</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הקלד סיסמה"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          <div style={{ minHeight: 24 }}>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>

          <button className="btn" disabled={loading} style={{ width: "100%", marginTop: 14 }}>
            {loading ? (isRegister ? "נרשם..." : "מתחבר...") : isRegister ? "הרשמה" : "כניסה"}
          </button>
        </form>

        <div style={{ marginTop: 14, opacity: 0.9, textAlign: "center" }}>
          {isRegister ? (
            <>
              כבר יש לך משתמש?{" "}
              <button
                className="linkBtn"
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
              >
                התחבר
              </button>
            </>
          ) : (
            <>
              אין לך משתמש?{" "}
              <button
                className="linkBtn"
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
              >
                הרשמה
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
