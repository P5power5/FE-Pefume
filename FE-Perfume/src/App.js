import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import AmbienceDifuser from "./components/List-Form-Menu/ambienceDifuser";
import ProductDetails from "./components/List-Product/ProductDetails";
import Soliflores from "./components/List-Form-Menu/soliflores";
import Ondemanh from "./components/List-Form-Menu/onDemand";
import PillowMist from "./components/List-Form-Menu/pilowMist";
import Contact from "./components/List-Form-Menu/contact";
import LynneDeR from "./components/List-Form-Menu/ForWomen/LynneDeR";
import EauDeGrasseForWomen from "./components/List-Form-Menu/ForWomen/EauDeGrasseForWomen";
import EauDeGrasseForMen from "./components/List-Form-Menu/ForMen/EauDeGrasseForMen";
import AquaDivina from "./components/List-Form-Menu/ForWomen/AquaDivina";
import EteIndien from "./components/List-Form-Menu/ForWomen/EteIndien";
import Datsima from "./components/List-Form-Menu/ForWomen/Datsima";
import Oudissimo from "./components/List-Form-Menu/ForWomen/Oudissimo";
import Sakura from "./components/List-Form-Menu/ForWomen/Sakura";
import Category from "./components/List-Form-Menu/ForWomen/Category";
import RockyInTheSky from "./components/List-Form-Menu/ForMen/RockyInTheSky";
import Login from "./components/Login/Login";
import Admin from "../src/components/Admin/Admin";
import ResetpassworForm from "./components/ResetpassForm/ResPasswordForm";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials } from "./components/Login/Redux/Slice/userSlice";
import Order from "./components/Header/Menu/OrderCart";
import PayMent from "./components/Header/Menu/PayMent";
import Sucess from "./components/Header/Menu/Sucess";
import Profile from "./components/Header/Menu/Profile";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // Khi component mount, kiểm tra localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      const { exp } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (exp > now) {
        dispatch(setCredentials({ accessToken: token }));
      } else {
        // Token đã hết hạn, xóa khỏi localStorage
        localStorage.removeItem("accessToken");
      }
    }
  }, [dispatch]);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ambience-difuser" element={<AmbienceDifuser />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/soliflores" element={<Soliflores />} />
          <Route path="/ondemand" element={<Ondemanh />} />
          <Route path="/pillow-mist" element={<PillowMist />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lynne-de-r/:categoryId" element={<LynneDeR />} />
          <Route path="/aqua-divina/:categoryId" element={<AquaDivina />} />
          <Route path="/sakura/:categoryId" element={<Sakura />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route
            path="/eau-de-grasse-for-women/:categoryId"
            element={<EauDeGrasseForWomen />}
          />
          <Route
            path="/eau-de-grasse-for-men"
            element={<EauDeGrasseForMen />}
          />
          <Route path="/ete-indien/:categoryId" element={<EteIndien />} />
          <Route path="/datsima/:categoryId" element={<Datsima />} />
          <Route path="/oudissimo/:categoryId" element={<Oudissimo />} />
          <Route path="/rocky-in-the-sky" element={<RockyInTheSky />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reset-password/:token" element={<ResetpassworForm />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment" element={<PayMent />} />
          <Route path="/VNPay_return" element={<Sucess />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
