
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashbord/Dashboard';
import Home from './Components/Dashbord/Home';
import Invoices from './Components/Dashbord/Invoices';
import New_Invoice from './Components/Dashbord/New_Invoice';
import Setting from './Components/Dashbord/Setting';
import Invoice_Detail from './Components/Dashbord/Invoice_Detail';
import AddBuying from './Components/Dashbord/AddBuying.';
import ShowBuy from './Components/Dashbord/ShowBuy';
import LandingPage from './Components/Dashbord/LandingPage';
import Progress from './Components/Dashbord/Progress';

function App() {

  const myrouter = createBrowserRouter([
    {path:'/',Component:Login},
    {path:'/login',Component:Login},
    {path:'/register',Component:Register},
    {path:'/choice',Component:LandingPage},

    {path:'/progress',Component:Progress},
    {path:'/dashboard',Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component:Home},
      {path:'invoices',Component:Invoices},
      {path:'new-invoice',Component:New_Invoice},
      {path:'setting',Component:Setting},
      {path:'add',Component:AddBuying},

      {path:'show',Component:ShowBuy},

      {path:'invoice-detail',Component:Invoice_Detail}
    ]}
  
  ])
  
  return (
    <div className="App">
      <RouterProvider router={myrouter}/>
    </div>
  );
}

export default App;
