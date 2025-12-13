import React from "react";
// removed framer motion
import {  Button } from "flowbite-react";
import LoginForm from "../components/LoginForm";
import { Navbar } from '../../auth/components/Navbar'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar role="admin"/>

      {/* Login Section */}
      <LoginForm/>

    </div>
  );
}