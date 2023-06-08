/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Users from "./pages/Users";
import Services from "./pages/Services/Services";
import Booking from "./pages/Booking/Booking";
import Product from "./pages/Product/Product";
import './assets/styles/public.css'
import UserDetails from "./pages/UserDetails";
import ServiceDetails from "./pages/Services/ServiceDetails";
import ProductDetails from "./pages/Product/ProductDetails";
import UploadFile from "./pages/UploadFile";
import BookingDetails from "./pages/Booking/BookingDetails";
import Items from "./pages/Items";
import Videos from "./pages/Videos";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Calendar from "./pages/Calendar/Calendar";

function App() {
  if ((sessionStorage.getItem("token")?.length > 10))
    return (
      <div className="App">
        <ToastContainer />
        <Switch>
          {/* <Route path="/sign-up" exact component={SignUp} />
          <Route path="/sign-in" exact component={SignIn} /> */}
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/" component={Home} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/users/:username" component={UserDetails} />

            <Route exact path="/services" component={Services} />
            <Route exact path="/services/:id" component={ServiceDetails} />

            <Route exact path="/booking" component={Booking} />
            <Route exact path="/booking/:id" component={BookingDetails} />

            <Route exact path="/product" component={Product} />
            <Route exact path="/product/:id" component={ProductDetails} />

            <Route exact path="/calendar" component={Calendar} />



            <Route exact path="/tables" component={Tables} />
            <Route exact path="/billing" component={Billing} />
            {/* <Route exact path="/rtl" component={Rtl} /> */}
            <Route exact path="/profile" component={Profile} />
            {/* <Redirect from="*" to="/dashboard" /> */}

            <Route exact path="/upload" component={UploadFile} />
            <Route exact path="/item" component={Items} />
            <Route exact path="/videos" component={Videos} />
          </Main>
          <Route path="*" component={SignUp} />
        </Switch>

      </div>
    )
  else return (
    <>
      <ToastContainer />
      <SignIn />
    </>
  )
}

export default App;
