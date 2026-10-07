"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen bg-[#F6F3EE]">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-[#2F5D56] px-12 py-14 text-[#F6F3EE] lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #E8C4B8 0%, transparent 70%)",
          }}
        />
        <span className="font-serif text-xl tracking-tight">heyRMDY</span>

        <div className="max-w-sm">
          <h1 className="font-serif text-4xl leading-[1.15] text-[#F6F3EE]">
            Care, organized.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#CFE0DB]">
            Everything your team needs to support members through their
            health journey, in one place.
          </p>
        </div>

        <p className="text-xs text-[#9FBDB6]">Admin Console</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-[380px]">
          <div className="mb-10 lg:hidden">
            <span className="font-serif text-lg tracking-tight text-[#2F5D56]">
              heyRMDY
            </span>
          </div>

          <h2 className="font-serif text-[28px] leading-tight text-[#1C1E1C]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-[#6B6760]">
            Sign in to manage members and content.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6">
            <div className="group">
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-[#6B6760]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="mt-2 w-full border-0 border-b border-[#D8D3C9] bg-transparent px-0 py-2 text-[15px] text-[#1C1E1C] outline-none transition-colors placeholder:text-[#B6B1A5] focus:border-[#2F5D56]"
                placeholder="you@heyrmdy.com"
              />
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-[#6B6760]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-2 w-full border-0 border-b border-[#D8D3C9] bg-transparent px-0 py-2 text-[15px] text-[#1C1E1C] outline-none transition-colors placeholder:text-[#B6B1A5] focus:border-[#2F5D56]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-md bg-[#FBEAE6] px-3 py-2 text-sm text-[#A23B2A]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#2F5D56] py-3 text-[15px] font-medium text-[#F6F3EE] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}