import "./Game.css";


import { useState } from "react";

import Players from "../Players/Players";
import Home from "../Home/Home";
import Stake from "../Stake/stake";
import Plane from "../Plane/Plane";

export default function Game() {
  const [disableBet ,setDisableBet  ] = useState(true)

 
  return (
    <div className="game-wrapper">
      <>
        <Home />
      </>
      <div className="game-wrapper-outer">
        <div className="game">
          <Plane setDisableBet={setDisableBet}/>
          <Stake disableBet={disableBet}/>
        </div>
        <Players disableBet={disableBet}/>
      </div>
    </div>
  );
}
