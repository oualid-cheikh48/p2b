import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 lg:top-auto inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 text-white overflow-y-auto min-w-0">
          {/* Bouton menu mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            ☰ Menu
          </button>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;