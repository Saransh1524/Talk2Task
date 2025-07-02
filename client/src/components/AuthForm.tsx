
import { useState } from "react";
import axios from "@/lib/axios"; // importing axios
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Assuming you're using react-router

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await axios.post(`/auth/${type}`, { email, password });

    if (type === "login") {
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } else {
      alert("Registered! Now login.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border">
      <h2 className="text-3xl font-bold mb-6">
        {type === "login" ? "Login" : "Register"}
      </h2>
      
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 placeholder:text-lg !text-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3 placeholder:text-lg !text-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
      />
      <Button onClick={handleSubmit} className="w-full mb-3 text-lg">
        {type === "login" ? "Login" : "Register"}
      </Button>

      <p className="text-lg text-center">
        {type === "login" ? (
          <>
            New user?{" "}
            <Link to="/register" className="text-blue-600 hover:underline text-lg">
              Register
            </Link>
          </>
        ) : (
          <>
            Not a new user?{" "}
            <Link to="/login" className="text-blue-600 hover:underline text-lg">
              Login
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
