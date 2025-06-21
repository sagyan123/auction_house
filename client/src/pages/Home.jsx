import Item from "../components/Item";
import { useContext } from "react";
import { AuthContext, DataContext } from "../hooks/context";

const Home = () => {
  const user = useContext(AuthContext).userState[0];
  const itemsArray = useContext(DataContext).homeItems;
  const itemsEl = itemsArray?.map((item, index) => (
    <Item
      key={index}
      id={item._id}
      lotNumber={item.lotNumber}
      artistName={item.artistName}
      description={item.description}
      price={item.estimatedPrice}
    />
  ));
  return (
    <div className="container mx-auto">
      <h2 className="text-4xl text-center font-semibold uppercase text-gray-200 py-6">
        {user?.role === "buyer" && <>Biddable Items</>}
        {user?.role === "seller" && <>Approved Items</>}
        {user?.role === "admin" && <>All Items</>}
      </h2>
      <div className="grid grid-cols-3 gap-y-8 place-items-center">
        {itemsEl}
      </div>
    </div>
  );
};
export default Home;
