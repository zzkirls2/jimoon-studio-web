"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithOAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const data = await signUpWithEmail(email, password, name);
      if (data.user?.identities?.length === 0) {
        setError("이미 가입된 이메일입니다.");
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google") => {
    try {
      await signInWithOAuth(provider);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "소셜 로그인에 실패했습니다.";
      setError(message);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-px bg-neutral-300 mx-auto mb-8" />
        <h1 className="text-3xl font-extralight text-neutral-900 mb-4">
          Check Your Email
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed mb-8">
          We&apos;ve sent a confirmation link to
          <br />
          <span className="text-neutral-700">{email}</span>
        </p>
        <Link
          href="/login"
          className="inline-block border border-[#5d6a7a] text-[#5d6a7a] px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-[#b5737a] hover:text-white hover:border-[#b5737a] transition-all duration-300"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-extralight text-neutral-900 mb-2">
          Create Account
        </h1>
        <p className="text-sm text-neutral-400">
          Join our community of readers
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors duration-200"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors duration-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors duration-200"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors duration-200"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#5d6a7a] text-white text-sm tracking-[0.1em] uppercase hover:bg-[#b5737a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-300 uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full py-3.5 border border-neutral-200 text-neutral-600 text-sm tracking-wide hover:bg-neutral-50 transition-colors duration-300 flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#5d6a7a] hover:text-[#b5737a] underline-offset-4"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}
