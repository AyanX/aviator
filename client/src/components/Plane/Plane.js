import SolarSystemGame from "../rocket/SolarSystemGame";



export default function Plane({setDisableBet}) {
    return (
      <div className="aviator">
        <div className="game-section">
          <SolarSystemGame setDisableBet ={setDisableBet}/>
        </div>
      </div>
    );
  }
  