"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email, password, redirect: false
    });

    if (res?.ok) router.push("/dashboard");
    else alert("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" className="w-full p-3 border rounded-lg" required
            value={password} onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">Log In</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          No account? <Link href="/register" className="text-blue-600 font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}