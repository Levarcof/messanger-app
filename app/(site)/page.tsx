import Image from "next/image";
import AuthForm from "./components/AuthoForm";

export default function Home() {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#050505]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image alt="Logo" height="64" width="64" className="mx-auto w-auto" src="/logo.png" />
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white uppercase tracking-widest">Sign in</h2>
        </div>
        <AuthForm />
      </div>
    </>
  );
}
