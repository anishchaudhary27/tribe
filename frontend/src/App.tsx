import { Route, Routes } from "react-router-dom";
import Main from "./pages/app";
import Home from "./pages/app/home";
import Settings from "./pages/app/settings";
import Landing from "./pages/landing";

export default function App() {
  return (
    <Routes>
      <Route index element={<Landing/>}/>
      <Route path="*" element={<Main/>}>
        <Route path="home" element={<Home/>}/>
        <Route path="settings" element={<Settings/>}/>
      </Route>
    </Routes>
  )
}