import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const schema = zod
  .object({
    name: zod
      .string("Name Must Be Text")
      .regex(/[a-zA-Z][a-zA-Z ]{3,20}/, "Enter Vaild Name")
      .nonempty("Name is Requierd"),
    username: zod
      .string("Username Must Be Text")
      .regex(/[a-zA-Z][a-zA-Z0-9_]{3,20}/, "Enter Vaild Username")
      .nonempty("Username is Requierd"),
    email: zod.email("Email Not Valid"),
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Vaild Password",
      ),
    rePassword: zod.string(),
    dateOfBirth: zod.coerce
      .date()
      .refine(
        function (value) {
          const today = new Date();
          const birthUser = value;
          const age = today.getFullYear() - birthUser.getFullYear();
          if (age > 18) {
            return true;
          }
          return false;
        },
        { error: "User Age Must  Be Above 18 Years Old" },
      )
      .transform(function (value) {
        return value.toLocaleDateString("en-CA");
      }),
    gender: zod.enum(["male", "female"]),
  })
  .refine(
    function ({ password, rePassword }) {
      if (password === rePassword) {
        return true;
      }
      return false;
    },
    { error: "Password and Repassword not same", path: ["rePassword"] },
  );

export default function Register() {
  const myNavigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
  async function sendUserData(x) {
    setIsLoading(true);
    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, x),
      {
        loading: <p className="font-medium text-gray-400">Sign Up...</p>,
        success: function (mess) {
          myNavigate("/login");
          return (
            <p className="text-green-500 font-medium capitalize">
              {mess.data.message}
            </p>
          );
        },
        error: function (mess) {
          return <p className="text-red-500 font-medium">{mess.errors}</p>;
        },
      },
    );
    setIsLoading(false);
  }
  return (
    <>
      <title>Register Page</title>

      <Form
        onSubmit={handleSubmit(sendUserData)}
        className="my-10 w-full max-w-lg flex flex-col gap-4 bg-white border border-gray-400/60 shadow-2xl mx-auto mt-8 p-6 rounded-3xl"
      >
        <h2 className="text-cyan-500 self-center font-bold text-4xl mb-2">
          Register
        </h2>
        <Input
          {...register("name")}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          label="Your name"
          labelPlacement="inside"
          placeholder="Enter your name"
          type="text"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.name ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <Input
          {...register("username")}
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message}
          label="Your username"
          labelPlacement="inside"
          placeholder="Enter your username"
          type="text"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.username ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <Input
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          label="Your email"
          labelPlacement="inside"
          placeholder="Enter your email"
          type="email"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.email ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <Input
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          label="Password"
          labelPlacement="inside"
          autoComplete="new-password"
          placeholder="Enter your password"
          type="password"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.password ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <Input
          {...register("rePassword")}
          isInvalid={!!errors.rePassword}
          errorMessage={errors.rePassword?.message}
          label="Confirm Password"
          labelPlacement="inside"
          autoComplete="new-password"
          placeholder="Enter your Confirm Password"
          type="password"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.rePassword ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <Input
          {...register("dateOfBirth")}
          isInvalid={!!errors.dateOfBirth}
          errorMessage={errors.dateOfBirth?.message}
          label="Date Ff Birth"
          labelPlacement="inside"
          autoComplete="new-password"
          type="date"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.dateOfBirth ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Controller
            name="gender"
            control={control}
            render={function (x) {
              return (
                <Select
                  {...register("gender")}
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender?.message}
                  className="max-w-xl"
                  label="Gender"
                  {...x.field.value}
                  placeholder="Select your gender"
                  classNames={{
                    trigger: "bg-cyan-500/10",
                    label: errors.gender ? "text-red-600!" : "text-cyan-600!",
                  }}
                  selectedKeys={[x.field.value]}
                >
                  <SelectItem key="male">Male</SelectItem>
                  <SelectItem key="female">Female</SelectItem>
                </Select>
              );
            }}
          />
        </div>

        <p>
          ALready Have Account ?{" "}
          <Link
            to="/login"
            className=" font-semibold hover:underline text-xl hover:text-cyan-500 transition-colors duration-400 ease-in-out"
          >
            Login
          </Link>
        </p>

        <div className="flex gap-3 flex-col w-full">
          <Button color="primary" type="submit" isLoading={isLoading}>
            Submit
          </Button>
          <Button type="reset" color="danger" variant="flat">
            Reset
          </Button>
        </div>
      </Form>
    </>
  );
}
