import React, { useState } from "react";
import axios from "axios";
import Home from "./HomePage"; // Import the Home component
import bcrypt from 'bcryptjs'; // Import bcrypt library
import SignInFormNumber from "./NumberSignIn"; // Import the mobile number sign-in form
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string()
    .email("Invalid email format")
    .required("Ex. sample@gmail.com"),
});

const SignInForm = () => {
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null); // State to store logged-in user
  const [showEmailForm, setShowEmailForm] = useState(true); // State to track which form to show

  const handleToggleForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
        params: {
          email: values.email,
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
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Check if email field has an error
      if (formik.errors.email) {
        window.alert(formik.errors.email);
      } else {
        formik.handleSubmit(); // Trigger form submission
      }
    }
  };

  return (
    <div>
      {showEmailForm ? (
        <div>
          {loggedInUser ? (
            <Home user={loggedInUser} /> // Render Home component if user is logged in
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="block text-gray-700 text-base" htmlFor="email">
                  Email
                </label>
                <input
                  className={`mt-1 p-2 rounded-md border text-sm focus:border-indigo-500 focus:outline-none text-black ${
                    formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={handleKeyPress} // Listen for key press event
                  placeholder="Enter your email"
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <button className="text-green-500 text-xs" onClick={handleToggleForm}>Use Mobile Number</button>
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
                  onKeyDown={handleKeyPress} // Listen for key press event
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
      ) : (
        <SignInFormNumber />
      )}
    </div>
  );
};

export default SignInForm;
