import { Await, defer, Link, Outlet, useLoaderData } from "react-router-dom";
import "./Home.css";
import { Suspense, useState} from "react";
import { getHomePage } from "../../utils/fetch_players";
import Loading from "../../utils/loader";
import socket from "../../utils/socket";
import { logOutFn } from "../../utils/logOut";
import Hamburger from "../../utils/hamburger/hamburger";
import menu from "../../icons/menu.png"
export async function loader() {
try{
  const data = getHomePage();
  return defer({ data });
}
catch(e){
  return null
}
}

export default function Home() {
  const [bal,setBal] = useState()
  socket.on("balance", bal => setBal(bal))
  const [smallNav , setSmallNav] = useState(false)

  const loaderData = useLoaderData();
  return (
    
   <>
    <Suspense fallback={<div className="loaderHome"><Loading/></div>}>
      <Await resolve={loaderData?.data}>
      {(data) => {
        if(!data) return
         function Nav() {
          
            const { username, phone_number } = data;
            socket.emit("login",phone_number)
            return (
              
              <div className="home-container">
              <div className="hidden-hamburger">
                {smallNav && <Hamburger setSmallNav ={setSmallNav}/>}
              </div>
                <div className="home">
                  <div className="navigation">
                    <Link to="/">
                      <h5 className="logo">AVIATOR.</h5>
                    </Link>
                    <ul>
                    {username && (
                          <Link to="/cashier">
                            <li>
                              {" "}
                              <h5 className="deposit">DEPOSIT</h5>{" "}
                            </li>
                          </Link>
                        )}
                    </ul>
                    <nav>

                      <ul>
                        {username && (
                          <Link to="/cashier/withdraw" className="hide">
                            <li>
                              {" "}
                              <h5>WITHDRAW </h5>{" "}
                            </li>
                          </Link>
                        )}

                        <li>
                          <img onClick={()=>setSmallNav(true)} src={menu} alt="menu" className="hamburger-menu"/>
                        </li>
                        {bal && (
                          
                            <li>
                              {" "}
                              <h5>{bal}</h5>{" "}
                            </li>
                          
                        )}

                        {!username && (
                          <Link to="/login">
                            <li>
                              {" "}
                              <h5>LOGIN </h5>{" "}
                            </li>
                          </Link>
                        )}
                        {username && (
                          
                            <li className="hide" onClick={()=>{logOutFn()}}>
                              {" "}
                              <h5>LOG OUT </h5>{" "}
                            </li>
                          
                        )}
                        {!username && (
                          <Link to="/sign-up">
                            <li>
                              {" "}
                              <h5>SIGN UP </h5>{" "}
                            </li>
                          </Link>
                        )}
                      </ul>
                    </nav>
                  </div>
                  <hr/>
                </div>
                {data && <Outlet/>}
              </div>
            );
          }
          return <Nav/>;
        }
      }
      </Await>
    </Suspense>
   </>
  );
}
