import { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { motion, useAnimation } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;
export default function Signup() {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);


  const controls = useAnimation();

  useEffect(() => {
    
    controls.start({
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    const timer = setTimeout(() => {
      controls.start({
        rotateY: [0, 360],
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [controls]);

 const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Signup successful!");
      console.log(data);
     
      window.location.href = "/login";
    } else {
      alert("❌ Error: " + data.message);
      console.error(data);
    }
  } catch (err) {
    console.error("Signup failed:", err);
    alert("Something went wrong. Check backend.");
  }
};


  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2 bg-black text-white">
      {/* Left Side with floating logo */}
      <div className="flex items-center justify-center">
        <motion.div animate={controls}>
          <FaXTwitter className="text-[8rem]" />
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <FaXTwitter className="text-4xl mb-6" />
          <h1 className="text-3xl font-bold mb-6">Create your account</h1>

          {/* Signup Form */}
          <motion.form
            onSubmit={handleSignup}
            className="space-y-4"
            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-white outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-white outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-white outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Sign Up
            </button>
          </motion.form>

          {/* Login Link */}
          <p className="text-sm mt-6 opacity-80">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
