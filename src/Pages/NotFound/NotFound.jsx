export default function NotFound() {
  return (
    <>
      <title>Not Found Page</title>
      <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 h-screen">
        <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl p-16 rounded-[3rem]">
          <p className="text-xl font-bold tracking-widest text-[#1877f2] uppercase">
            Error 404
          </p>
          <h2 className="mt-4 text-5xl font-extrabold tracking-tight text-gray-800 dark:text-slate-100 sm:text-7xl drop-shadow-sm">
            Page not found
          </h2>
          <p className="mt-6 text-lg font-medium text-gray-500 dark:text-slate-400 sm:text-xl">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
      </div>
    </>
  );
}
