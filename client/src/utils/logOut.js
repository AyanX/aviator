
import { logOut } from "./fetch_players";

export async function logOutFn(){
    console.log("logging out")
    await logOut()
    window.location.reload();
    return
}


