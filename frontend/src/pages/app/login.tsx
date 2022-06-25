import { auth } from "../../firebase";
import {
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
} from "firebase/auth";
import { Button, Heading, Spinner, useToast } from "@chakra-ui/react";
import { FaGoogle, FiLogOut } from "react-icons/all";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import {tokenQueryId,getToken} from "../../queries/token"
import { useEffect } from "react";

export default function Login() {
  const toast = useToast();
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  const {isLoading: isLoadingToken, error: tokenError, data: token} = useQuery(tokenQueryId, getToken)
  const handleLogin = () => {
    signInWithRedirect(auth, new GoogleAuthProvider())
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "error signing in",
          isClosable: true,
          status: "error",
          duration: 5000,
        });
      })
  };
  useEffect(() => {
    document.title = "login"
  },[])
  return (
    <div className=" flex justify-center w-full p-4">
      {!isLoadingToken && token && (
        <div className="mt-20 rounded-sm h-60 w-80 py-8 px-8 shadow flex flex-col items-center">
          <Heading  color="#FFAD08">login</Heading>
          <Link className="w-full" to={redirect ? redirect : "/home"}>
            <Button color="#0C8F8F" width={"full"} leftIcon={<FaGoogle />} className="mt-8">
              continue as {token.claims.name?.toString()?.split(" ")[0]}
            </Button>
          </Link>
          <Button
            width={"full"}
            leftIcon={<FiLogOut />}
            className="mt-4"
            onClick={() => signOut(auth)}
          >
            logout
          </Button>
        </div>
      )}
      {!isLoadingToken && !token && (
        <div className="mt-20 rounded-sm h-60 w-80 py-8 px-8 shadow flex flex-col items-center">
          <Heading>login</Heading>
          <Button
            width={"full"}
            leftIcon={<FaGoogle />}
            className="mt-16"
            onClick={handleLogin}
            color="#0C8F8F"
          >
            logn with Google
          </Button>
        </div>
      )}
      {isLoadingToken && <Spinner className="mt-20" />}
    </div>
  );
}
