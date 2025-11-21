"use client";
import { useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/signup/", { username, email, password });
      alert("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      alert("Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Sign Up</button>
        </form>
        <p className="mt-4 text-center">Have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
      </div>
    </div>
  );
}