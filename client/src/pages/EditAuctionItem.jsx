import {
  FormControl,
  FormErrorMessage,
  Button,
  Input,
  useToast,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Select,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosBase, AxiosWithAuthorization } from "../Axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../hooks/context";

const EditAuctionItem = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [token, setToken] = useContext(AuthContext).tokenState;

  const formatDate = (date) => {
    date = new Date(date);
    const padZero = (num) => (num < 10 ? `0${num}` : `${num}`);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
  };

  const getItemDetails = async () => {
    const res = await AxiosBase.get(`/item/${itemId}`);
    const originalDetails = res.data;
    let category;
    let extraFields;
    switch (originalDetails.category) {
      case "drawing":
        category = "1";
        extraFields = {
          material: originalDetails.drawingDetails.drawingMedium,
          framed: originalDetails.drawingDetails.framed,
          height: originalDetails.drawingDetails.dimensions.height,
          length: originalDetails.drawingDetails.dimensions.length,
        };
        break;
      case "painting":
        category = "2";
        extraFields = {
          material: originalDetails.paintingDetails.paintingMedium,
          framed: originalDetails.paintingDetails.framed,
          height: originalDetails.paintingDetails.dimensions.height,
          length: originalDetails.paintingDetails.dimensions.length,
        };
        break;
      case "photograph":
        category = "3";
        extraFields = {
          material: originalDetails.photographicImageDetails.imageType,
          height: originalDetails.photographicImageDetails.dimensions.height,
          length: originalDetails.photographicImageDetails.dimensions.length,
        };
        break;
      case "sculpture":
        category = "4";
        extraFields = {
          material: originalDetails.sculptureDetails.materialUsed,
          height: originalDetails.sculptureDetails.dimensions.height,
          length: originalDetails.sculptureDetails.dimensions.length,
          width: originalDetails.sculptureDetails.dimensions.width,
          weight: originalDetails.sculptureDetails.weight,
        };
        break;
      case "carving":
        category = "5";
        extraFields = {
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
      artistName: originalDetails.artistName,
      productionYear: originalDetails.yearProduced,
      subjectClassification: originalDetails.subjectClassification,
      description: originalDetails.description,
      estimatedPrice: originalDetails.estimatedPrice,
      auctionDate: originalDetails.auctionDate
        ? formatDate(originalDetails.auctionDate)
        : "",
      category,
      ...extraFields,
      framed: true,
    };
    setItemDetails(modifiedDetails);
  };

  useEffect(() => {
    getItemDetails();
  }, []);

  const subjectClassificationOptionsArray = [
    "Landscape",
    "Seascape",
    "Portrait",
    "Figure",
    "Still Life",
    "Nude",
    "Animal",
    "Abstract",
    "Other",
  ];
  const categoryRadioArray = [
    "Drawing",
    "Painting",
    "Photograph",
    "Sculpture",
    "Carving",
  ];

  const subjectClassificationOptionsEl = subjectClassificationOptionsArray.map(
    (value, index) => (
      <option
        key={index}
        value={value.replace(" ", "-").toLowerCase()}
        className="text-black"
      >
        {value}
      </option>
    )
  );

  const categoryRadioEl = (field) => {
    return categoryRadioArray.map((value, index) => {
      return (
        <Radio key={index} {...field} value={(index + 1).toString()}>
          {value}
        </Radio>
      );
    });
  };

  const handleSubmit = async (values) => {
    try {
      let category;
      let extraFields;
      switch (values.category) {
        case "1":
          category = "drawing";
          extraFields = {
            drawingMedium: values.material,
            framed: values.framed,
            height: values.height,
            length: values.length,
          };
          break;
        case "2":
          category = "painting";
          extraFields = {
            paintingMedium: values.material,
            framed: values.framed,
            height: values.height,
            length: values.length,
          };
          break;
        case "3":
          category = "photograph";
          extraFields = {
            imageType: values.material,
            height: values.height,
            length: values.length,
          };
          break;
        case "4":
          category = "sculpture";
          extraFields = {
            materialUsed: values.material,
            height: values.height,
            length: values.length,
            width: values.width,
            weight: values.weight,
          };
          break;
        case "5":
          category = "carving";
          extraFields = {
            materialUsed: values.material,
            height: values.height,
            length: values.length,
            width: values.width,
            weight: values.weight,
          };
          break;
        default:
          break;
      }
      const res = await AxiosWithAuthorization(token).put(
        `/admin/item-edit/${itemId}`,
        {
          artistName: values.artistName,
          yearProduced: values.productionYear,
          subjectClassification: values.subjectClassification,
          category,
          description: values.description,
          estimatedPrice: values.estimatedPrice,
          auctionDate: new Date(values.auctionDate),
          ...extraFields,
        }
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
        <div className="min-h-screen bg-neutral-900 grid place-items-center py-16">
          <div className="container max-w-xl mx-auto text-center">
            <h1 className="text-gray-200 uppercase font-semibold text-2xl my-4">
              Edit existing auction item
            </h1>
            <Formik initialValues={itemDetails} onSubmit={handleSubmit}>
              {(props) => (
                <Form className="flex flex-col gap-4">
                  <Field
                    name="artistName"
                    validate={(value) => {
                      if (value.trim().length === 0)
                        return "Artist Name is required.";
                    }}
                  >
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.artistName && form.touched.artistName
                        }
                      >
                        <Input
                          {...field}
                          placeholder="Artist Name"
                          className="text-gray-300"
                          type="text"
                        />
                        <FormErrorMessage>
                          {form.errors.artistName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="productionYear"
                    validate={(value) => {
                      if (value.toString().length === 0)
                        return "Production Year is required.";
                      else if (value > 9999 || value < 0)
                        return "Enter a valid year.";
                    }}
                  >
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.productionYear &&
                          form.touched.productionYear
                        }
                      >
                        <InputGroup>
                          <InputRightElement className="text-gray-300">
                            A.D.
                          </InputRightElement>
                          <Input
                            {...field}
                            placeholder="Production Year"
                            className="text-gray-300"
                            type="number"
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.productionYear}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="subjectClassification"
                    validate={(value) => {
                      if (value === "")
                        return "Subject Classification is required.";
                    }}
                  >
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.subjectClassification &&
                          form.touched.subjectClassification
                        }
                      >
                        <Select
                          {...field}
                          placeholder="Subject Classification"
                          className={
                            form.touched.subjectClassification
                              ? `text-gray-300`
                              : `text-gray-400`
                          }
                        >
                          {subjectClassificationOptionsEl}
                        </Select>
                        <FormErrorMessage>
                          {form.errors.subjectClassification}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="description"
                    validate={(value) => {
                      if (value.trim().length === 0)
                        return "Description is required.";
                    }}
                  >
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.description && form.touched.description
                        }
                      >
                        <Input
                          {...field}
                          placeholder="Description"
                          className="text-gray-300"
                          type="text"
                        />
                        <FormErrorMessage>
                          {form.errors.description}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="estimatedPrice"
                    validate={(value) => {
                      if (value > 99999999.99 || value < 0)
                        return "The price is not within 0 to 99999999.99.";
                    }}
                  >
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.estimatedPrice &&
                          form.touched.estimatedPrice
                        }
                      >
                        <InputGroup>
                          <InputLeftElement className="text-gray-300">
                            $
                          </InputLeftElement>
                          <Input
                            {...field}
                            placeholder="Estimated Price"
                            className="text-gray-300"
                            type="number"
                            min={0}
                            max={99999999.99}
                            step={1}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.estimatedPrice}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="auctionDate">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.auctionDate && form.touched.auctionDate
                        }
                      >
                        <Input
                          {...field}
                          placeholder="Auction Date"
                          className="text-gray-300"
                          min={formatDate(new Date())}
                          type="date"
                        />
                        <FormErrorMessage>
                          {form.errors.auctionDate}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="category">
                    {({ field, form }) => (
                      <FormControl
                        className="text-gray-200"
                        isInvalid={
                          form.errors.category && form.touched.category
                        }
                      >
                        <FormLabel>Category :</FormLabel>
                        <RadioGroup {...field}>
                          <Stack direction="row" gap={8}>
                            {categoryRadioEl(field)}
                          </Stack>
                        </RadioGroup>
                        <FormErrorMessage>
                          {form.errors.category}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  {props.values?.category === "1" && (
                    <>
                      <Field
                        name="material"
                        validate={(value) => {
                          if (value === "")
                            return "Drawing material is required.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.material && form.touched.material
                            }
                          >
                            <Select
                              {...field}
                              placeholder="Drawing Material"
                              className={
                                form.touched.material
                                  ? `text-gray-300`
                                  : `text-gray-400`
                              }
                            >
                              <option className="text-black" value="pencil">
                                Pencil
                              </option>
                              <option className="text-black" value="ink">
                                Ink
                              </option>
                              <option className="text-black" value="charcoal">
                                Charcoal
                              </option>
                              <option className="text-black" value="other">
                                Other
                              </option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.material}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <div className="flex justify-between items-center gap-5">
                        <Field name="framed">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.framed && form.touched.framed
                              }
                            >
                              <Checkbox {...field} className="text-gray-300">
                                Framed
                              </Checkbox>
                              <FormErrorMessage>
                                {form.errors.framed}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="length"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Length.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.length && form.touched.length
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Length"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.length}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="height"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Height.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.height && form.touched.height
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Height"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.height}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </div>
                    </>
                  )}
                  {props.values?.category === "2" && (
                    <>
                      <Field
                        name="material"
                        validate={(value) => {
                          if (value === "")
                            return "Painting material is required.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.material && form.touched.material
                            }
                          >
                            <Select
                              {...field}
                              placeholder="Painting Material"
                              className={
                                form.touched.material
                                  ? `text-gray-300`
                                  : `text-gray-400`
                              }
                            >
                              <option className="text-black" value="oil">
                                Oil
                              </option>
                              <option className="text-black" value="acrylic">
                                Acrylic
                              </option>
                              <option className="text-black" value="watercolour">
                                Water Color
                              </option>
                              <option className="text-black" value="other">
                                Other
                              </option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.material}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <div className="flex justify-between items-center gap-5">
                        <Field name="framed">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.framed && form.touched.framed
                              }
                            >
                              <Checkbox {...field} className="text-gray-300">
                                Framed
                              </Checkbox>
                              <FormErrorMessage>
                                {form.errors.framed}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="length"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Length.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.length && form.touched.length
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Length"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.length}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="height"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Height.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.height && form.touched.height
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Height"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.height}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </div>
                    </>
                  )}
                  {props.values?.category === "3" && (
                    <>
                      <Field
                        name="material"
                        validate={(value) => {
                          if (value === "")
                            return "Painting material is required.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.material && form.touched.material
                            }
                          >
                            <Select
                              {...field}
                              placeholder="Image Type"
                              className={
                                form.touched.material
                                  ? `text-gray-300`
                                  : `text-gray-400`
                              }
                            >
                              <option
                                className="text-black"
                                value="black-and-white"
                              >
                                Black and white
                              </option>
                              <option className="text-black" value="colour">
                                Colour
                              </option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.material}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <div className="flex justify-between items-center gap-5">
                        <Field
                          name="length"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Length.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.Length && form.touched.Length
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Length"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.Length}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="height"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Height.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.height && form.touched.height
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Height"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.height}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </div>
                    </>
                  )}
                  {props.values?.category === "4" && (
                    <>
                      <Field
                        name="material"
                        validate={(value) => {
                          if (value.trim().length === 0)
                            return "Sculpted material is required.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.material && form.touched.material
                            }
                          >
                            <Select
                              {...field}
                              placeholder="Scuplted Material"
                              className={
                                form.touched.material
                                  ? `text-gray-300`
                                  : `text-gray-400`
                              }
                            >
                              <option className="text-black" value="bronze">
                                Bronze
                              </option>
                              <option className="text-black" value="marble">
                                Marble
                              </option>
                              <option className="text-black" value="pewter">
                                Pewter
                              </option>
                              <option className="text-black" value="other">
                                Other
                              </option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.material}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <div className="flex justify-between items-center gap-5">
                        <Field
                          name="height"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Height.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.height && form.touched.height
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Height"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.height}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="length"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Length.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.length && form.touched.length
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Length"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.length}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="width"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Width.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.width && form.touched.width
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Width"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.width}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </div>
                      <Field
                        name="weight"
                        validate={(value) => {
                          if (value <= 0) return "Invalid weignt.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.weight && form.touched.weight
                            }
                          >
                            <InputGroup>
                              <InputRightElement className="text-gray-300">
                                kg
                              </InputRightElement>
                              <Input
                                {...field}
                                placeholder="Weight"
                                className="text-gray-300"
                                type="number"
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.weight}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </>
                  )}
                  {props.values?.category === "5" && (
                    <>
                      <Field
                        name="material"
                        validate={(value) => {
                          if (value.trim().length === 0)
                            return "Carved material is required.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.material && form.touched.material
                            }
                          >
                            <Select
                              {...field}
                              placeholder="Carved Material"
                              className={
                                form.touched.material
                                  ? `text-gray-300`
                                  : `text-gray-400`
                              }
                            >
                              <option className="text-black" value="oak">
                                Oak
                              </option>
                              <option className="text-black" value="beach">
                                Beach
                              </option>
                              <option className="text-black" value="pine">
                                Pine
                              </option>
                              <option className="text-black" value="willow">
                                Willow
                              </option>
                              <option className="text-black" value="other">
                                Other
                              </option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.material}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <div className="flex justify-between items-center gap-5">
                        <Field
                          name="height"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Height.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.height && form.touched.height
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Height"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.height}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="length"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Length.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.length && form.touched.length
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Length"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.length}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field
                          name="width"
                          validate={(value) => {
                            if (value <= 0) return "Invalid Width.";
                          }}
                        >
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.width && form.touched.width
                              }
                            >
                              <InputGroup>
                                <InputRightElement className="text-gray-300">
                                  cm
                                </InputRightElement>
                                <Input
                                  {...field}
                                  placeholder="Width"
                                  className="text-gray-300"
                                  type="number"
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.width}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </div>
                      <Field
                        name="weight"
                        validate={(value) => {
                          if (value.toString().length === 0)
                            return "Weight is required.";
                          else if (value <= 0) return "Invalid weignt.";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.weight && form.touched.weight
                            }
                          >
                            <InputGroup>
                              <InputRightElement className="text-gray-300">
                                kg
                              </InputRightElement>
                              <Input
                                {...field}
                                placeholder="Weight"
                                className="text-gray-300"
                                type="number"
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.weight}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </>
                  )}
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
          </div>
        </div>
      )}
    </>
  );
};

export default EditAuctionItem;
