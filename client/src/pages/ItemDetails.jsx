import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  FormControl,
  InputGroup,
  Button,
  Stack,
  Input,
  InputLeftElement,
  useToast,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AxiosBase, AxiosWithAuthorization } from "../Axios";
import { AuthContext } from "../hooks/context";

const ItemDetails = () => {
  const location = useLocation();
  const { alreadyBid, bidPrice } = location.state;
  const toast = useToast();
  const user = useContext(AuthContext).userState[0];
  const token = useContext(AuthContext).tokenState[0];
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState(null);
  const [itemBidders, setItemBidders] = useState(null);

  const formatDate = (date) => {
    date = new Date(date);
    const padZero = (num) => (num < 10 ? `0${num}` : `${num}`);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
  };

  const getItemBidders = async () => {
    const res = await AxiosBase.get(`/all-bidders/${itemId}`);
    setItemBidders(res.data);
  };

  const handleSell = async (bidderId) => {
    try {
      const res = await AxiosWithAuthorization(token).put(
        `/${user?.role}/item-sell/${itemId}/${bidderId}`
      );
      toast({
        title: res.data.message,
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (e) {
      if (e.response && e.response.data && Object.values(e.response.data)[0]) {
        let error = Object.values(e.response.data);
        toast({
          title: error,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      } else
        toast({
          title: e.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
    }
  };

  const bidsTableEl = itemBidders?.map(({ user: bidder, price }, index) => {
    return (
      <Tr key={index}>
        <Td>{bidder?.name}</Td>
        <Td isNumeric>$ {price}</Td>
        {user?.role === "admin" &&
          itemDetails?.auctionDate === formatDate(new Date()) &&
          Object.keys(itemDetails.buyer).length === 0 && (
            <Td>
              <Button
                size="sm"
                variant="solid"
                colorScheme="green"
                onClick={() => handleSell(bidder._id)}
              >
                Sell Item
              </Button>
            </Td>
          )}
      </Tr>
    );
  });

  const getItemDetails = async () => {
    const res = await AxiosBase.get(`/item/${itemId}`);
    const originalDetails = res.data;
    let extraFields;
    switch (originalDetails.category) {
      case "drawing":
        extraFields = {
          materialField: "Drawing Medium",
          material: originalDetails.drawingDetails.drawingMedium,
          framed: originalDetails.drawingDetails.framed,
          height: originalDetails.drawingDetails.dimensions.height,
          length: originalDetails.drawingDetails.dimensions.length,
        };
        break;
      case "painting":
        extraFields = {
          materialField: "Painting Medium",
          material: originalDetails.paintingDetails.paintingMedium,
          framed: originalDetails.paintingDetails.framed,
          height: originalDetails.paintingDetails.dimensions.height,
          length: originalDetails.paintingDetails.dimensions.length,
        };
        break;
      case "photograph":
        extraFields = {
          materialField: "Image Type",
          material: originalDetails.photographicImageDetails.imageType,
          height: originalDetails.photographicImageDetails.dimensions.height,
          length: originalDetails.photographicImageDetails.dimensions.length,
        };
        break;
      case "sculpture":
        extraFields = {
          materialField: "Material Used",
          material: originalDetails.sculptureDetails.materialUsed,
          height: originalDetails.sculptureDetails.dimensions.height,
          length: originalDetails.sculptureDetails.dimensions.length,
          width: originalDetails.sculptureDetails.dimensions.width,
          weight: originalDetails.sculptureDetails.weight,
        };
        break;
      case "carving":
        extraFields = {
          materialField: "Material Used",
          material: originalDetails.carvingDetails.materialUsed,
          height: originalDetails.carvingDetails.dimensions.height,
          length: originalDetails.carvingDetails.dimensions.length,
          width: originalDetails.carvingDetails.dimensions.width,
          weight: originalDetails.carvingDetails.weight,
        };
        break;
      default:
        break;
    }
    const modifiedDetails = {
      lotNumber: originalDetails.lotNumber,
      artistName: originalDetails.artistName,
      productionYear: originalDetails.yearProduced,
      subjectClassification: originalDetails.subjectClassification,
      description: originalDetails.description,
      estimatedPrice: originalDetails.estimatedPrice,
      finalPrice: originalDetails.finalPrice,
      seller: originalDetails.seller,
      buyer: originalDetails.buyer,
      totalBids: originalDetails.bids.length,
      approved: originalDetails.approved,
      auctionDate: originalDetails.auctionDate
        ? formatDate(originalDetails.auctionDate)
        : null,
      category: originalDetails.category,
      ...extraFields,
    };
    setItemDetails(modifiedDetails);
  };

  useEffect(() => {
    getItemDetails();
  }, []);

  useEffect(() => {
    if (itemDetails?.totalBids !== 0) getItemBidders();
  }, [itemDetails]);

  const handleBid = async (values) => {
    try {
      const res = await AxiosWithAuthorization(token).post(
        `/buyer/item-bid/${itemId}`,
        {
          price: values.bidPrice,
        }
      );
      toast({
        title: res.data.message,
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      navigate("/");
    } catch (e) {
      if (e.response && e.response.data && Object.values(e.response.data)[0]) {
        let error = Object.values(e.response.data)[0];
        error = error.charAt(0).toUpperCase() + error.slice(1);
        toast({
          title: error,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      } else
        toast({
          title: e.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
    }
  };

  const handleApprove = async () => {
    try {
      const res = await AxiosWithAuthorization(token).put(
        `/admin/item-approve/${itemId}`
      );
      getItemDetails();
      toast({
        title: res.data.message,
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (e) {
      if (e.response && e.response.data && Object.values(e.response.data)[0]) {
        let error = Object.values(e.response.data);
        toast({
          title: error,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      } else
        toast({
          title: e.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      console.log(e.response.data);
    }
  };

  const handleRemove = async () => {
    try {
      const res = await AxiosWithAuthorization(token).delete(
        `/admin/item-delete/${itemId}`
      );
      toast({
        title: res.data.message,
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      navigate("/");
      window.location.reload();
    } catch (e) {
      if (e.response && e.response.data && Object.values(e.response.data)[0]) {
        let error = Object.values(e.response.data);
        toast({
          title: error,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      } else
        toast({
          title: e.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      console.log(e.response.data);
    }
  };

  return (
    <>
      {itemDetails && (
        <Box p={8} className="text-gray-300 flex flex-col items-center">
          <Heading mb={4}>By: {itemDetails.artistName}</Heading>
          <Stack direction="row" gap={56}>
            <VStack align="start" spacing={4}>
              {itemDetails.lotNumber !== "-1" && (
                <Text>
                  <strong>Lot Number:</strong>{" "}
                  <span>{itemDetails.lotNumber}</span>
                </Text>
              )}
              <Text>
                <strong>Category:</strong>{" "}
                <span className="capitalize">{itemDetails.category}</span>
              </Text>
              <Text width={512}>
                <strong>Description:</strong> {itemDetails.description}
              </Text>
              <Text>
                <strong>Estimated Price:</strong> $ {itemDetails.estimatedPrice}
              </Text>
              <Text>
                <strong>Production Year:</strong> {itemDetails.productionYear}
              </Text>
            </VStack>
            {user?.role == "admin" && (
              <VStack>
                {!itemDetails.approved && (
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="green"
                    onClick={handleApprove}
                  >
                    Approve Item
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="solid"
                  colorScheme="red"
                  onClick={handleRemove}
                >
                  Remove Item
                </Button>
                <Link to={`/edit-auction-item/${itemId}`}>
                  <Button size="sm" variant="solid" colorScheme="orange">
                    Edit Item
                  </Button>
                </Link>
              </VStack>
            )}
          </Stack>

          <Divider my={8} />

          <Heading size="md" mb={4}>
            Additional Information
          </Heading>
          <Stack direction="row" gap={56}>
            <VStack align="start" spacing={4}>
              <Text>
                <strong>{itemDetails.materialField}:</strong>{" "}
                <span className="capitalize">{itemDetails.material}</span>
              </Text>
              <Text>
                <strong>Subject Classification:</strong>{" "}
                <span className="capitalize">
                  {itemDetails.subjectClassification}
                </span>
              </Text>
              <Text>
                <strong>Height:</strong> {itemDetails.height} cm
              </Text>
              <Text>
                <strong>Length:</strong> {itemDetails.length} cm
              </Text>
            </VStack>
            <VStack align="start" spacing={4}>
              <Text>
                <strong>Sold by:</strong> {itemDetails.seller.name}
              </Text>
              <Text>
                <strong>Total bids:</strong> {itemDetails.totalBids}
              </Text>
              <Text>
                <strong>Auction Date:</strong>{" "}
                {itemDetails.auctionDate
                  ? itemDetails.auctionDate
                  : "To be added"}
              </Text>
              {Object.keys(itemDetails.buyer).length !== 0 && (
                <>
                  <Text>
                    <strong>Sold To:</strong> {itemDetails.buyer.name}
                  </Text>
                  <Text>
                    <strong>Sold Price:</strong> $ {itemDetails.finalPrice}
                  </Text>
                </>
              )}
              {alreadyBid && bidPrice && (
                <Text>
                  <strong>Your bid:</strong> $ {bidPrice}
                </Text>
              )}
            </VStack>
          </Stack>
          {user?.role === "buyer" && !alreadyBid && (
            <Formik initialValues={{ bidPrice: "" }} onSubmit={handleBid}>
              {(props) => (
                <Form className="flex items-center gap-2">
                  <Field
                    name="bidPrice"
                    validate={(value) => {
                      if (value.trim().length === 0) return "Required.";
                    }}
                  >
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.bidPrice}
                        className="!w-min"
                      >
                        <InputGroup width={24}>
                          <InputLeftElement className="text-gray-300">
                            $
                          </InputLeftElement>
                          <Input
                            {...field}
                            className="text-gray-300"
                            placeholder="Price"
                            type="text"
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    size="md"
                    variant="solid"
                    colorScheme="orange"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Place Bid
                  </Button>
                </Form>
              )}
            </Formik>
          )}
          {itemDetails.totalBids !== 0 && (
            <>
              <Divider my={8} />
              <Heading size="md" mb={4}>
                Bids Table
              </Heading>
              <TableContainer className="border">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Bidder Name</Th>
                      <Th isNumeric>Bid Price</Th>
                      {user?.role === "admin" &&
                        itemDetails.auctionDate &&
                        itemDetails.auctionDate === formatDate(new Date()) &&
                        Object.keys(itemDetails.buyer).length === 0 && (
                          <Th>Sell to Bidder</Th>
                        )}
                    </Tr>
                  </Thead>
                  <Tbody>{bidsTableEl}</Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default ItemDetails;
