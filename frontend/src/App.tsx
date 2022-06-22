import { Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";

export default function App() {
  return (
    <Routes>
      <Route index element={<Landing/>}/>
    </Routes>
  )
}