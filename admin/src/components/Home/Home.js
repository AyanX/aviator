import { useLoaderData } from "react-router-dom"
import "./Home.css"
import { Suspense } from "react"


export default function Home(){
    const  loaderData = useLoaderData()
    const   {totalUsers,userNames} = loaderData
    return (
        <div className="home-wrapper">
        <Suspense fallback={<h2>LOading...</h2>} >
            <div className="home-container">
                <div className="details">
                    <h3>DEPOSITS</h3>
                    <h1>1000.00</h1>
                </div>
                <div className="details">
                    <h3>USERS</h3>
                    <h1>{totalUsers}</h1>
                </div>
                
            </div>
            <ul>
                    {userNames.map((user,index)=> <li>{`${index+1} : ${user}`}</li>)}
                </ul>
            </Suspense>
        </div>
    )
}