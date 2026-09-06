"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Reservation = {
  id: string;
  person: string;
  date: string;
  start: string;
  end: string;
  destination: string;
  note: string;
};

type SupabaseReservation = {
  id: string;
  person: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  destination: string;
  note: string | null;
};

const people = ["お父さん", "お母さん", "太郎", "花子"];
const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseAnonKey.includes("your-anon-key"),
);
const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "short" }).format(
    new Date(`${date}T00:00:00`),
  );
}

export default function Home() {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [person, setPerson] = useState(people[0]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("12:00");
  const [destination, setDestination] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      if (!supabase) {
        setLoading(false);
        setMessage("Supabaseの環境変数を設定すると、共有予約を読み込めます。");
        return;
      }
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reservation_date")
        .order("start_time");
      if (error) {
        setMessage(`予約の読み込みに失敗しました: ${error.message}`);
      } else {
        setReservations((data as SupabaseReservation[]).map((reservation) => ({
          id: reservation.id,
          person: reservation.person,
          date: reservation.reservation_date,
          start: reservation.start_time.slice(0, 5),
          end: reservation.end_time.slice(0, 5),
          destination: reservation.destination,
          note: reservation.note ?? "",
        })));
      }
      setLoading(false);
    }
    void loadReservations();
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const firstCell = new Date(firstDay);
    firstCell.setDate(1 - firstDay.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstCell);
      date.setDate(firstCell.getDate() + index);
      return date;
    });
  }, [month]);

  const selectedReservations = reservations
    .filter((reservation) => reservation.date === selectedDate)
    .sort((a, b) => a.start.localeCompare(b.start));

  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage("先にSupabaseの環境変数を設定してください。");
      return;
    }
    if (!destination.trim()) {
      setMessage("行き先を入力してください。");
      return;
    }
    if (start >= end) {
      setMessage("終了時刻は開始時刻より後にしてください。");
      return;
    }
    const hasConflict = reservations.some(
      (reservation) => reservation.date === selectedDate && start < reservation.end && end > reservation.start,
    );
    if (hasConflict) {
      setMessage("この時間帯には、すでに別の予約があります。");
      return;
    }
    const { data, error } = await supabase.from("reservations").insert({
      person,
      reservation_date: selectedDate,
      start_time: start,
      end_time: end,
      destination: destination.trim(),
      note: note.trim() || null,
    }).select().single();
    if (error || !data) {
      setMessage(error?.code === "23P01" ? "この時間帯には、すでに別の予約があります。" : `予約の保存に失敗しました: ${error?.message ?? "不明なエラー"}`);
      return;
    }
    setReservations((current) => [...current, {
      id: data.id,
      person: data.person,
      date: data.reservation_date,
      start: data.start_time.slice(0, 5),
      end: data.end_time.slice(0, 5),
      destination: data.destination,
      note: data.note ?? "",
    }]);
    setDestination("");
    setNote("");
    setMessage("予約を追加しました。");
  }

  async function removeReservation(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) {
      setMessage(`予約の削除に失敗しました: ${error.message}`);
      return;
    }
    setReservations((current) => current.filter((reservation) => reservation.id !== id));
    setMessage("予約を削除しました。");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">↗</span><div><p className="eyebrow">FAMILY MOBILITY</p><h1>Car Share</h1></div></div>
        <div className="header-status"><span className="status-dot" /> 家族の予定を共有中 <span className="avatar">家</span></div>
      </header>

      <section className="intro">
        <div><p className="eyebrow accent">SHARED CALENDAR</p><h2>車の予定を、ひとつに。</h2><p className="lead">誰が、いつ、どこへ使うか。家族の移動をすっきり見通せます。</p></div>
        <button className="today-button" onClick={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(dateKey(today)); }}>今日に戻る</button>
      </section>

      <div className="dashboard">
        <section className="calendar-panel">
          <div className="calendar-header"><div><span className="eyebrow">SCHEDULE</span><h3>{month.getFullYear()}年 {month.getMonth() + 1}月</h3></div><div className="month-controls"><button aria-label="前の月" onClick={() => changeMonth(-1)}>←</button><button aria-label="次の月" onClick={() => changeMonth(1)}>→</button></div></div>
          <div className="week-row">{weekDays.map((day) => <span key={day} className={day === "日" ? "sunday" : day === "土" ? "saturday" : ""}>{day}</span>)}</div>
          <div className="calendar-grid">{calendarDays.map((date) => {
            const key = dateKey(date);
            const dayReservations = reservations.filter((reservation) => reservation.date === key);
            const isCurrentMonth = date.getMonth() === month.getMonth();
            const isToday = key === dateKey(today);
            return <button key={key} className={`day-cell ${isCurrentMonth ? "" : "muted"} ${key === selectedDate ? "selected" : ""} ${isToday ? "today" : ""}`} onClick={() => setSelectedDate(key)}><span className="date-number">{date.getDate()}</span>{dayReservations.slice(0, 2).map((reservation) => <span className={`event-chip ${reservation.person === "お母さん" ? "coral" : reservation.person === "太郎" ? "blue" : "green"}`} key={reservation.id}>{reservation.person} {reservation.start}</span>)}{dayReservations.length > 2 && <span className="more">+{dayReservations.length - 2}件</span>}</button>;
          })}</div>
          <div className="legend"><span><i className="legend-dot coral" />お母さん</span><span><i className="legend-dot blue" />太郎</span><span><i className="legend-dot green" />お父さん</span></div>
        </section>

        <aside className="side-panel">
          <div className="selected-heading"><div><span className="eyebrow">SELECTED DAY</span><h3>{formatDate(selectedDate)}</h3></div><span className="count">{selectedReservations.length}件</span></div>
          <div className="reservations">{selectedReservations.length === 0 ? <div className="empty"><span>○</span><p>この日の予約はありません</p></div> : selectedReservations.map((reservation) => <article className="reservation" key={reservation.id}><div className="reservation-time"><strong>{reservation.start}</strong><span>{reservation.end}</span></div><div className="reservation-body"><div className="reservation-top"><strong>{reservation.person}</strong><button aria-label={`${reservation.destination}の予約を削除`} onClick={() => removeReservation(reservation.id)}>×</button></div><p>{reservation.destination}</p>{reservation.note && <small>{reservation.note}</small>}</div></article>)}</div>

          <form className="booking-form" onSubmit={handleSubmit}><div className="form-heading"><div><span className="eyebrow">NEW BOOKING</span><h3>予約を追加</h3></div><span className="car-icon">▱</span></div><label>使用する人<select value={person} onChange={(event) => setPerson(event.target.value)}>{people.map((name) => <option key={name}>{name}</option>)}</select></label><div className="time-fields"><label>開始<input type="time" value={start} onChange={(event) => setStart(event.target.value)} /></label><span>から</span><label>終了<input type="time" value={end} onChange={(event) => setEnd(event.target.value)} /></label></div><label>行き先<input required value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="例：駅、スーパー" /></label><label>メモ <span className="optional">任意</span><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="伝えておきたいこと" /></label><button className="submit-button" type="submit">予約を追加 <span>↗</span></button>{message && <p className="form-message" role="status">{message}</p>}</form>
        </aside>
      </div>
      <footer><span>{supabase ? "SUPABASE MODE" : "SETUP REQUIRED"}</span> {loading ? "予約を読み込んでいます" : supabase ? "家族で共有するデータベースに接続しています" : "app/.env.local にSupabaseの設定が必要です"}</footer>
    </main>
  );
}
