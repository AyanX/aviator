const URL = "http://localhost:8000"

export async function loader(){
    try{ 
        const res = await fetch(`${URL}/admin`)
        return await res.json()
    }
    catch(e){
        return
    }
}

export async function login(data) {
    try { 
     const res = await fetch(`${URL}/admin`, {
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