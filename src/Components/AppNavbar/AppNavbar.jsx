import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { EthereumClassic } from "iconsax-reactjs";
import { useContext, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthUserContext } from "../../Context/AuthContext/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData, getUserData } = useContext(AuthUserContext) || {};

  const photoUpload = useRef();

  const myNavigate = useNavigate();
  function setUserLogOut() {
    localStorage.clear();
    getUserData();
    myNavigate("/login");
  }

  function handleProfile() {
    myNavigate("/profile");
  }
  function handleChangePass() {
    myNavigate("/change-password");
  }
  const { name, photo, _id } = userData?.user || {};
  // function handleImageUpload(e) {
  //   setImage(e.target.files[0]);
  //   setUploadImageUser(URL.createObjectURL(e.target.files[0]));
  // }

  async function handlePhotoUpload() {
    const myFormPhoto = new FormData();
    myFormPhoto.append("photo", photoUpload.current.files[0]);
    toast.promise(
      axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/upload-photo`,
        myFormPhoto,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      ),
      {
        loading: "Uploading Your Profile Picture",
        success: function ({ data }) {
          getUserData();
          return data.message;
        },
        error: function (err) {
          return console.log(err) || "Failed to Upload Profile Picture";
        },
      },
    );
  }
  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className=" bg-cyan-600/20 border-b border-gray-300 py-2"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} to="/">
          <EthereumClassic size="44" color="#2486ED" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {userData && (
          <NavbarItem>
            <NavLink
              className={function ({ isActive }) {
                return `font-bold text-2xl p-2 rounded-2xl ${isActive ? "  text-cyan-500 underline " : " text-black "}`;
              }}
              to="posts"
            >
              Posts
            </NavLink>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {userData ? (
          <NavbarItem>
            <Dropdown placement="bottom">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform cursor-pointer"
                  color="primary"
                  name={name}
                  size="sm"
                  src={photo}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  onClick={handleProfile}
                  key="profile"
                  textValue={`profile`}
                >
                  <Link className="font-bold">Profile</Link>
                </DropdownItem>
                <DropdownItem
                  onClick={handleChangePass}
                  key="changePass"
                  textValue={`changePass`}
                >
                  <p className="font-bold">Change Password</p>
                </DropdownItem>

                <DropdownItem
                  key="settings"
                  className="text-gray-700"
                  textValue="Upload Profile Picture"
                  onClick={() => {
                    photoUpload.current.click();
                  }}
                >
                  <span className="font-semibold">Upload Profile Picture</span>
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="Log Out"
                  onClick={setUserLogOut}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button as={Link} color="primary" to="register" variant="shadow">
              Sign Up
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="pt-7">
        <NavbarMenuItem className="flex flex-col justify-center items-center text-center gap-3">
          {userData ? (
            <NavLink
              className={function ({ isActive }) {
                return `font-bold w-1/2 text-2xl p-1 rounded-2xl ${isActive ? " bg-cyan-500 text-white " : " text-cyan-500 bg-white"}`;
              }}
              to="posts"
              onClick={function () {
                setIsMenuOpen(false);
              }}
            >
              Posts
            </NavLink>
          ) : (
            <NavLink
              className={function ({ isActive }) {
                return `font-bold w-1/2 text-2xl p-1 rounded-2xl ${isActive ? " bg-cyan-500 text-white " : " text-cyan-500 bg-white"}`;
              }}
              to="register"
              onClick={function () {
                setIsMenuOpen(false);
              }}
            >
              Sign Up
            </NavLink>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
      <input
        type="file"
        className="hidden"
        onChange={handlePhotoUpload}
        ref={photoUpload}
      />
    </Navbar>
  );
}
