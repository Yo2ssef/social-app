import { Outlet } from "react-router";
import AppNavbar from "../AppNavbar/AppNavbar";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <main>
        <AppNavbar />
        <section className="min-h-screen bg-stone-300 overflow-auto">
          <Outlet />
        </section>
      </main>
    </>
  );
}
