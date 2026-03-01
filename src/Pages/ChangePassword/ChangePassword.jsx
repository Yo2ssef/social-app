import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft } from "iconsax-reactjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";

const schema = zod
  .object({
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Vaild Password",
      ),
    newPassword: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Enter Vaild Password",
      ),
  })
  .refine(
    function ({ password, newPassword }) {
      if (password !== newPassword) {
        return true;
      }
      return false;
    },
    { error: "Password and New Password same", path: ["newPassword"] },
  );
export default function ChangePassword() {
  const myNavigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
  async function sendUserData(x) {
    setIsLoading(true);

    try {
      await toast.promise(
        axios.patch(
          `${import.meta.env.VITE_BASE_URL}/users/change-password`,
          x,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        ),
        {
          loading: <p className="font-medium text-gray-400">Updating...</p>,
          success: function (response) {
            const newToken = response?.data?.data?.token;
            localStorage.setItem("token", newToken);
            myNavigate("/posts");
            return (
              <p className="text-green-500 font-medium capitalize">
                {response.data.message}
              </p>
            );
          },
          error: function (err) {
            return (
              <p className="text-red-500 font-medium">
                {err.response?.data?.message || "Update Failed"}
              </p>
            );
          },
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Link className="ms-7 flex items-center  gap-1" to="/posts">
        <ArrowLeft size="44" color="#2ccce4" />
        <span className="font-semibold">Back to posts</span>
      </Link>
      <Form
        onSubmit={handleSubmit(sendUserData)}
        className="my-10 w-full max-w-lg flex justify-center items-center flex-col gap-4 bg-white border border-gray-400/60 shadow-2xl mx-auto mt-8 p-6 rounded-3xl"
      >
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
          {...register("newPassword")}
          isInvalid={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
          label="Your New Password"
          labelPlacement="inside"
          autoComplete="new-password"
          placeholder="Enter Your New Password"
          type="password"
          classNames={{
            inputWrapper: "bg-cyan-500/10",
            label: errors.newPassword ? "text-red-600!" : "text-cyan-600!",
          }}
        />
        <Button
          color="primary"
          type="submit"
          isLoading={isLoading}
          className="w-1/2"
        >
          Submit
        </Button>
      </Form>
    </>
  );
}
