import Root from "./pages/Root";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthContext, DataContext } from "./hooks/context";
import { useEffect, useState } from "react";
import RequestAuctionItem from "./pages/RequestAuctionItem";
import { AxiosWithAuthorization } from "./Axios";
import EditAuctionItem from "./pages/EditAuctionItem";
import ProductDetails from "./pages/ItemDetails";
import AllBidItems from "./pages/AllBidItems";
import AddAuctionItem from "./pages/AddAuctionItem";
import AllUnapprovedItems from "./pages/AllUnapprovedItems";
import AllAuctioningItems from "./pages/AllAuctioningItems";
import AllSoldItems from "./pages/AllSoldItems";
import AllBoughtItems from "./pages/AllBoughtItems";
import AllRequestedItems from "./pages/AllRequestedItems";

const App = () => {
  const theme = extendTheme({ initialColorMode: "dark" });
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || undefined
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || undefined
  );

  const [category, setCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const [homeItems, setHomeItems] = useState(null);
  const [bidItems, setBidItems] = useState(null);
  const [boughtItems, setBoughtItems] = useState(null);
  const [unapprovedItems, setUnapprovedItems] = useState(null);
  const [auctioningItems, setAuctioningItems] = useState(null);
  const [soldItems, setSoldItems] = useState(null);
  const [requestedItems, setRequestedItems] = useState(null);

  const getItems = async () => {
    if (!user) return;
    let main;
    if (user.role === "buyer") {
      main = await AxiosWithAuthorization(token).get(
        "/buyer/all-auctioning-items"
      );
      const bids = await AxiosWithAuthorization(token).get(
        "/buyer/all-bid-items"
      );
      const bought = await AxiosWithAuthorization(token).get(
        "/buyer/all-bought-items"
      );
      setBidItems(bids.data);
      setBoughtItems(bought.data);
    } else if (user.role === "seller") {
      main = await AxiosWithAuthorization(token).get("/seller/all-added-items");
      const sold = await AxiosWithAuthorization(token).get(
        "/seller/sold-items"
      );
      const requested = await AxiosWithAuthorization(token).get(
        "/seller/all-requested-items"
      );
      setRequestedItems(requested.data);
      setSoldItems(sold.data);
    } else if (user.role === "admin") {
      main = await AxiosWithAuthorization(token).get("/admin/all-items");
      const unapproved = await AxiosWithAuthorization(token).get(
        "/admin/all-unapproved-items"
      );
      const auctioning = await AxiosWithAuthorization(token).get(
        "/admin/all-auctioning-items"
      );
      const sold = await AxiosWithAuthorization(token).get(
        "/admin/all-sold-items"
      );
      setSoldItems(sold.data);
      setUnapprovedItems(unapproved.data);
      setAuctioningItems(auctioning.data);
    }
    setHomeItems(main.data);
  };

  const filterItems = async () => {
    await getItems();
    setHomeItems((prevItems) =>
      prevItems?.filter((item) => {
        if (!item) return;
        const categoryMatch =
          item.category === category.toLowerCase() || category === "All";
        const artistNameMatch = item.artistName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const descriptionMatch = item.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        console.log(categoryMatch, artistNameMatch, descriptionMatch);
        return (artistNameMatch || descriptionMatch) && categoryMatch;
      })
    );
    setBidItems((prevItems) =>
      prevItems?.filter(({ item }) => {
        if (!item) return;
        const categoryMatch =
          item.category === category.toLowerCase() || category === "All";
        const artistNameMatch = item.artistName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const descriptionMatch = item.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        return (artistNameMatch || descriptionMatch) && categoryMatch;
      })
    );
    setBoughtItems((prevItems) =>
      prevItems?.filter(({ item }) => {
        if (!item) return;
        console.log(item, " ");
        const categoryMatch =
          item.category === category.toLowerCase() || category === "All";
        const artistNameMatch = item.artistName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const descriptionMatch = item.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        return (artistNameMatch || descriptionMatch) && categoryMatch;
      })
    );
    setUnapprovedItems((prevItems) =>
      prevItems?.filter((item) => {
        if (!item) return;
        const categoryMatch =
          item.category === category.toLowerCase() || category === "All";
        const artistNameMatch = item.artistName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const descriptionMatch = item.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        return (artistNameMatch || descriptionMatch) && categoryMatch;
      })
    );
    setAuctioningItems((prevItems) =>
      prevItems?.filter((item) => {
        if (!item) return;
        const categoryMatch =
          item.category === category.toLowerCase() || category === "All";
        const artistNameMatch = item.artistName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const descriptionMatch = item.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        return (artistNameMatch || descriptionMatch) && categoryMatch;
      })
    );
    if (user?.role === "admin")
      setSoldItems((prevItems) =>
        prevItems?.filter((item) => {
        if (!item) return;
          const categoryMatch =
            item.category === category.toLowerCase() || category === "All";
          const artistNameMatch = item.artistName
            .toLowerCase()
            .includes(searchValue.toLowerCase());
          const descriptionMatch = item.description
            .toLowerCase()
            .includes(searchValue.toLowerCase());
          return (artistNameMatch || descriptionMatch) && categoryMatch;
        })
      );
    if (user?.role === "seller")
      setSoldItems((prevItems) =>
        prevItems?.filter(({ item }) => {
        if (!item) return;
          const categoryMatch =
            item.category === category.toLowerCase() || category === "All";
          const artistNameMatch = item.artistName
            .toLowerCase()
            .includes(searchValue.toLowerCase());
          const descriptionMatch = item.description
            .toLowerCase()
            .includes(searchValue.toLowerCase());
          return (artistNameMatch || descriptionMatch) && categoryMatch;
        })
      );
    setRequestedItems((prevItems) =>
      prevItems?.filter((item) => {
        if (!item) return;
        const categoryMatch =
          item.category === category.toLowerCase() || category === "All";
        const artistNameMatch = item.artistName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const descriptionMatch = item.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        return (artistNameMatch || descriptionMatch) && categoryMatch;
      })
    );
  };

  useEffect(() => {
    filterItems();
  }, [user, token, category, searchValue]);

  const authRouter = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/register",
      Component: Register,
    },
  ]);

  const mainRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" Component={Root}>
        <Route index Component={Home}></Route>
        <Route
          path="/view-auction-item/:itemId"
          Component={ProductDetails}
        ></Route>
        {user?.role === "buyer" && (
          <>
            <Route path="/bought-items" Component={AllBoughtItems}></Route>
            <Route path="/bid-items" Component={AllBidItems}></Route>
          </>
        )}
        {user?.role === "seller" && (
          <>
            <Route path="/sold-items" Component={AllSoldItems}></Route>
            <Route
              path="/requested-items"
              Component={AllRequestedItems}
            ></Route>
            <Route
              path="/request-auction-item"
              Component={RequestAuctionItem}
            ></Route>
          </>
        )}
        {user?.role === "admin" && (
          <>
            <Route path="/add-auction-item" Component={AddAuctionItem}></Route>
            <Route
              path="/edit-auction-item/:itemId"
              Component={EditAuctionItem}
            ></Route>
            <Route
              path="/unapproved-items"
              Component={AllUnapprovedItems}
            ></Route>
            <Route path="/sold-items" Component={AllSoldItems}></Route>
            <Route
              path="/auctioning-items"
              Component={AllAuctioningItems}
            ></Route>
          </>
        )}
      </Route>
    )
  );

  let defaultRouter = user ? mainRouter : authRouter;

  useEffect(() => {
    defaultRouter = user ? mainRouter : authRouter;
  }, [user, token]);

  return (
    <ChakraProvider theme={theme}>
      <AuthContext.Provider
        value={{
          userState: [user, setUser],
          tokenState: [token, setToken],
        }}
      >
        <DataContext.Provider
          value={{
            homeItems,
            bidItems,
            boughtItems,
            unapprovedItems,
            auctioningItems,
            soldItems,
            requestedItems,
            categoryState: [category, setCategory],
            searchState: [searchValue, setSearchValue],
          }}
        >
          <RouterProvider router={defaultRouter} />
        </DataContext.Provider>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;