import React from "react";
import LoginHero from "./components/LoginHero";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden bg-[var(--gmu-bg,#FDFCF9)]">
      {/* LEFT PANEL: Hero */}
      <div className="w-full h-auto min-h-[400px] md:min-h-screen md:h-screen md:w-1/2 lg:w-[58%] shrink-0 relative">
        <LoginHero />
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full flex-1 md:w-1/2 lg:w-[42%] flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 z-10 -mt-8 md:mt-0 relative">
        <LoginForm />
      </div>
    </div>
  );
}
