import {
  FormControl,
  FormErrorMessage,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { AxiosBase } from "../Axios";
import { useContext } from "react";
import { AuthContext } from "../hooks/context";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const setUser = useContext(AuthContext).userState[1];
  const setToken = useContext(AuthContext).tokenState[1];
  const handleSubmit = async (values) => {
    try {
      const res = await AxiosBase.post(`/login`, {
        username: values.username,
        email: values.email,
        password: values.password,
        buyerOrSeller: values.buyerOrSeller,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setToken(res.data.token);
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
  return (
    <div className="min-h-screen bg-neutral-900 grid place-items-center">
      <div className="container max-w-96 mx-auto text-center">
        <h1 className="text-gray-200 uppercase font-semibold text-2xl my-4">
          Login
        </h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form className="flex flex-col gap-4">
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
          <p className="text-gray-300">Don't have an account?</p>
          <Link to="/register">
            <Button colorScheme="messenger" type="button" variant="outline">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
