import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";
import { ArrowLeft } from "iconsax-reactjs";

// Validation Schema
const schema = zod
  .object({
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Valid Password",
      ),
    newPassword: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Valid Password",
      ),
  })
  .refine(({ password, newPassword }) => password !== newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export default function ChangePassword() {
  // Hooks & States
  const myNavigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form Configuration
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  // API: Change Password logic
  async function sendUserData(formData) {
    setIsLoading(true);
    try {
      await toast.promise(
        axios.patch(
          `${import.meta.env.VITE_BASE_URL}/users/change-password`,
          formData,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        ),
        {
          loading: (
            <p className="font-medium text-gray-400 dark:text-slate-500">
              Updating...
            </p>
          ),
          success: (response) => {
            const newToken = response?.data?.data?.token;
            localStorage.setItem("token", newToken);
            myNavigate("/posts");
            return (
              <p className="text-green-500 font-medium capitalize">
                {response.data.message}
              </p>
            );
          },
          error: (err) => (
            <p className="text-red-500 font-medium">
              {err.response?.data?.message || "Update Failed"}
            </p>
          ),
        },
      );
    } catch (err) {
      console.error("Change Password Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <title>Change Password</title>

      {/* Navigation: Back Button */}
      <div className="container mx-auto lg:px-96 md:px-33 px-4">
        <Link
          className="my-6 inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-800/90 px-5 py-2.5 rounded-full transition-all w-fit group"
          to="/posts"
        >
          <ArrowLeft
            size="24"
            className="text-[#1877f2] group-hover:-translate-x-1 transition-transform"
            variant="TwoTone"
          />
          <span className="font-bold text-gray-700 dark:text-slate-200 text-sm tracking-wide">
            Back to posts
          </span>
        </Link>
      </div>

      {/* Change Password Form */}
      <Form
        onSubmit={handleSubmit(sendUserData)}
        className="my-10 w-full max-w-125 flex justify-center items-center flex-col gap-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 mx-auto mt-8 p-8 rounded-[2.5rem]"
      >
        {/* Header */}
        <div className="text-center mb-2 w-full">
          <h2 className="text-gray-800 dark:text-slate-100 font-extrabold text-3xl tracking-tight mb-2 drop-shadow-sm">
            Change Password
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
            Keep your account secure
          </p>
        </div>

        {/* Current Password Input */}
        <Input
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          label="Current Password"
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

        {/* New Password Input */}
        <Input
          {...register("newPassword")}
          isInvalid={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
          label="New Password"
          labelPlacement="inside"
          autoComplete="new-password"
          placeholder="Enter Your New Password"
          type="password"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all shadow-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.newPassword
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2 font-bold bg-[#1877f2] hover:bg-[#166fe5] shadow-lg shadow-blue-500/30 text-white rounded-2xl text-[16px] py-6"
        >
          Update Password
        </Button>
      </Form>
    </>
  );
}
