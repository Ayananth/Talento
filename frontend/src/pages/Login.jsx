import { useState } from "react";
import api from "../apis"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      console.log("Calling api")
      const res = await api.post("/v1/auth/sign_in", { email, password });
      console.log(res)
      localStorage.setItem("ACCESS_TOKEN", res.data.access);
      localStorage.setItem("REFRESH_TOKEN", res.data.refresh);
      setLoading(false)
      navigate('/')
      console.log("Login successful");
    } catch (err) {
      alert("Invalid credentials");
    } finally{
        setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>

        <input
          type="email"
          placeholder="email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-500 text-white p-2 rounded mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
