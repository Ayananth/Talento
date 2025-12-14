import React from "react";
import {  Button } from "flowbite-react";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LoginForm/>
    </div>
  );
}