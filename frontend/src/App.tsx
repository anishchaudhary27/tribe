import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import Main from "./pages/app";
import Home from "./pages/app/home";
import Login from "./pages/app/login";
import Profile from "./pages/app/profile";
import Landing from "./pages/landing";
import { tokenQueryId } from "./queries/token";
import { userQueryId } from "./queries/user";

export default function App() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unSubAuth = onAuthStateChanged(auth, (user) => {
      queryClient.invalidateQueries(tokenQueryId);
      queryClient.invalidateQueries(userQueryId);
    });
    return unSubAuth;
  });
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="*" element={<Main />}>
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
