import {
    Button, Text,
  } from "@chakra-ui/react";
  import { Link, useNavigate } from "react-router-dom";
  import {
    FiGithub,
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
      <div className="flex justify-center">
        <div
          className="fixed top-0 left-0 w-full bg-white flex-1 h-16 border-b-[1px] 
            border-gray-200 flex justify-between items-center p-4"
        >
          <Link to={"/home"}>
            <img src={Logo} className="h-12" />
          </Link>
          <Button rightIcon={<FiLogIn/>} color="#0C8F8F" onClick={() => navigate("/login")}>login</Button>
        </div>
        <div className="mt-20 p-2 max-w-md flex items-center flex-col">
          <Text textAlign="center">
          On Tribe, you can let your fans become active participants in the work they love by offering them a monthly membership. 
          You give them access to exclusive content, community, and insight into your creative process. 
          In exchange, you get the freedom to do your best work, and the stability you need to build an independent creative career.
          </Text>
          <Button className="mt-8 w-40" leftIcon={<FiGithub/>}>
            Source Code
          </Button>
        </div>
      </div>
    );
  }
  