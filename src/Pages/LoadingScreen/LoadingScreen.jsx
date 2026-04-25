import { HashLoader } from "react-spinners";
export default function LoadingScreen() {
  return (
    <>
      <div className="min-h-full flex flex-col justify-center items-center fixed top-0 end-0 start-0 bottom-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-6 py-24 sm:py-32 lg:px-8 h-screen z-50 transition-all">
        <HashLoader color="#1877f2" size={120} />
        <p className="mt-8 text-[#1877f2] font-semibold text-lg animate-pulse tracking-wide">
          Loading amazing things...
        </p>
      </div>
    </>
  );
}
