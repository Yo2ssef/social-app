import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";

// Validation Schema
const schema = zod.object({
  email: zod.string().email("Email Not Valid"),
  password: zod
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Enter Valid Password",
    ),
});

export default function Login() {
  // Hooks & Context
  const { getUserData } = useContext(AuthUserContext);
  const myNavigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form Configuration
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "all",
    resolver: zodResolver(schema),
  });

  // API: Login logic
  async function sendUserLogin(formData) {
    setIsLoading(true);
    try {
      await toast.promise(
        axios.post(`${import.meta.env.VITE_BASE_URL}/users/signin`, formData),
        {
          loading: (
            <p className="font-medium text-gray-400 dark:text-slate-500 capitalize">
              Sign In...
            </p>
          ),
          success: (response) => {
            const { data } = response.data;
            localStorage.setItem("token", data.token);
            getUserData();
            myNavigate("/");
            return (
              <p className="text-green-500 font-medium capitalize">
                {response.data.message}
              </p>
            );
          },
          error: (err) => (
            <p className="text-red-500 font-medium capitalize">
              {err.response?.data?.message || "Login Failed"}
            </p>
          ),
        },
      );
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <title>Login Page</title>

      <Form
        onSubmit={handleSubmit(sendUserLogin)}
        className="my-10 w-full max-w-lg flex flex-col gap-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 mx-auto mt-20 p-8 rounded-[2.5rem]"
      >
        {/* Form Header */}
        <div className="text-center mb-2">
          <h2 className="text-gray-800 dark:text-slate-100 font-extrabold text-4xl tracking-tight mb-2 drop-shadow-sm">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
            Log in to continue your journey
          </p>
        </div>

        {/* Email Input */}
        <Input
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          label="Your email"
          labelPlacement="inside"
          placeholder="Enter your email"
          type="email"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all shadow-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.email
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        {/* Password Input */}
        <Input
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          label="Password"
          labelPlacement="inside"
          autoComplete="current-password"
          placeholder="Enter your password"
          type="password"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all shadow-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.password
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        {/* Redirect Link */}
        <p className="text-center text-gray-500 dark:text-slate-400 text-sm mt-2">
          Dont Have Account ?{" "}
          <Link
            to="/register"
            className="font-bold text-[#1877f2] hover:underline transition-colors ml-1"
          >
            Register
          </Link>
        </p>

        {/* Submit Action */}
        <div className="flex gap-3 flex-col w-full mt-2">
          <Button
            className="w-full font-bold bg-[#1877f2] hover:bg-[#166fe5] shadow-lg shadow-blue-500/30 text-white rounded-2xl text-[16px] py-6"
            type="submit"
            isLoading={isLoading}
          >
            Login
          </Button>
        </div>
      </Form>
    </>
  );
}
