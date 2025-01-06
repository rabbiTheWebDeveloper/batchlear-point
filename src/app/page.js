"use client";
import Loading from "@/componet/ui/loading";
import { BASE_URL } from "@/constant";
import { isAuthenticated, setRole, setToken, setUser } from "@/lib/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBullseye } from "react-icons/fa";

const Signin = () => {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, []);
  // API calling function
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true); // Show loading state
    setError("");
    // Clear previous errors
    const data = {
      email,
      password,
    };
    try {
      const response = await axios.post(`${BASE_URL}/user/login-user`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.status === 200) {
        // Handle errors from the server
        throw new Error(data.message || "Something went wrong!");
      }
      if (response.status === 200) {
        // Set authentication data
        const tokenSet = setToken(response.data.token);
        const userSet = setUser(response.data.data);
        const roleSet = setRole(response.data.data.role);

        if (!tokenSet || !userSet || !roleSet) {
          throw new Error('Failed to set authentication data');
        }

        toast.success('Login Successful');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
        
        return { success: true };
      }
      // Handle successful login
      // console.log("Login successful:", data);
      // Redirect to another page, e.g., dashboard
      // router.push("/dashboard");
    } catch (error) {
      setError(error.message); // Show error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (isLoading) return <Loading />;
  return (
    <main className="w-full h-auto sm:h-[100vh] bg-blue-500 flex items-center justify-center sm:p-0 p-6">
      <form
        className="w-full sm:w-[40%] bg-white rounded-lg sm:py-6 sm:px-8 p-4 flex items-center justify-center flex-col gap-5"
        onSubmit={handleLogin}
      >
        <h3 className="text-[1.8rem] font-[700] text-gray-900">
          Sign in Batchlar Point
        </h3>

        {/* Error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="py-3 px-4 border focus:outline-blue-500 border-gray-300 mt-5 rounded-lg w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <div className="w-full relative">
          <input
            type={active ? "text" : "password"}
            placeholder="Password"
            className="py-3 px-4 border focus:outline-blue-500 border-gray-300 rounded-lg w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {active ? (
            <BsEyeSlash
              className="absolute top-[30%] right-[5%] text-[1.2rem] text-gray-500 cursor-pointer"
              onClick={() => setActive(false)}
            />
          ) : (
            <FaBullseye
              className="absolute top-[30%] right-[5%] text-[1.2rem] text-gray-500 cursor-pointer"
              onClick={() => setActive(true)}
            />
          )}
        </div>

        <Link href="#" className="text-[1rem] text-blue-500 font-[500]">
          Forget password
        </Link>

        {/* Submit button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 ${
            loading ? "bg-gray-500" : "bg-blue-500"
          } text-white border-none outline-none rounded-lg mt-3`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center justify-center w-full gap-1">
          <span className="text-[1rem] text-gray-600 font-[500]">
            Don't have an account?{" "}
          </span>
          <span>
            <Link
              href={"/signup"}
              className="text-[1rem] text-blue-500 font-[500]"
            >
              Signup
            </Link>
          </span>
        </div>
      </form>
    </main>
  );
};

export default Signin;
