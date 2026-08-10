"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import { User, Lock, ArrowRight } from "lucide-react";
import { IMAGES } from "@/constants/images";
import useLogin from "./hooks/useLogin";

import loginInitialValues from "./constants/loginInitialValues";
import loginSchema from "./validation/loginSchema";

import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await loginMutation.mutateAsync(values);
    },
  });

  return (
    <div
      className="
        w-full
        max-w-full
        sm:max-w-[420px]
        md:max-w-[440px]
        lg:max-w-[480px]
        xl:max-w-[500px]
        rounded-[28px]
        bg-[var(--gmu-card,#FFFFFF)]
        px-8
        py-10
        md:px-12
        md:py-[52px]
        shadow-[var(--gmu-shadow,0_20px_50px_rgba(0,0,0,0.08))]
        flex
        flex-col
      "
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-[#5B0B0B] p-2 rounded-full border border-white shadow-md mb-4">
          <Image
            src={IMAGES.LOGO}
            alt="GM University"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.35em] font-semibold text-[var(--gmu-maroon,#8B1538)] font-inter">
          Welcome Back
        </p>

        <h1 className="mt-2 text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-[var(--gmu-text,#111827)] font-sans tracking-tight">
          Lead Management
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4 w-full">
        <Input
          label="Username"
          placeholder="admin"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="username"
          icon={<User size={18} strokeWidth={1.5} />}
          error={formik.touched.username && formik.errors.username}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loginMutation.isPending}
          name="password"
          icon={<Lock size={18} strokeWidth={1.5} />}
          error={formik.touched.password && formik.errors.password}
        />

        <div className="flex items-center justify-between pt-2 pb-2">
          <Checkbox
            label="Remember Me"
            checked={formik.values.remember}
            onChange={formik.handleChange}
            name="remember"
            variant="maroon"
          />

          <Link
            href="#"
            className="
              text-[13px]
              font-medium
              text-[var(--gmu-maroon,#8B1538)]
              hover:underline
              font-inter
              whitespace-nowrap
            "
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="maroon"
          disabled={loginMutation.isPending}
          className="mt-2 h-12"
        >
          {loginMutation.isPending ? (
            "Signing In..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign In <ArrowRight size={18} />
            </span>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center justify-center gap-1">
        <p className="text-[11px] md:text-xs text-gray-400 font-sans">
          Version 1.0.0
        </p>
        <p className="text-[11px] md:text-xs text-gray-500 font-sans">
          © 2026 GM University. All rights reserved.
        </p>
      </div>
    </div>
  );
}