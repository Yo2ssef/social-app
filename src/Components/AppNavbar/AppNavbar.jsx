import {
  Avatar,
  Badge,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { Home, Notification } from "iconsax-reactjs";
import { Bookmark, Sun, Moon, LogIn, UserPlus } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";

// Contexts & Assets
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import image from "../../../public/social-media.png";
import { NotificationContContext } from "../../Context/NotificationContext/NotificationContext";

export default function AppNavbar() {
  // States & Context Hooks
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData } = useContext(AuthUserContext) || {};
  const { unreadCount } = useContext(NotificationContContext) || {};
  const { name, photo } = userData?.user || {};

  // Theme Management Logic
  const [isDark, setIsDark] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b-[0.5px] border-white/60 dark:border-slate-700/60 py-1"
    >
      {/* Brand Logo */}
      <NavbarContent>
        <NavbarBrand as={Link} to="/">
          <img src={image} alt="logo" className="size-13" />
        </NavbarBrand>
      </NavbarContent>

      {/* Mobile Navigation Icons */}
      {userData && (
        <NavbarContent className="flex sm:hidden gap-1" justify="center">
          <NavbarItem>
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80"}`
              }
              to="posts"
            >
              <Home size="22" variant="Bold" />
            </NavLink>
          </NavbarItem>

          <NavbarItem>
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80"}`
              }
              to="notifications"
            >
              <Badge
                content={unreadCount > 99 ? "99+" : unreadCount}
                color="danger"
                shape="circle"
                size="sm"
                isInvisible={unreadCount === 0}
                showOutline={false}
              >
                <Notification size="22" variant="Bold" />
              </Badge>
            </NavLink>
          </NavbarItem>

          <NavbarItem>
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80"}`
              }
              to="bookmarks"
            >
              <Bookmark size={20} />
            </NavLink>
          </NavbarItem>
        </NavbarContent>
      )}

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-1 md:gap-3" justify="center">
        {userData && (
          <>
            <NavbarItem>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-2 font-semibold text-[15px] md:text-[16px] px-3 md:px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm border border-cyan-100 dark:border-cyan-800/50" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-gray-800 dark:hover:text-slate-200"}`
                }
                to="posts"
              >
                <Home size="22" variant="Bold" className="md:w-6 md:h-6" />
                <span className="hidden lg:inline">Posts</span>
              </NavLink>
            </NavbarItem>

            <NavbarItem>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-2 font-semibold text-[15px] md:text-[16px] px-3 md:px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm border border-cyan-100 dark:border-cyan-800/50" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-gray-800 dark:hover:text-slate-200"}`
                }
                to="notifications"
              >
                <Badge
                  content={unreadCount > 99 ? "99+" : unreadCount}
                  color="danger"
                  shape="circle"
                  size="sm"
                  isInvisible={unreadCount === 0}
                  showOutline={false}
                >
                  <Notification size="22" variant="Bold" />
                </Badge>
                <span className="hidden lg:inline">Notifications</span>
              </NavLink>
            </NavbarItem>

            <NavbarItem>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-2 font-semibold text-[15px] md:text-[16px] px-3 md:px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm border border-cyan-100 dark:border-cyan-800/50" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-gray-800 dark:hover:text-slate-200"}`
                }
                to="bookmarks"
              >
                <Bookmark size={22} className="md:w-6 md:h-6" />
                <span className="hidden lg:inline">Bookmarks</span>
              </NavLink>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* User Actions & Theme Toggle */}
      <NavbarContent justify="end">
        <NavbarItem className="mr-1 md:mr-2">
          <Button
            isIconOnly
            variant="flat"
            radius="full"
            onPress={toggleTheme}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300"
          >
            {isDark ? (
              <Moon size={20} className="text-indigo-600" strokeWidth={2.5} />
            ) : (
              <Sun size={20} className="text-amber-500" strokeWidth={2.5} />
            )}
          </Button>
        </NavbarItem>

        {userData ? (
          <NavbarItem className="cursor-pointer">
            <Link to="/profile">
              <Avatar
                isBordered
                as="button"
                className="transition-transform cursor-pointer ring-2 ring-offset-2 ring-[#1877f2] dark:ring-indigo-400"
                name={name}
                size="sm"
                src={photo}
              />
            </Link>
          </NavbarItem>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <NavbarItem className="hidden sm:flex">
              <Button
                as={Link}
                to="login"
                variant="light"
                className={`font-medium transition-all duration-300 ${pathname === "/login" ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm border border-cyan-100 dark:border-cyan-800/50" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                startContent={<LogIn size={18} />}
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="register"
                variant="shadow"
                className={`font-medium text-white shadow-md transition-all duration-300 ${pathname === "/register" ? "bg-[#166fe5] dark:bg-indigo-500 ring-2 ring-offset-2 ring-[#1877f2] dark:ring-indigo-400" : "bg-[#1877f2] hover:bg-[#166fe5] dark:bg-indigo-600 dark:hover:bg-indigo-500"}`}
                startContent={<UserPlus size={18} />}
              >
                Register
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}
