import "./App.css";

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import {loader as homePageLoader} from "./components/Home/Home";
import Game from "./components/Game/Game";
import Login, {
  SignUp,
  loginAction,
  signUpAction,
} from "./components/Login/Login";
import { createContext, useState } from "react";
import Cashier, { Bonus, Deposit, Withdraw,loader as cashierLoader,
  depositAction,
  ManualDeposit
 } from "./components/cashier/Cashier";
import Header from "./components/Header/Header";
import ErrorLoader from "./utils/errorLoader"
import { withdrawLoader } from "./utils/Loaders/loaders";


export const userContext = createContext();


export default function App() {

  const [user, setUser] = useState({
    username:"",
    balance: 0,
    isLoggedIn: false,
    phone_number:null
  })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Header/>} errorElement={<ErrorLoader/>}>
        <Route index element={<Game/>} loader={homePageLoader}/>
        <Route path="login" element={<Login />} action={loginAction}/>
        <Route path="sign-up" element={<SignUp />} action={signUpAction} />
        <Route path="sign-up/:code" element={<SignUp/>} action={signUpAction}/>
          
        <Route path="cashier" element={<Cashier />} loader={cashierLoader} >
          <Route index element={<Deposit/>} 
          loader={cashierLoader}
            action={depositAction}
          />
          <Route path="withdraw" element={<Withdraw/>} loader={withdrawLoader}/>
          <Route path="bonus" element={<Bonus/>} loader={withdrawLoader}/>
          <Route path="manual-deposit" element={<ManualDeposit/>}/>
        </Route>
        <Route path="*" element={<ErrorLoader />}/>
      </Route>
    )
  );

  return (
    <userContext.Provider value={{user,setUser}}>
      <RouterProvider router={router} />
    </userContext.Provider>
  );
}
