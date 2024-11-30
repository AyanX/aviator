import React from 'react'
import "./hamburger.css"
import close from "../../icons/close.png"
import { Link } from 'react-router-dom'
import { logOutFn } from '../logOut'


const Hamburger = ({setSmallNav}) => {
  return (
    <div className='hamburger-wrapper'>
    <img  onClick={()=>setSmallNav(false)} src={close} alt="close btn"/>
       <div>
        <ul>
          <li>
            <Link to="cashier">
              <button>DEPOSIT</button>
            </Link>
          </li>
          <li>
            <Link to="cashier/withdraw">
              <button>WITHDRAW</button>
            </Link>
          </li>
          <li>
              <button onClick={()=>{logOutFn()}}>LOG OUT</button>
          </li>
        </ul>
       </div>
    </div>
  )
}

export default Hamburger
