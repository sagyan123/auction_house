import {
  FormControl,
  Card,
  InputGroup,
  Input,
  useToast,
  InputLeftElement,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  Button,
  ButtonGroup,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { AuthContext } from "../hooks/context";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AxiosWithAuthorization } from "../Axios";

const Item = ({
  id,
  artistName,
  description,
  price,
  alreadyBid,
  finalPrice,
}) => {
  const toast = useToast();
  const user = useContext(AuthContext).userState[0];
  const token = useContext(AuthContext).tokenState[0];
  const handleBid = async (values) => {
    try {
      const res = await AxiosWithAuthorization(token).post(
        `/buyer/item-bid/${id}`,
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
  return (
    <Card w="sm">
      <CardBody className="bg-zinc-900 rounded-t-sm text-gray-300 border-none">
        <Stack spacing="3">
          <Heading size="md">Artist: {artistName}</Heading>
          <Text noOfLines={3}>{description}</Text>
          {alreadyBid && (
            <Text color="gray.300" fontSize="2xl">
              Bid Price: $ {price}
            </Text>
          )}
          {!alreadyBid && !finalPrice && (
            <Text color="gray.300" fontSize="2xl">
              Estimated Price: $ {price}
            </Text>
          )}
          {finalPrice && (
            <Text color="gray.300" fontSize="2xl">
              Sold Price: $ {finalPrice}
            </Text>
          )}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter className="bg-zinc-950 rounded-b-sm">
        <ButtonGroup className="w-full flex justify-between items-center gap-4">
          <Link
            to={`/view-auction-item/${id}`}
            state={{ alreadyBid, bidPrice: price }}
          >
            <Button size="md" variant="solid" colorScheme="gray">
              View Details
            </Button>
          </Link>
          {user?.role === "admin" && (
            <Link to={`/edit-auction-item/${id}`}>
              <Button size="md" variant="solid" colorScheme="orange">
                Edit Details
              </Button>
            </Link>
          )}
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
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
export default Item;
