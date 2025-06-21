import Item from "../components/Item";
import { useContext } from "react";
import { DataContext } from "../hooks/context";

const AllBoughtItems = () => {
  const itemsArray = useContext(DataContext).boughtItems;
  const itemsEl = itemsArray?.map(({ item, price }, index) => (
    <Item
      key={index}
      lotNumber={item.lotNumber}
      id={item._id}
      artistName={item.artistName}
      description={item.description}
      price={price}
      alreadyBid={true}
    />
  ));

  return (
    <div className="container mx-auto">
      <h2 className="text-4xl text-center font-semibold uppercase text-gray-200 py-6">
        Bought Items
      </h2>
      <div className="grid grid-cols-3 gap-y-4 place-items-center">
        {itemsEl}
      </div>
    </div>
  );
};

export default AllBoughtItems;
