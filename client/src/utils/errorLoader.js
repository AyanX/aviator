import { Link } from "react-router-dom"
import "./errorLoader.css"

export default function Loading(){
    return <div className="loader-container error-container">
       <div>
       <span className="loader"></span>
       <div><h1>An error occured...Try reloading the page</h1></div>
       <Link to="/">
            <button>HOME</button>
       </Link>
       </div>
    </div>
}