import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

// Validation Schema
const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is Required")
      .regex(/[a-zA-Z][a-zA-Z ]{3,20}/, "Enter Valid Name"),
    username: zod
      .string()
      .nonempty("Username is Required")
      .regex(/[a-zA-Z][a-zA-Z0-9_]{3,20}/, "Enter Valid Username"),
    email: zod.string().email("Email Not Valid"),
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Valid Password",
      ),
    rePassword: zod.string(),
    dateOfBirth: zod.coerce
      .date()
      .refine(
        (value) => {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 18;
        },
        { message: "User Age Must Be Above 18 Years Old" },
      )
      .transform((value) => value.toLocaleDateString("en-CA")),
    gender: zod.enum(["male", "female"], {
      errorMap: () => ({ message: "Please select your gender" }),
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function Register() {
  // Hooks & States
  const myNavigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form Configuration
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  // API: Sign Up logic
  async function sendUserData(formData) {
    setIsLoading(true);
    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, formData),
      {
        loading: (
          <p className="font-medium text-gray-400 dark:text-slate-500">
            Sign Up...
          </p>
        ),
        success: (response) => {
          myNavigate("/login");
          return (
            <p className="text-green-500 font-medium capitalize">
              {response.data.message}
            </p>
          );
        },
        error: (err) => (
          <p className="text-red-500 font-medium">
            {err.response?.data?.message || "Registration Failed"}
          </p>
        ),
      },
    );
    setIsLoading(false);
  }

  return (
    <>
      <title>Register Page</title>

      <Form
        onSubmit={handleSubmit(sendUserData)}
        className="my-10 w-full max-w-150 flex flex-col gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 mx-auto mt-16 p-8 rounded-[2.5rem]"
      >
        {/* Header Section */}
        <div className="text-center mb-2">
          <h2 className="text-gray-800 dark:text-slate-100 font-extrabold text-4xl tracking-tight mb-2 drop-shadow-sm">
            Create Account
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
            Join us and start connecting today
          </p>
        </div>

        {/* Input Fields */}
        <Input
          {...register("name")}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          label="Your name"
          placeholder="Enter your name"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.name
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        <Input
          {...register("username")}
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message}
          label="Your username"
          placeholder="Enter your username"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.username
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        <Input
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          label="Your email"
          placeholder="Enter your email"
          type="email"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.email
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        <Input
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          label="Password"
          autoComplete="new-password"
          placeholder="Enter your password"
          type="password"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.password
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        <Input
          {...register("rePassword")}
          isInvalid={!!errors.rePassword}
          errorMessage={errors.rePassword?.message}
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          type="password"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.rePassword
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        <Input
          {...register("dateOfBirth")}
          isInvalid={!!errors.dateOfBirth}
          errorMessage={errors.dateOfBirth?.message}
          label="Date Of Birth"
          type="date"
          variant="flat"
          size="lg"
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
            label: errors.dateOfBirth
              ? "text-red-500 font-semibold"
              : "text-gray-600 dark:text-slate-300 font-semibold",
          }}
        />

        {/* Gender Selection */}
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message}
                label="Gender"
                placeholder="Select your gender"
                variant="flat"
                size="lg"
                classNames={{
                  trigger:
                    "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all border border-gray-200/50 dark:border-slate-700/50 rounded-2xl",
                  label: errors.gender
                    ? "text-red-500 font-semibold"
                    : "text-gray-600 dark:text-slate-300 font-semibold",
                }}
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) =>
                  field.onChange(Array.from(keys)[0])
                }
              >
                <SelectItem key="male" textValue="Male">
                  Male
                </SelectItem>
                <SelectItem key="female" textValue="Female">
                  Female
                </SelectItem>
              </Select>
            )}
          />
        </div>

        {/* Footer Links & Buttons */}
        <p className="text-center text-gray-500 dark:text-slate-400 text-sm mt-1">
          Already Have Account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#1877f2] hover:underline transition-colors ml-1"
          >
            Login
          </Link>
        </p>

        <div className="flex gap-3 flex-col w-full mt-2">
          <Button
            className="w-full font-bold bg-[#1877f2] hover:bg-[#166fe5] shadow-lg shadow-blue-500/30 text-white rounded-2xl text-[16px] py-6"
            type="submit"
            isLoading={isLoading}
          >
            Create Account
          </Button>
          <Button
            type="reset"
            className="w-full font-bold bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-300 rounded-2xl text-[16px] py-6 transition-all"
          >
            Reset Fields
          </Button>
        </div>
      </Form>
    </>
  );
}
