import { WifiOff } from "lucide-react";

export default function OfflineCard() {
  return (
    <div>
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 transition-all duration-500 drop-shadow-xl">
        <div className="flex items-center gap-3 bg-red-50/85 backdrop-blur-xl border border-red-200/60 shadow-2xl shadow-red-500/20 px-4 py-2.5 rounded-full">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-30 duration-1000"></span>
            <span className="bg-linear-to-tr from-red-500 to-red-600 p-1.5 rounded-full shadow-md text-white">
              <WifiOff size={16} strokeWidth={2.5} />
            </span>
          </div>
          <span className="text-red-600 font-bold tracking-wide text-sm pr-1 capitalize">
            You are offline
          </span>
        </div>
      </div>
    </div>
  );
}
