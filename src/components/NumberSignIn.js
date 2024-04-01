import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./HomePage"; // Import the Home component
import bcrypt from 'bcryptjs'; // Import bcrypt library
import SignInForm from "./SignInForm"; // Import the email sign-in form
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  phoneNumber: yup.string()
    .matches(/^[0-9()]+$/, "Only contain digits")
    .min(11, "At least 11 characters")
    .max(11, "11 characters only")
    .required("Ex. 09000000000"),
});

const SignInFormNumber = () => {
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null); // State to store logged-in user
  const [showEmailForm, setShowEmailForm] = useState(false); // State to track which form to show

  const handleToggleForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
        params: {
          phoneNumber: values.phoneNumber,
        },
      });

      if (response.data.length > 0) {
        const user = response.data[0];
        // Decrypt the password stored in the database and compare it with the entered password
        const isPasswordCorrect = await bcrypt.compare(values.password, user.password);

        if (isPasswordCorrect) {
          console.log("Login successful");
          setLoggedInUser(user); // Set the logged-in user
          formik.resetForm();
          setError("");
        } else {
          console.log("Invalid password");
          window.alert("Invalid Credentials");
        }
      } else {
        console.log("User not found");
        window.alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      window.alert("Error logging in. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  // Add event listener to the form for Enter key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (formik.isValid) {
          formik.handleSubmit();
        } else {
          window.alert("Invalid mobile number format");
        }
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [formik.isValid, formik.handleSubmit]);

  return (
    <div>
      {showEmailForm ? (
        <SignInForm /> // Render email sign-in form if showEmailForm is true
      ) : (
        <div>
          {loggedInUser ? (
            <Home user={loggedInUser} /> // Render Home component if user is logged in
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="block text-gray-700 text-base" htmlFor="phoneNumber">
                  Mobile Number
                </label>
                <input
                  className={`mt-1 p-2 rounded-md border text-sm focus:border-indigo-500 focus:outline-none text-black ${formik.errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your mobile number"
                  required
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</div>
                ) : null}
              </div>
              <button className="text-green-500 text-xs" onClick={handleToggleForm}>Use Email</button>
              <div>
                <label
                  className="block text-gray-700 text-base mt-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className={`mt-1 p-2 rounded-md border text-sm focus:border-indigo-500 focus:outline-none text-black`}
                  required
                />
              </div>
              {error && <p>{error}</p>}
              <div className="flex justify-center">
                <button
                  className={`mt-4 active:scale-[.98] active:duration-75 hover:scale-[1.01] easy-in-out transition-all py-1 px-4 rounded-l bg-green-700 hover:bg-green-600 text-white text-sm font-bold`}
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SignInFormNumber;
