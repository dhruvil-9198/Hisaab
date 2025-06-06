import Navbar from "@/components/navbar";

export default function Loading() {
    return (
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-4 animate-pulse">
                <h2 className="text-2xl font-bold text-orange-500 italic text-center mb-4">
                    Loading Transaction logs...
                </h2>
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <div className="w-2/3 h-4 bg-gray-700 rounded"></div>
                        <div className="w-1/4 h-4 bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
