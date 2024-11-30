import React, { useEffect, useRef, useState } from "react";
import "./solar.css";
import "../Query/mediaQuery.css"
import CryptoJS from "crypto-js";
import { redirect } from "react-router-dom";
import rocketImg from "./rocket.png";
import socket from "../../utils/socket";
import DotsLoader from "../../utils/dotsLoader";

export default function SolarSystemGame({ setDisableBet }) {
  const dataaa = process.env.REACT_APP_NEW_SKIN;
  const canvasRef = useRef(null); // Ref for the canvas element
  const rocketRef = useRef(null); // Ref for the rocket element
  const [duration, setDuration] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [busted, setBusted] = useState(false);
  const [starting, setStarting] = useState(true);
  const [gameEnd, setGameEnd] = useState(false);
  const [sentReq, setSentReq] = useState(0);
  const [eventEmitted, setEventEmitted] = useState(false);
  const [look, setLook] = useState(false);
  const [updateGameData, setUpdateGameData] = useState(true);
  const [gameRunning, setGameRunning] = useState(true);
  const [burstsArray, setBurstsArray] = useState([]);
  let animationInterval, elapsedTimeInterval, resetTimeout, countdownInterval;

  socket.on("new_time", async (data) => {
    if (look) {
      let bytes = CryptoJS.AES.decrypt(data, dataaa);
      let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      setLook(false);
      if (decryptedData && !isNaN(decryptedData) && !sentReq) {
        const parsedData = parseFloat(decryptedData);
        setDuration(parsedData);
        if (decryptedData && !isNaN(decryptedData) && decryptedData > 0) {
          try {
            setTimeout(async () => {
              await launchRocketWithSocketData(decryptedData);
            }, 500);
          } catch (e) {
            redirect("/err");
          }
        }
      }
    }
  });

  socket.on("bursts_array", (burstsData) => {
    setBurstsArray(burstsData);
  });

  socket.on("waiting", (data) => {
    setGameRunning(true);
  });

  socket.on("waiting_done", () => {
    setGameRunning(false);
  });

  if (gameEnd && !sentReq) {
    setSentReq(1);
  }

  const resetRocket = () => {
    try {
      setDisableBet(false);
      setBusted(false);
      setUpdateGameData(true);
      setElapsedTime(0);
      setSentReq(0);
      setEventEmitted(false);
      if (rocketRef.current) {
        rocketRef.current.classList.remove("rocket-animate-up"); // Updated to use ref
        rocketRef.current.classList.add("rocket-animate-down"); // Updated to use ref
      }
      startCountdown();
    } catch (e) {
      console.log("An error occurred", e);
    }
  };

  const startCountdown = () => {
    setUpdateGameData(true);
    let countdownValue = 10;
    setCountdown(countdownValue);
    setEventEmitted(false);
    countdownInterval = setInterval(() => {
      countdownValue -= 1;
      if (countdownValue === 9) {
        socket.emit("game_end");
        setGameRunning(false);
      }
      setCountdown(countdownValue);

      if (countdownValue === 0) {
        setGameRunning(false);
        setGameEnd(true);
        clearInterval(countdownInterval);
      }
      if (countdownValue === 4) {
        socket.emit("get_players");
      }
      if (countdownValue === 2 && !eventEmitted) {
        setTimeout(() => {
          socket.emit("update");
          
          setEventEmitted(true);
        }, 2000);
      }
    }, 1000);
  };

  const clearIntervalsAndTimeouts = () => {
    if (animationInterval) clearInterval(animationInterval);
    if (elapsedTimeInterval) clearInterval(elapsedTimeInterval);
    if (resetTimeout) clearTimeout(resetTimeout);
    if (countdownInterval) clearInterval(countdownInterval);
  };

  useEffect(() => {
    if (starting) {
      setLook(true);
    }
  }, [busted]);

  const launchRocketWithSocketData = (durationFromSocket) => {
    if (isNaN(durationFromSocket) || durationFromSocket <= 0) {
      return;
    }
    setDisableBet(true);
    setTimeout(() => {}, 1000);
    setGameEnd(false);
    setStarting(false);
    clearIntervalsAndTimeouts();
    setElapsedTime(0);
    setBusted(false);

    const totalMilliseconds = durationFromSocket * 1000;
    if (rocketRef.current) {
      rocketRef.current.classList.remove("rocket-animate-down"); // Updated to use ref
      rocketRef.current.classList.add("rocket-animate-up"); // Updated to use ref
    }

    let startTime = Date.now();
    elapsedTimeInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const displayTime = (elapsed / 1000).toFixed(1);

      if (elapsed >= totalMilliseconds) {
        clearInterval(elapsedTimeInterval);
        setElapsedTime(displayTime);
        setBusted(true);
        if (updateGameData) {
          setUpdateGameData(false);
        }
        resetTimeout = setTimeout(resetRocket, 2000);
      } else {
        setElapsedTime(displayTime);
      }
    }, 10);
  };
  let width= 10
  if (window.innerWidth < 280 && window.innerWidth > 240) {
    width = 7
  }
  if (window.innerWidth < 240 && window.innerWidth > 1600) {
    width = 5
  }
  return (
    <div style={styles.wrapper} className="wrapper-solar">
      <div style={styles.container} className="rocket-container">
        <div style={styles.gameContainer}>
          <canvas ref={canvasRef} className="canvas" style={styles.canvas}></canvas>
          {gameRunning ? <DotsLoader /> : " "}
          <div ref={rocketRef} className="rocket" style={styles.rocket}>
            {/* Added ref to rocket element */}
            <div className="rocket-img">
              <img src={rocketImg} alt="rocket" />
            </div>
            <div className="flame" style={styles.flame}>
              🔥
            </div>
          </div>
          {busted && (
            <div style={styles.busted} className="busted">
              <h3 className="busted-details">Busted! {elapsedTime} X</h3>
            </div>
          )}
          <div style={styles.elapsedTime} className="elapsedTime">
            {elapsedTime}
          </div>
          {countdown !== null && countdown > 0 && (
            <div style={styles.countdown} className="countdown">
              {countdown}
            </div>
          )}
        </div>
      </div>
      <div className="previous-plays">
        <ul>
          {burstsArray?.map((eachData, index) => {
            if(index > width) return null
            return (
            <li key={index}>
              <h5>{eachData}</h5>
            </li>)
           }  )}
        </ul>
      </div>
    </div>
  );
}


// Styles for various elements (same as previous)
export const styles = {
  wrapper: {
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
    gap: "5px",
    position:"relative"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: 0,
    backgroundColor: "black",
    overflow: "hidden",
    borderRadius: "10px",
  },
  gameContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  canvas: {
    display: "block",
    width: "100%",
    height: "100%",
  },
  rocket: {
    position: "absolute",
    bottom: "13px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "30px",
    borderRadius: "3px",
    
  },
  flame: {
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%) rotate(180deg)",
    fontSize: "16px",
  },
  busted: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "24px",
    color: "black",
  },
  elapsedTime: {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "18px",
    color: "black",
  },
  countdown: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "48px",
    color: "black",
  },
};
