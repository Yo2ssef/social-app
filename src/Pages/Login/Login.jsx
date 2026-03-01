import { Button, Form, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";

const schema = zod.object({
  email: zod.email("Email Not Valid"),
  password: zod
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Enter Vaild Password",
    ),
});

export default function Login() {
  const { getUserData } = useContext(AuthUserContext);
  const myNavigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });
  async function sendUserLogin(x) {
    setIsLoading(true);
    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}/users/signin`, x),
      {
        loading: (
          <p className="font-medium text-gray-400 capitalize">Sign In...</p>
        ),
        success: function ({ data: { data, message } }) {
          localStorage.setItem("token", data.token);
          getUserData();
          myNavigate("/");
          <p className="text-green-500 font-medium capitalize">{message}</p>;
        },
        error: function (mess) {
          return <p className="text-red-500 font-medium capitalize">{mess}</p>;
        },
      },
    );
    setIsLoading(false);
  }
  return (
    <>
      <title>Login Page</title>

      <Form
        onSubmit={handleSubmit(sendUserLogin)}
        className="my-10 w-full max-w-lg flex flex-col gap-4 bg-white border border-gray-400/60 shadow-2xl mx-auto mt-8 p-6 rounded-3xl"
      >
        <h2 className="text-cyan-500 self-center font-bold text-4xl mb-2">
          Login
        </h2>

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
        <p>
          Dont Have Account ?{" "}
          <Link
            to="/register"
            className=" font-semibold hover:underline text-xl hover:text-cyan-500 transition-colors duration-400 ease-in-out"
          >
            Register
          </Link>
        </p>

        <div className="flex gap-3 flex-col w-full">
          <Button color="primary" type="submit" isLoading={isLoading}>
            Login
          </Button>
        </div>
      </Form>
    </>
  );
}
