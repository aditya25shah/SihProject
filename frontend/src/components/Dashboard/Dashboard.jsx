import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import { FaCamera } from "react-icons/fa";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend
);

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [streakDay] = useState(3); // ✅ no warning now


  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  // Generate mock data for 14 days
  const days = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
  const speechData = days.map(() => Math.floor(Math.random() * 50 + 50));
  const recognitionData = days.map(() => Math.floor(Math.random() * 40 + 60));
  const memoryData = days.map(() => Math.floor(Math.random() * 30 + 70));

  const today = days[days.length - 1];
  const todayScores = {
    speech: speechData[speechData.length - 1],
    recognition: recognitionData[recognitionData.length - 1],
    memory: memoryData[memoryData.length - 1],
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "Speech Test",
            data: speechData,
            borderColor: "#C4B5FD",
            backgroundColor: "rgba(196, 181, 253, 0.3)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          },
          {
            label: "Recognition Test",
            data: recognitionData,
            borderColor: "#CBA6F7",
            backgroundColor: "rgba(203, 166, 247, 0.35)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          },
          {
            label: "Memory Game",
            data: memoryData,
            borderColor: "#EADCF8",
            backgroundColor: "rgba(234, 220, 248, 0.3)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#EBD3F8",
              font: { size: 13 },
            },
          },
          title: {
            display: true,
            text: "Performance over Last 14 Days",
            color: "#EBD3F8",
            font: { size: 18, weight: "600" },
          },
        },
        scales: {
          x: {
            ticks: { color: "#EBD3F8" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
          y: {
            ticks: { color: "#EBD3F8" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
        },
      },
    });
  }, );

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Daily Brain Hub 🧠</h1>
        <div className="camera-box">
          <FaCamera className="camera-icon" />
        </div>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        <div className="bento-card">
          <h2>🎙️ Speech Test</h2>
          <p>Practice pronunciation and fluency with our AI speech trainer.</p>
          <button className="action-btn">Start Test</button>
        </div>

        <div className="bento-card">
          <h2>🧠 Recognition Test</h2>
          <p>Test your visual and pattern recognition speed.</p>
          <button className="action-btn">Start Test</button>
        </div>

        <div className="bento-card">
          <h2>🎮 Memory Game</h2>
          <p>Challenge your short-term memory and focus.</p>
          <button className="action-btn">Play Game</button>
        </div>
      </div>

       {/* 🧾 Daily Task Details Section */}
      <div className="task-details">
        <h3>{today} Results</h3>
        <div className="task-box-container">
          <div className="task-box">
            <h4>🎙️ Speech Test</h4>
            <p>Score: <span>{todayScores.speech}</span></p>
          </div>
          <div className="task-box">
            <h4>🧠 Recognition Test</h4>
            <p>Score: <span>{todayScores.recognition}</span></p>
          </div>
          <div className="task-box">
            <h4>🎮 Memory Game</h4>
            <p>Score: <span>{todayScores.memory}</span></p>
          </div>
        </div>
      </div>


      {/* Graph Section */}
      <div className="graph-section">
        <canvas ref={chartRef} height="150"></canvas>
      </div>

     
      {/* Streak Section */}
      <div className="streak-box" onClick={toggleCalendar}>
        <p>🔥 Day {streakDay}</p>
        {showCalendar && (
          <div className="calendar-popup">
            <h4>Your Streak Calendar</h4>
            <div className="calendar-grid">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className={`calendar-day ${
                    i < streakDay ? "active-day" : ""
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
