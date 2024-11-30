import { Form, redirect } from "react-router-dom";
import "./Login.css"
import { login } from "../../utils/Loader/fetch";


export async function signAction({request}){
    const formData = await request.formData();
    const phone_number = formData.get("phone_number");
    const password = formData.get("password");
    if(!(phone_number && password)){return}
    const data ={
        phone_number,
        password
    }
    try{
        const res = await login(data)
        if(res.message === 'success'){
            console.log("success")
           return redirect("/home")
        }
        return
    }
    catch(e){
        return
    }
}

export default function Login (){
    return (
       <div className="login-wrapper">
            <Form method="post">
                <input placeholder="phone number" name="phone_number"/> <br/>
                <input placeholder="password" name="password" /> <br/>
                <input type="submit" value="SUBMIT" id="submit"/>
            </Form>
       </div>
    )
}