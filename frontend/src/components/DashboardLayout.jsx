import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <DashboardSidebar />
      <main className="flex-1 p-8 text-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;