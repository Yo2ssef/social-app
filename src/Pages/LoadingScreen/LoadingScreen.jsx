import { HashLoader } from "react-spinners";
export default function LoadingScreen() {
  return (
    <>
      <div className="min-h-full flex justify-center items-center fixed top-0 end-0 start-0 bottom-0 bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 h-screen z-50">
        <HashLoader color="#dddddd" size={200}/>
      </div>
    </>
  );
}
