import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PomodoroClock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState("Session");
  const intervalRef = useRef(null);
  const beepRef = useRef(null);
  const timerLabelRef = useRef("Session");

  useEffect(() => {
    timerLabelRef.current = timerLabel;
  }, [timerLabel]);

  // Format mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Reset
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setTimerLabel("Session");
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  // Start / Stop
  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            beepRef.current.play();

            if (timerLabelRef.current === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Length controls
  const handleBreakChange = (amount) => {
    if (!isRunning) {
      setBreakLength((prev) => {
        const newVal = prev + amount;
        if (newVal >= 1 && newVal <= 60) {
          if (timerLabel === "Break") {
            setTimeLeft(newVal * 60);
          }
          return newVal;
        }
        return prev;
      });
    }
  };

  const handleSessionChange = (amount) => {
    if (!isRunning) {
      setSessionLength((prev) => {
        const newVal = prev + amount;
        if (newVal >= 1 && newVal <= 60) {
          if (timerLabel === "Session") {
            setTimeLeft(newVal * 60);
          }
          return newVal;
        }
        return prev;
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">25 + 5 Clock</h1>

      <div className="row mb-4">
        {/* Break Controls */}
        <div className="col">
          <h3 id="break-label">Break Length</h3>
          <div className="d-flex justify-content-center align-items-center">
            <button
              id="break-decrement"
              className="btn btn-danger mx-2"
              onClick={() => handleBreakChange(-1)}
            >
              -
            </button>
            <span id="break-length" className="fs-5 fs-md-3">
              {breakLength}
            </span>
            <button
              id="break-increment"
              className="btn btn-success mx-2"
              onClick={() => handleBreakChange(1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Session Controls */}
        <div className="col" >
          <h3 id="session-label" className="fs-5 fs-md-3">Session Length</h3>
          <div className="d-flex justify-content-center align-items-center">
            <button
              id="session-decrement"
              className="btn btn-danger mx-2"
              onClick={() => handleSessionChange(-1)}
            >
              -
            </button>
            <span id="session-length" className="fs-4">
              {sessionLength}
            </span>
            <button
              id="session-increment"
              className="btn btn-success mx-2"
              onClick={() => handleSessionChange(1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="card p-4 mb-3">
        <h2 id="timer-label">{timerLabel}</h2>
        <h1 id="time-left" className="display-3">
          {formatTime(timeLeft)}
        </h1>
      </div>

      {/* Controls */}
      <div className="mb-4">
        <button
          id="start_stop"
          className="btn btn-primary mx-2"
          onClick={handleStartStop}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          id="reset"
          className="btn btn-secondary mx-2"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Beep Audio */}
      <audio
        id="beep"
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />
    </div>
  );
}

