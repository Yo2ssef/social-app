export default function NotFound() {
  return (
    <>
      <title>Not Found Page</title>
      <div className="grid min-h-full place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 h-screen">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-400">404</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            Page not found
          </h2>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
      </div>
    </>
  );
}
