import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGymClassesByGymId } from "../../store/gymClasses";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import GymClassDetailModal from "../GymClassDetailModal/GymClassDetailModal";
import "./GymClassList.css";

export default function GymClassList() {
  const dispatch = useDispatch();
  const { gymId } = useParams();

  const classes = useSelector(state => Object.values(state.gymClasses.entries));
  const isLoading = useSelector(state => state.gymClasses.isLoading);

  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchGymClassesByGymId(gymId));
  }, [dispatch, gymId]);

  if (isLoading) return <p className="loading">Loading classes...</p>;

  const weekDays = getWeekDays(currentWeekStart);
  const selectedDateString = formatDate(selectedDate);
  const classesForSelectedDate = classes.filter(c => c.date === selectedDateString);

  return (
    <div className="gym-class-list-container">
      <h2>Gym Classes</h2>

      <div className="week-nav">
        <button onClick={() => changeWeek(-1)}>← Previous Week</button>
        <span className="week-range">{formatWeekRange(currentWeekStart)}</span>
        <button onClick={() => changeWeek(1)}>Next Week →</button>
      </div>

      <div className="calendar-week">
        {weekDays.map(day => {
          const dateString = formatDate(day);
          const isSelected = dateString === selectedDateString;
          return (
            <div
              key={dateString}
              className={`calendar-day ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="day-name">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div className="day-number">{day.getDate()}</div>
            </div>
          );
        })}
      </div>

      <h3>Classes for {selectedDate.toDateString()}</h3>
      {classesForSelectedDate.length === 0 ? (
        <p className="no-classes">No classes scheduled for this day.</p>
      ) : (
        <ul className="class-list">
          {classesForSelectedDate.map(c => c.id && (
            <li key={c.id} className="class-card">
              <OpenModalButton
                buttonText={
                  <div className="class-card-content">
                    <strong>{c.name}</strong>
                    <div className="class-time">{c.time} ({c.duration} min)</div>
                    <div className="class-location">Location: {c.location || "TBA"}</div>
                  </div>
                }
                modalComponent={<GymClassDetailModal classId={c.id} />}
                className="full-card-button"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ---- Helpers ----
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function changeWeek(direction) {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
    setSelectedDate(newStart);
  }

  function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
}
