import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/apiClient";
import { Play, Pause } from "lucide-react";
import AppHeader from "../components/AppHeader";
import AppBrand from "../components/AppBrand";

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SongDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | done | notfound | error

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");
        setIsPlaying(false);
        setCurrent(0);
        setDuration(0);

        const res = await api.get(`/api/music/lookup/${encodeURIComponent(id)}`);
        if (cancelled) return;

        setItem(res.data);
        setStatus("done");
      } catch (e) {
        const httpStatus = e?.response?.status;
        if (!cancelled) setStatus(httpStatus === 404 ? "notfound" : "error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => setCurrent(el.currentTime || 0);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [status, item?.previewUrl]);

  useEffect(() => {
    return () => {
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    };
  }, []);

  async function togglePlay() {
    const el = audioRef.current;
    if (!el || !item?.previewUrl) return;

    if (el.paused) {
      try {
        await el.play();
      } catch {
      }
    } else {
      el.pause();
    }
  }

  function seekTo(value) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Number(value);
    setCurrent(el.currentTime);
  }

  if (status === "loading") return <div className="page">טוען...</div>;
  if (status === "notfound") return <div className="page">פריט לא נמצא.</div>;
  if (status === "error") return <div className="page">שגיאה בטעינת פרטים.</div>;
  if (!item) return <div className="page">פריט לא נמצא.</div>;

  const hasAudio = !!item.previewUrl;

  return (
    <div className="page">
      <AppBrand />
      <AppHeader title="פרטי שיר" showBack />

      <div className="detailsLayout">
        <div className="detailsGrid">
          <div className="albumWrap albumWrapLg">
            <img className="detailsImg detailsImgLg" src={item.imageUrl} alt="" />

            <button
              type="button"
              className="albumPlayBtn albumPlayBtnLg"
              onClick={togglePlay}
              disabled={!hasAudio}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={30} /> : <Play size={30} />}
            </button>
          </div>

          <div className="detailsText">
            <h2 className="songTitle">{item.title}</h2>
            <div className="songArtist">{item.artist}</div>

            <div className="detailsMeta">
              <b>תאריך יציאה:</b>{" "}
              {item.releaseDate ? new Date(item.releaseDate).toLocaleDateString("he-IL") : "—"}
            </div>

            <div className="detailsDesc">
              <b>תיאור:</b>
              <div className="detailsDescBody">{item.description?.trim() ? item.description : "—"}</div>
            </div>
          </div>
        </div>

        {hasAudio && (
          <div className="detailsPlayerBottom">
            <div className="playerTimes">
              <span>{formatTime(current)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <input
              className="playerSeek"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(current, duration || 0)}
              onChange={(e) => seekTo(e.target.value)}
            />
          </div>
        )}

        {hasAudio && <audio ref={audioRef} src={item.previewUrl} preload="metadata" />}
      </div>
    </div>
  );
}
