import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCaretDown,
  faDollarSign,
  faGavel,
  faHourglassHalf,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Searchbar from "./Searchbar";
import { useContext, useState } from "react";
import { AuthContext, DataContext } from "../hooks/context";
import { Button } from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(AuthContext).userState;
  const [token, setToken] = useContext(AuthContext).tokenState;
  const [category, setCategory] = useContext(DataContext).categoryState;
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const categoriesList = [
    "All",
    "Drawing",
    "Painting",
    "Photograph",
    "Sculpture",
    "Carving",
  ];

  const handleLogout = () => {
    setUser(undefined);
    setToken(undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const CategoriesDropdown = () => {
    return (
      <div
        className={`bg-neutral-900 flex-col absolute top-16 -ml-4 drop-shadow-2xl rounded-b ${
          categoriesDropdown ? `flex` : `hidden`
        }`}
      >
        <ul className="flex flex-col -mt-8 pt-6 pb-2">
          {categoriesList.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setCategory(item);
                setCategoriesDropdown(false);
              }}
              className={`text-gray-200 bg-main py-2 px-4 hover:bg-neutral-600 ${
                index === 0 ? `rounded-t` : ``
              } ${index === categoriesList.length - 1 ? `rounded-b` : ``}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const compareRolesEl =
    user?.role === "buyer" ? (
      <>
        <Link to="/bought-items">
          <FontAwesomeIcon
            className="text-gray-300"
            icon={faDollarSign}
            size="lg"
          />
        </Link>
        <Link to="/bid-items">
          <FontAwesomeIcon className="text-gray-300" icon={faGavel} size="lg" />
        </Link>
      </>
    ) : user?.role === "seller" ? (
      <>
        <Link to="/sold-items">
          <FontAwesomeIcon
            className="text-gray-300"
            icon={faDollarSign}
            size="lg"
          />
        </Link>
        <Link to="/requested-items">
          <FontAwesomeIcon
            className="text-gray-300"
            icon={faHourglassHalf}
            size="lg"
          />
        </Link>
        <Link to="/request-auction-item">
          <FontAwesomeIcon className="text-gray-300" icon={faAdd} size="lg" />
        </Link>
      </>
    ) : user?.role === "admin" ? (
      <>
        <Link to="/sold-items">
          <FontAwesomeIcon
            className="text-gray-300"
            icon={faDollarSign}
            size="lg"
          />
        </Link>
        <Link to="/auctioning-items">
          <FontAwesomeIcon className="text-gray-300" icon={faGavel} size="lg" />
        </Link>
        <Link to="/unapproved-items">
          <FontAwesomeIcon
            className="text-gray-300"
            icon={faHourglassHalf}
            size="lg"
          />
        </Link>
        <Link to="/add-auction-item">
          <FontAwesomeIcon className="text-gray-300" icon={faAdd} size="lg" />
        </Link>
      </>
    ) : (
      <></>
    );

  const UserDropdown = () => {
    return (
      <div
        className={`bg-neutral-900 flex-col absolute top-16 right-0 drop-shadow-2xl rounded-b ${
          userDropdown ? `flex` : `hidden`
        }`}
      >
        <ul className="flex flex-col items-end pb-2">
          <li className={`text-gray-200 bg-main py-1 px-4 rounded-t`}>
            <Button
              colorScheme="messenger"
              type="button"
              variant="solid"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full h-16 bg-neutral-900 fixed z-10">
      <div className="container h-full mx-auto flex justify-between items-center">
        <div className="flex gap-0 lg:gap-16 items-center">
          <Link to="/">
            <p className="text-2xl font-semibold text-gray-300 cursor-pointer select-none">
              FOTHEBEY'S
            </p>
          </Link>
          <div
            className="flex items-center cursor-pointer text-gray-300 gap-2"
            onMouseEnter={() => setCategoriesDropdown(true)}
            onMouseLeave={() => setCategoriesDropdown(false)}
          >
            <p>{category}</p>
            <FontAwesomeIcon icon={faCaretDown} />
            <CategoriesDropdown />
          </div>
        </div>
        <div className="flex items-center gap-12">
          <Searchbar />
          {compareRolesEl}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setUserDropdown((x) => !x)}
          >
            <FontAwesomeIcon
              className="text-gray-300"
              icon={faUser}
              size="lg"
            />
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
