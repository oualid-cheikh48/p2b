import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "./Navbar";
import useThemeStore from "../store/themeStore";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <div className={isDark ? "min-h-screen bg-gray-950 flex flex-col" : "min-h-screen bg-[#f3f4f6] flex flex-col"}>
      <Navbar />

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`
            fixed lg:static top-0 lg:top-auto inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <DashboardSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <main
          className={
            isDark
              ? "flex-1 p-4 md:p-8 overflow-y-auto min-w-0 text-white"
              : "flex-1 p-4 md:p-8 overflow-y-auto min-w-0 bg-[#f3f4f6] text-gray-900"
          }
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={
              isDark
                ? "lg:hidden mb-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
                : "lg:hidden mb-4 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
            }
          >
            ☰ Menu
          </button>

          <div
            className={
              isDark
                ? "text-white"
                : "text-gray-900 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-800 [&_h4]:text-slate-800 [&_p]:text-gray-600 [&_span]:text-inherit [&_label]:text-gray-700 [&_small]:text-gray-500 [&_button]:text-inherit [&_.card]:bg-white [&_.card]:border [&_.card]:border-gray-200 [&_.card]:rounded-3xl [&_.card]:shadow-sm [&_.panel]:bg-white [&_.panel]:border [&_.panel]:border-gray-200 [&_.panel]:rounded-2xl [&_.panel]:shadow-sm"
            }
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;