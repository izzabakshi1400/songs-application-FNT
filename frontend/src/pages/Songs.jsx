import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/apiClient";
import { getUsername } from "../auth/auth";
import { Search } from "lucide-react";
import AppHeader from "../components/AppHeader";
import AppBrand from "../components/AppBrand";


export default function Songs() {
  const nav = useNavigate();

  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [term, setTerm] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = getUsername() || "anon";

  const { RECENT_KEY, SESSION_RESULTS_KEY, SESSION_TERM_KEY } = useMemo(() => {
    return {
      RECENT_KEY: `recent_searches__${username}`, 
      SESSION_RESULTS_KEY: `session_last_results__${username}`, 
      SESSION_TERM_KEY: `session_last_term__${username}`, 
    };
  }, [username]);
  

  useEffect(() => {
    const rawRecent = localStorage.getItem(RECENT_KEY);
    setRecentSearches(rawRecent ? JSON.parse(rawRecent) : []);

    const rawItems = sessionStorage.getItem(SESSION_RESULTS_KEY);
    const rawTerm = sessionStorage.getItem(SESSION_TERM_KEY);

    if (rawItems) setSongs(JSON.parse(rawItems));
    if (rawTerm) setTerm(rawTerm);
  }, [RECENT_KEY, SESSION_RESULTS_KEY, SESSION_TERM_KEY]);

  function pushRecentSearch(q) {
    const cleaned = q.trim();
    if (!cleaned) return;

    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((x) => x !== cleaned)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function searchSongs(q) {
    setLoading(true);
    try {
      const res = await api.get(`/api/music/search?term=${encodeURIComponent(q)}`);
setSongs(res.data.items);
setHasMore(res.data.items.length === 20);
      sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(res.data.items));
      sessionStorage.setItem(SESSION_TERM_KEY, q);

      pushRecentSearch(q);
    } catch {
      setError("שגיאה בחיפוש");
    } finally {
      setLoading(false);
    }
  }

  const canSearch = term.trim().length > 0 && !loading;

  return (
    <div className="page">
      <AppBrand />
      <AppHeader title="שירים" />

      {error && <div className="error">{error}</div>}

      <div className="card">
        <form
          className="searchRow"
          onSubmit={(e) => {
            e.preventDefault();
            if (!term.trim()) return;
            setError("");
            searchSongs(term);
          }}
        >
          <input
            className="input"
            placeholder="חפש שיר / אומן"
            value={term}
            onChange={(e) => {
              const v = e.target.value;
              setTerm(v);

              sessionStorage.setItem(SESSION_TERM_KEY, v);
            }}
          />

          <button className="btn" title="חפש" disabled={!canSearch}>
            {loading ? "..." : <Search size={18} />}
          </button>
        </form>

        {recentSearches.length > 0 && (
          <>
            <div className="recentTitle">5 חיפושים אחרונים:</div>
            <div>
              {recentSearches.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chip"
                  disabled={loading}
                  onClick={() => {
                    setTerm(q);
                    sessionStorage.setItem(SESSION_TERM_KEY, q);

                    setError("");
                    searchSongs(q);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr>
                <th>שם השיר</th>
                <th>אומן</th>
                <th>תיאור</th>
                <th>תמונת אלבום</th>
              </tr>
            </thead>

            <tbody>
              {songs.map((s) => (
                <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => nav(`/songs/${s.id}`)}>
                  <td>{s.title || "—"}</td>
                  <td>{s.artist || "—"}</td>
                  <td>{s.description?.trim() ? s.description : "—"}</td>
                  <td>
                    <img className="albumImg" src={s.imageUrl} alt="" />
                  </td>
                </tr>
              ))}
{hasMore && !loading && (
  <div style={{ marginTop: 10, opacity: 0.85 }}>
    מוצגות 20 תוצאות ראשונות — ייתכן ויש תוצאות נוספות.
  </div>
)}

              {songs.length === 0 && !loading && (
                <tr>
                  <td colSpan="4">אין תוצאות</td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="4">טוען...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
