import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const validGenders = ["male", "female", "others"];
export const basicSchema = yup.object().shape({
  email: yup.string().email("Please Enter a valid email").required("Required"),

  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),

  firstName: yup.string().required("Required"),

  lastName: yup.string().required("Required"),

  address: yup.string().required("Required"),

  phoneNumber: yup.string()
  .matches(/^[0-9()]+$/, "Phone number can only contain digits")
  .min(11, "Phone number must be at least 11 characters")
  .max(11, "Phone number cannot be longer than 11 characters")
  .required("Phone number is required"),

  gender: yup.string()
    .oneOf(validGenders, {message: "Invalid gender option"})
    .required("Required"), 

    birthdate: yup.date()
    .required("Birthdate is required"),
});
