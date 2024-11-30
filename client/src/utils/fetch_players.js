
const HOST = "http://localhost:8000/"


// utils/Fetch_players.js
export async function Fetch_players() {
  try { 
    const response = await fetch(`${HOST}players`);
  const players = await response.json();
  return players;
  }
  catch(e){return}
}

export async function getHomePage() {
  try {
    const data = await fetch(`${HOST}`, {
      credentials:"include"
    })
    const res = await data.json()

  return res 
    }
    catch (e) {
      return null
    }
}

export async function logOut() {
  try {
    const data = await fetch(`${HOST}log-out`, {
      credentials:"include"
    })
    return data
  }
  catch(e){return}
}
export async function cashier() {
  try {
    const data = await fetch(`${HOST}cashier`, {
      credentials:"include"
    })
    return await data.json()
  }
  catch(e){return}
}
export async function submitBet(data) {
  try { const res = await fetch(`${HOST}`, {
    credentials: "include",
    headers: {
      "Content-Type":"application/json"
    },
    method: "post",
    body:JSON.stringify(data)
  })
  const response = await res.json() 
  return response
}
  catch(e) {return}
}
export async function withdrawFunds(amount){
  try { const res = await fetch(`${HOST}cashier/withdraw`, {
    credentials: "include",
    headers: {
      "Content-Type":"application/json"
    },
    method: "post",
    body: JSON.stringify({amount})  
  })
  const response = await res.json() 
  return response
}
  catch(e) {return}
}

export async function deposit(amount){
  try { 
    const res = await fetch(`${HOST}cashier/deposit`, {
    credentials: "include",
    headers: {
      "Content-Type":"application/json"
    },
    method: "post",
    body: JSON.stringify(amount)  
  })
  const response = await res.json() 
  return response
}
  catch(e) {return}
}