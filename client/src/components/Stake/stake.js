import { useState } from "react";
import socket from "../../utils/socket";

export default function Stake({ disableBet }) {
  const [stake, setStake] = useState(""); // State for stake input
  const [cashOut, setCashOut] = useState(""); // State for cashOut input
  const [betMsg, setBetMsg] = useState("")
  const handleStakeChange = (event) => {
    setStake(event.target.value); // Update stake value on change
  };
  const handleCashOutChange = (event) => {
    setCashOut(event.target.value); // Update cashOut value on change
  };
  const submitData = (e) => {
    e.preventDefault();
    if (stake < 20) {
      if(betMsg){return}
      const stake_err = document.getElementById("stake-err")
      stake_err.classList.toggle("stake-err")
      setTimeout(() => {
        stake_err.classList.toggle("stake-err")
       },500)
      return
    }
    if (stake && cashOut) {
      // Select the button element
      const button = document.getElementById("bet");
      // Change button styles on click
      button.classList.toggle("greenBtn");
      // Handle submit logic here
      const userBet = {
        stake,
        cashOut,
      };
      socket.emit("bet", userBet, (res) => {
        console.log("res: ",res)
        if (res.message) {
          setBetMsg ( res.message )
          setTimeout(() => {
            setBetMsg('')
          }, 5000);
          return 
        }
      });
      
      
      // Reset stake and cashOut values
      setStake("");
      setCashOut("");
      // Reset button style after submission (e.g., 1 second delay)
      setTimeout(() => {
        button.classList.toggle("greenBtn");
      }, 500);
     
      return null
    } else {
      const button = document.getElementById("bet");
      button.classList.toggle("redBtn");
      setTimeout(() => {
        button.classList.toggle("redBtn");
      }, 500);
      return null
    }
  };
  return (
    <div className="stake">
      <form className="stake-form" onSubmit={submitData}>
        <label htmlFor="stake">
          <h4>Stake</h4>
          <input
            type="number"
            name="stake"
            id="stake"
            min="20.00"
            value={stake}
            onChange={handleStakeChange} // Track changes for stake
          />
        </label>
        <h5 id="stake-err">must be greater than 20</h5>
        <label htmlFor="cashOut">
          <h4>Cash Out</h4>
          <input
            type="number"
            max="3000"
            name="cashOut"
            id="cashOut"
            min="1.00"
            value={cashOut}
            onChange={handleCashOutChange} // Track changes for cashOut
          />
        </label>
       
         {betMsg && <h4 className="bet-error">{betMsg}</h4>} 
        
        <div>
          <button
            className="betBtn"
            type="submit"
            disabled={disableBet}
            id="bet"
          >
            <h3>BET</h3>
          </button>
        </div>
      </form>
      
    </div>
  );
}
