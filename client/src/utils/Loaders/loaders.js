
import { cashier } from "../fetch_players";

export async function withdrawLoader(){
    try{
        const userData = await cashier()
        return userData
    }
    catch(e){
        return null
    }
}