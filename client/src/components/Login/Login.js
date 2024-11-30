import {
  Form,
  NavLink,
  redirect,
  useActionData,
  useNavigation,
  Link,
  useParams
} from "react-router-dom";
import phone from "../../icons/call_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png";
import userimg from "../../icons/person_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png";
import lock from "../../icons/lock_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png";
import "./Login.css";
import socket from "../../utils/socket";
import { useEffect, useState } from "react";


export async function loginAction({ request }) {
  const formData = await request.formData();
  const phone_number = formData.get("loginNumber");
  const password = formData.get("loginPassword");

  if (phone_number.length < 10) {
    return { message: "invalid phone number" };
  }
  if (password.length < 5) {
    return { message: "incomplete password" };
  }
  const userData = {
    phone_number,
    password,
  };
  try {
    const data_sent = await fetch("http://localhost:8000/login", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    const res = await data_sent.json()
    if (data_sent.ok) {
      socket.emit("login", phone_number)
      // Redirect to the homepage
      window.location.href = "/"

       // Force a page refresh
      setTimeout (async() => {
        
         window.location.reload();
       }, 400);
      return {message:"login success"}
    } 
      return res
    
  } catch (e) {
    return { message: "try logging in again" };
  }
}
export default function Login() {
  const actionData = useActionData();
  const nav = useNavigation();
  const submitting_state = nav.state;
  return (
    <div className="sign-up-wrapper">
      <div>
      <div className="sign-up-container">
        
        <h3>Continue your journey</h3>
      <h5>
        Log in and experience the thrill of Aviator betting with ease and
        excitement
      </h5>
      <Form method="post">
        <div>
          <label htmlFor="username">
            <img type="text" src={userimg} alt="person" />{" "}
          </label>
          <input
            placeholder="phone number"
            name="loginNumber"
            id="username"
            minLength="10"
            required
          />
        </div>
        <div>
          <label htmlFor="password">
            <img type="password" src={lock} alt="password" />{" "}
          </label>

          <input
            required
            minLength="5"
            placeholder="enter your password"
            type="password"
            name="loginPassword"
            id="password"
          />
        </div>
        <button type="submit">
          {submitting_state === "idle" ? "SUBMIT" : "SUBMITTING"}
        </button>
      </Form>
      <div className="sign_up_feedback">
        {actionData?.message === "success" ? (
          <Link to="/"> <button id="login-home">Home</button> </Link> 
        ) : (
          <p className="error sign-up-error">{actionData?.message}</p>
        )}
      </div>
     </div>
    </div>
    </div>
  );
}

export async function signUpAction({ request }) {
  const formData = await request.formData();
  const phone_number = formData.get("sign_up_number");
  const username = formData.get("sign_up_username");
  const password = formData.get("sign_up_password");
  const password_check = formData.get("sign_up_password_confirm");
  const referral_code = formData.get("referral_code")
  
  if (phone_number.length < 10) {
    return { message: "invalid phone number" };
  }
  if (username < 4) {
    return { message: "short username" };
  }
  if (password.length < 5) {
    return { message: "weak password. Make it 5 or more characters" };
  }

  if (password !== password_check) {
    return { message: "passwords do not match" };
  }

  if(referral_code  ){
    if(referral_code.length > 6){
      return { message: "invalid ref code" };
    }
  }
  const userData = {
    phone_number,
    username,
    password,
    referral_code: referral_code.toUpperCase(),
  };
  
  try {
    const sign_up =  await fetch("http://localhost:8000/sign-up", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const res = await  sign_up.json()
    if(!res.ok){
      return { message: res.message };
    }
  } catch (e) {
    return { message: "try again" };
  }

  return redirect("/login");
}
export function SignUp() {
  const actionData = useActionData();
  const nav = useNavigation();
  const submitting_state = nav.state;
  const {code} = useParams()
  const [refCode ,setRefCode]= useState("")
  
  useEffect(
 ()=>{
  if(code){
    setRefCode(code)
  }
 }

,[])
  return (
    <div className="sign-up-wrapper">
      <div>
      <div className="sign-up-container">
      <h3>Continue your journey</h3>
      <h5>
        Join us and experience the thrill of Aviator betting with ease and
        excitement
      </h5>
      <Form method="post">
        <div>
          <label htmlFor="phone-number">
            <img src={phone} alt="phone" />
          </label>

          <input
            minLength="10"
            name="sign_up_number"
            placeholder="phone number"
            id="phone-number"
            type="number"
            required
          />
        </div>
        <div>
          <label htmlFor="username">
            <img src={userimg} alt="person" />{" "}
          </label>
          <input
            placeholder="username"
            minLength="4"
            required
            maxLength = "10"
            type="text"
            name="sign_up_username"
            id="username"
          />
        </div>
        <div>
          <label htmlFor="password">
            <img type="password" src={lock} alt="password" />
          </label>

          <input
            minLength="5"
            required
            placeholder="enter your password"
            type="password"
            name="sign_up_password"
            id="password"
          />
        </div>
        <div>
          <label htmlFor="password2">
            <img type="password" src={lock} alt="password" />{" "}
          </label>

          <input
            minLength="5"
            required
            placeholder="confirm your password"
            type="password"
            name="sign_up_password_confirm"
            id="password2"
          />
        </div>
        <div style={{paddingLeft:"5px"}}>
        <input
            minLength="5"
            placeholder="REFERRAL CODE - optional"
            name="referral_code"
            value={ refCode}
            onChange={(e)=> {
              setRefCode(e.target.value)
            }}
          />
        </div>
        <button type="submit">
          {submitting_state === "idle" ? "SUBMIT" : "SUBMITTING"}
        </button>
        <div className="sign_up_feedback">
          {actionData?.message === "success" ? (
            <h4 className="success">"Success"</h4>
          ) : (
            <p className="error sign-up-error">{actionData?.message}</p>
          )}
        </div>
      </Form>

      <h4>
        Already have an account ?{" "}
        <span>
          <NavLink to="/login">login</NavLink>{" "}
        </span>
      </h4>
    </div>
      </div>
    </div>
  );
}
