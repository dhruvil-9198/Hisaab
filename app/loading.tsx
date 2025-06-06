import Navbar from "@/components/navbar";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <Navbar />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
}
