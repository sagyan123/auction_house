import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Root = () => {
  return (
    <div>
      <Navbar />
      <main className="bg-neutral-800 pt-16 pb-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
