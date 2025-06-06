import Navbar from "@/components/navbar";

export default function Loading() {
  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto mt-8 bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-700 rounded" />
        <div className="h-5 w-48 bg-gray-800 rounded" />
        <div className="h-5 w-64 bg-gray-800 rounded" />
        <div className="h-5 w-56 bg-gray-800 rounded" />
        <div className="h-5 w-52 bg-gray-800 rounded" />
        <div className="h-5 w-60 bg-gray-800 rounded" />
      </div>
    </div>
  );
}
