
import './App.css';
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Home from './components/Home/Home';
import Login ,{signAction} from './components/Login/Login';
import { loader } from './utils/Loader/fetch';

function Header(){
  return <div>
    <Outlet/>
  </div>
}


function App() {
 const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Header/>} errorElement={<h1>An error occured</h1>}>
      <Route index element = {<Login/>} action={signAction}/>
      <Route path='home' element={<Home/>} loader={loader}/>
    </Route>
  )
 )
  return <div className='app-wrapper'>
    <RouterProvider router={router} />
  </div>
}

export default App;
