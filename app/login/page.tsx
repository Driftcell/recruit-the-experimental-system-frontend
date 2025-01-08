"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    }).then((res) => {
      if (res.ok) {
        checkProfile();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkProfile = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data.Profile === null) {
          router.push("/profile");
        } else {
          router.push("/chat");
        }
      }
    });
  };

  const handleLogin = () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          localStorage.setItem("user_token", data.access_token);

          checkProfile();
        });
        toast.info("Login successful");
      } else {
        toast.error("Login failed");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>请输入您的凭据以登录您的账户。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              ref={usernameRef}
              id="username"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              ref={passwordRef}
              id="password"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleLogin}
            className="w-full px-6 py-2 text-center sm:text-lg tracking-wider rounded-full bg-[#E9A79B] hover:bg-[#E9A79B] text-white transition-all duration-300 ease-in-out hover:shadow-xl"
          >
            登录
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
