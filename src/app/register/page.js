"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form)
    });

    if (res.ok) router.push("/login");
    else alert("Registration failed. Email may be taken.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Name" className="w-full p-3 border rounded-lg" required
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
          />
          <input 
            type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" className="w-full p-3 border rounded-lg" required
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} 
          />
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}