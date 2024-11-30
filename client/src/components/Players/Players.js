import { useState } from "react";
import socket from "../../utils/socket";

import Loading from "../../utils/loader";
export default function Players({ disableBet }) {
  const [players, setPlayers] = useState();
  const [lastUpdateTime, setLastUpdateTime] = useState(0); // New state to track last update time

  socket.on("new_players", (data) => {
    const currentTime = Date.now();
    // Check if 4 seconds have passed since the last update
    if (currentTime - lastUpdateTime < 4500) {
      return;
    }
    setPlayers(data); // Update players state
    setLastUpdateTime(currentTime); // Update the last update time
  });

  function ActivePlayers() {
    return players?.playersWithBets?.map((user, index) => {
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

  function Users() {
    return (
      <>
        <ActivePlayers />
        <div className="more-players">
          <h3>and {players?.count} more </h3>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="active-players">
        <div className="players-container">
          <div className="players-container-header">
            <h2>PLAYERS</h2>
            <h2>AMOUNT</h2>
          </div>
          {players?.playersWithBets && disableBet ? <Users /> : <Loading />}
        </div>
      </div>
    </>
  );
}
