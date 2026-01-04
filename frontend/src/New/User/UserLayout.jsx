import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 p-4">
        <Outlet />
      </main>
    </>
  );
}
