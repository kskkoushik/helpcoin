import UnrequestedHelps from "@/components/dsiplayhelps";
import Sidebar from "@/components/Sidebar";

// Sample data for sidebar helpers

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-slate-300 flex overflow-hidden">
      {/* Sidebar */}

      <Sidebar />

      {/* Main content */}
      <UnrequestedHelps />
    </div>
  );
}
