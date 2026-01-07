import type { ReactNode } from "react";
import Navbar from "./Navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="pt-[72px]">{children}</main>
    </div>
  );
}
