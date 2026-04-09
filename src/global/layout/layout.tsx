
import Sidebar from "./Sidebar";
import Appbar from "./appbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="flex m-1 ">
        <Sidebar />

        <div className="w-full px-3">
          <Appbar />
          <div className="w-full mt-2 scrollbar-hide">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
