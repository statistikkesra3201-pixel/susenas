import React from "react";
import {
  IconCalculator,
  IconCalculatorFilled,
  IconTransform,
  IconTransformFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import Link from "next/link";

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <main className="bg-gray-50 min-h-screen space-y-4 relative pb-48 relative">
      <nav className="p-4 bg-gray-100 shadow">
        <div>
          <h1 className="text-gray-700 text-xl text-center font-medium">
            Expenditure Wizard
          </h1>
        </div>
      </nav>
      <div className="w-full bg-green-500 fixed bottom-0 z-20 bg-white flex">
        <Link
          href={"/"}
          className={`flex-1 hover:bg-gray-200 text-gray-400 hover:text-gray-500 duration-300 ease-in-out p-4 text-center flex items-center justify-center 
          ${
            router.pathname == "/"
              ? " border-t-2 border-blue-500"
              : " border-t-0"
          }`}
        >
          {router.pathname == "/" ? (
            <IconCalculatorFilled size={24} />
          ) : (
            <IconCalculator size={24} />
          )}
        </Link>
        <Link
          href={"/konversi"}
          className={`flex-1 hover:bg-gray-200 text-gray-400 hover:text-gray-500 duration-300 ease-in-out p-4 text-center flex items-center justify-center 
          ${
            router.pathname == "/konversi"
              ? " border-t-2 border-blue-500"
              : " border-t-0"
          }`}
        >
          {router.pathname == "/" ? (
            <IconTransform size={24} />
          ) : (
            <IconTransformFilled size={24} />
          )}
        </Link>
      </div>
      {children}
      <footer className="h-24 p-4 bg-gray-100 font-medium text-center m-auto text-xs md:text-sm text-gray-600 absolute bottom-0 inset-x-0 pb-36">
        Made by{" "}
        <a href="https://bogorkab.bps.go.id" className="text-blue-500">
          Siti Maulina Meutuah
        </a>
        , in collaboration with{" "}
        <a href="https://bogorkab.bps.go.id/" className="text-blue-500">
          BPS Kabupaten Bogor
        </a>
      </footer>
    </main>
  );
};

export default Layout;
