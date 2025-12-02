import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">NutriLog</h1>
          <p className="text-gray-500">Your simple, smart nutrition companion.</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="block w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="block w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}