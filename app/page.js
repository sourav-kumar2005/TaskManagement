// import Login from "@/components/Login";
import React from "react";
import Tasks from "./Tasks";
import {Toaster} from "react-hot-toast";

export default function Home() {
  return (
    <div className="w-full h-full">
      {/* <Login /> */}
      <Tasks/>
      <Toaster />
    </div>
  );
}
