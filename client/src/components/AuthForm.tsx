import { useState } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`/auth/${type}`, { email, password });

      if (type === "login") {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      } else {
        alert("Registered successfully! Now login.");
      }
    } catch (err: any) {
      console.error(err);
      // show backend error message if available, otherwise generic
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border">
      <h2 className="text-3xl font-bold mb-6">
        {type === "login" ? "Login" : "Register"}
      </h2>

      {error && (
        <p className="text-red-600 mb-3 text-center">{error}</p>
      )}

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
      <Button
        onClick={handleSubmit}
        className="w-full mb-3 text-lg"
        disabled={loading}
      >
        {loading ? "Please wait..." : type === "login" ? "Login" : "Register"}
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
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline text-lg">
              Login
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
