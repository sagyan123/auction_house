import {
  FormControl,
  FormErrorMessage,
  Button,
  Input,
  Radio,
  RadioGroup,
  Stack,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { AxiosBase } from "../Axios";

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const res = await AxiosBase.post(`/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role === "1" ? "buyer" : "seller",
      });
      navigate("/login");
      toast({
        title: res.data.message,
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (e) {
      if (
        e.response &&
        e.response.data &&
        Object.values(e.response.data)[0][0]
      ) {
        let error = Object.values(e.response.data)[0][0];
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
    <div className="min-h-screen bg-neutral-900 grid place-items-center">
      <div className="container max-w-96 mx-auto text-center">
        <h1 className="text-gray-200 uppercase font-semibold text-2xl my-4">
          Register
        </h1>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            passwordAgain: "",
            role: "1",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form className="flex flex-col gap-4">
              <Field
                name="name"
                validate={(value) => {
                  if (value.trim().length === 0) return "name is required.";
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <Input
                      {...field}
                      placeholder="Name"
                      className="text-gray-300"
                      type="text"
                    />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name="email"
                validate={(value) => {
                  if (value.trim().length === 0) return "Email is required.";
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <Input
                      {...field}
                      placeholder="Email"
                      className="text-gray-300"
                      type="email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name="password"
                validate={(value) => {
                  if (value.trim().length === 0) return "Password is required.";
                  else if (value.length < 8)
                    return "Password should be at least 8 letters long.";
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <Input
                      {...field}
                      placeholder="Password"
                      className="text-gray-300"
                      type="password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name="passwordAgain"
                validate={(value) => {
                  if (value.trim().length === 0)
                    return "Confirmation is required.";
                  else if (value !== props.values.password)
                    return "Your passwords don't match.";
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.passwordAgain && form.touched.passwordAgain
                    }
                  >
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      className="text-gray-300"
                      type="password"
                    />
                    <FormErrorMessage>
                      {form.errors.passwordAgain}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="role">
                {({ field, form }) => (
                  <FormControl
                    className="text-gray-200"
                    isInvalid={form.errors.role && form.touched.role}
                  >
                    <FormLabel>You are a :</FormLabel>
                    <RadioGroup {...field}>
                      <Stack direction="row">
                        <Radio {...field} value="1">
                          Buyer
                        </Radio>
                        <Radio {...field} value="2">
                          Seller
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    <FormErrorMessage>{form.errors.role}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme="messenger"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
        <div className="w-full flex gap-4 items-center justify-center py-4">
          <p className="text-gray-300">Already been here?</p>
          <Link to="/login">
            <Button colorScheme="messenger" type="button" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
