import { auth } from "../../firebase";
import {
  GoogleAuthProvider,
  signOut,
  User,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";
import { Button, Heading, Spinner, useToast } from "@chakra-ui/react";
import { FaGoogle, FiLogOut } from "react-icons/all";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const [user, setUser] = useState<null | User>();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  useEffect(() => {
    document.title = "Login";
    const unSubAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unSubAuth;
  }, []);
  const handleLogin = () => {
    setLoading(true);
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
      .finally(() => setLoading(false));
  };
  return (
    <div className=" flex justify-center w-full p-4">
      {!loading && user && (
        <div className="mt-20 rounded-sm h-60 w-80 py-8 px-8 shadow flex flex-col items-center">
          <Heading color={"gray.700"}>LogIn</Heading>
          <Link className="w-full" to={redirect ? redirect : "/home"}>
            <Button width={"full"} leftIcon={<FaGoogle />} className="mt-8">
              Continue as {user.displayName?.split(" ")[0]}
            </Button>
          </Link>
          <Button
            width={"full"}
            leftIcon={<FiLogOut />}
            className="mt-4"
            onClick={() => signOut(auth)}
          >
            LogOut
          </Button>
        </div>
      )}
      {!loading && !user && (
        <div className="mt-20 rounded-sm h-60 w-80 py-8 px-8 shadow flex flex-col items-center">
          <Heading color={"gray.700"}>LogIn</Heading>
          <Button
            width={"full"}
            leftIcon={<FaGoogle />}
            className="mt-16"
            onClick={handleLogin}
          >
            LogIn with Google
          </Button>
        </div>
      )}
      {loading && <Spinner className="mt-20" />}
    </div>
  );
}
