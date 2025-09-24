import { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [theme] = useState("black"); 
  const navigate = useNavigate();
  // Animation controls
  const controls = useAnimation();

  useEffect(() => {
    // Start floating animation
    controls.start({
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    // Trigger rotation after 5 seconds
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

 const handleLogin = async (e) => {
  e.preventDefault(); // prevent page refresh

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      
      localStorage.setItem("token", data.token);

      
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/home/profile", { replace: true });
    } else {
      alert("❌ Error: " + data.message);
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("Something went wrong. Check backend.");
  }
};




  const themeClasses = {
    black: "bg-black text-white",
  };

  return (
    <div
      className={`h-screen w-screen grid grid-cols-1 md:grid-cols-2 ${themeClasses[theme]}`}
    >
      {/* Left Side */}
      <div className="flex items-center justify-center">
        <motion.div animate={controls}>
          <FaXTwitter className="text-[8rem]" />
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <FaXTwitter className="text-4xl mb-6" />
          <h1 className="text-3xl font-bold mb-6">Sign in to X</h1>

          {/* Login Form */}
          <motion.form
            onSubmit={handleLogin}
            className="space-y-4"
            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-white outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Log in
            </button>
          </motion.form>

          {/* Signup Link */}
          <p className="text-sm mt-6 opacity-80">
            Don’t have an account?{" "}
            <a href="/signup" className="underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
