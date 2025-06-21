import { useContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../hooks/context";
const Searchbar = () => {
  const inputRef = useRef(null);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [searchValue, setSearchValue] = useContext(DataContext).searchState;
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchBarActive(false);
  };
  return (
    <form
      className={`flex items-center relative right-8 duration-100 ${
        searchBarActive ? `-translate-x-64` : ``
      }`}
      onSubmit={handleSubmit}
    >
      <input
        value={searchValue}
        ref={inputRef}
        onChange={(e) => setSearchValue(e.target.value)}
        type="search"
        placeholder="Search"
        className={`absolute py-2 text-lg rounded-full bg-neutral-700 outline-none text-gray-300 ${
          searchBarActive ? `pl-16 pr-8 w-64` : `w-12`
        }`}/>
      <div
        className={`w-12 h-16 grid place-items-center absolute cursor-pointer ${
          searchBarActive ? `left-2 bg-none` : `bg-neutral-900`
        }`}
        onClick={() => {
          setSearchBarActive(true);
          if (inputRef.current) inputRef.current.focus();
        }}>
        <FontAwesomeIcon className="text-gray-300" icon={faSearch} size="lg" />
      </div>
      <div
        className={`w-12 h-16 grid place-items-center absolute cursor-pointer ${
          searchBarActive ? `bg-none translate-x-64` : `-z-10 bg-neutral-900`
        }`}
        onClick={() => {
          setSearchBarActive(false);
          setSearchValue("");
        }}
      >
        <FontAwesomeIcon className="text-red-500" icon={faClose} size="xl" />
      </div>
    </form>
  );
};
export default Searchbar;
