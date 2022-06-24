import {
    Button,
  } from "@chakra-ui/react";
  import { Link, Outlet, useNavigate } from "react-router-dom";
  import {
    FiLogIn,
  } from "react-icons/all";
  import Logo from "../logo.svg";
import { useEffect } from "react";
  
  export default function Landing() {
    const navigate = useNavigate()
    useEffect(()=>{
        document.title = "tribe"
    },[])
    return (
      <div>
        <Outlet />
        <div
          className="fixed top-0 left-0 w-full bg-white flex-1 h-16 border-b-[1px] 
            border-gray-200 flex justify-between items-center p-4"
        >
          <Link to={"/home"}>
            <img src={Logo} className="h-12" />
          </Link>
          <Button rightIcon={<FiLogIn/>} color="#0C8F8F" onClick={() => navigate("/login")}>login</Button>
        </div>
      </div>
    );
  }
  