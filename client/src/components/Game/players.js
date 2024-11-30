import { useEffect, useRef, useState } from "react";

import socket from "../../utils/socket";
export default function PlayersList() {
  
  const playersRef = useRef([]); // Use ref to hold players data
  const [, setRender] = useState(false); // Dummy state to trigger re-render in specific places

  useEffect(() => {
    socket.on("new_players", (data) => {
      playersRef.current = data; // Update the ref with new player data
      setRender((prev) => !prev); // Trigger a limited re-render
    });

    return () => {
      socket.off("new_players"); // Clean up socket listener
    };
  }, []);

  function ActivePlayers() {
    return playersRef.current.map((user, index) => {
      const { player, stake } = user;
      return (
        <div key={index} className="player">
          <div>
            <h3>{player}</h3>
          </div>
          <div>
            <h3>{stake}</h3>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="active-players">
      <ActivePlayers />
    </div>
  );
}
