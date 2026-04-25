import { Outlet } from "react-router";
import AppNavbar from "../AppNavbar/AppNavbar";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <main className="min-h-screen pb-3">
        <AppNavbar />
        <section className="min-h-screen">
          <Outlet />
        </section>
      </main>
    </>
  );
}
