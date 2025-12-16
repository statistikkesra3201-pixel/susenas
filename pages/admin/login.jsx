import React, { useState } from "react";
import { Login as LoginCard } from "@/components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
const Login = () => {
  const [token, setToken] = useState("");
  const router = useRouter();
  const onButtonClicked = () => {
    router.push("/admin");
  };
  return (
    <LoginCard>
      <div className="space-y-6">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm placeholder-slate-400
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="masukkan token"
        />
        <div
          className="text-center bg-blue-500 hover:bg-blue-400 px-4 py-1 rounded-md hover:cursor-pointer shadow shadow-blue-400 text-white duration-200 ease-in-out font-medium text-sm"
          onClick={onButtonClicked}
        >
          Login
        </div>
        <Link
          href="/"
          className="text-blue-500 underline text-sm hover:font-medium "
        >
          kembali
        </Link>
      </div>
    </LoginCard>
  );
};

export default Login;
