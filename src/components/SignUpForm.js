import { useFormik } from "formik";
import { basicSchema } from "../schemas";
import axios from 'axios';
import React from 'react';
import bcrypt from 'bcryptjs'; // Import bcrypt library

const SignUpForm = () => {
  const handleFormSubmit = async (values, actions) => {
    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(values.password, 10); // 10 is the salt rounds

      // Replace plain password with hashed password
      values.password = hashedPassword;

      // Check if the email already exists in the database
      const { data: existingEmail } = await axios.get('http://localhost:8000/users', {
        params: {
          email: values.email
        }
      });
  
      // Check if the mobile number already exists in the database
      const { data: existingPhoneNumber } = await axios.get('http://localhost:8000/users', {
        params: {
          phoneNumber: values.phoneNumber
        }
      });
  
      if (existingEmail.length > 0) {
        window.alert("Email already exists. Please use a different one.");
        actions.setFieldError('email', 'Email already exists');
        return;
      }
  
      if (existingPhoneNumber.length > 0) {
        window.alert("Mobile number already exists. Please use a different one.");
        actions.setFieldError('phoneNumber', 'Mobile number already exists');
        return;
      }
  
      // Post data to JSON Server if email and mobile number are unique
      await axios.post('http://localhost:8000/users', values);
      console.log("Data successfully posted");
  
      // Reset form after successful submission
      actions.resetForm();
  
      // Display alert
      window.alert("Registered successfully!");
  
      // Redirect to sign-in page
      redirectToSignIn();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const redirectToSignIn = () => {
    // Perform redirection to the sign-in page
    window.location.href = '/signin'; // Redirect using window.location
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit: formikSubmit, // Rename handleSubmit to avoid conflict with custom handleSubmit function
    handleBlur,
    touched,
    setFieldTouched // Add setFieldTouched function from useFormik
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber:"",
      gender: "",
      birthdate: "",
    },
    validationSchema: basicSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <form
      onSubmit={formikSubmit}
      autoComplete="off"
      className="max-w-sm mx-auto"
    >
      <div className="mb-4">
        <div className="mt-8">
          <div className="flex gap-x-4">
            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="block text-gray-700 text-base"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your first name"
                className={`mt-1 p-2 rounded-md border text-sm ${
                  errors.firstName && touched.firstName ? "border-red-500" : "border-gray-300"
                } focus:border-indigo-500 focus:outline-none text-black`}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="block text-gray-700 text-base"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your last name"
                className={`mt-1 p-2 rounded-md border text-sm ${
                  errors.lastName && touched.lastName ? "border-red-500" : "border-gray-300"
                } focus:border-indigo-500 focus:outline-none text-black`}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        <label htmlFor="address" className="block text-gray-700 text-base mt-1">
          Address
        </label>
        <input
          id="address"
          type="address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your address"
          className={` mt-1 p-2 block w-full rounded-md border text-sm ${
            errors.address && touched.address ? "border-red-500" : "border-gray-300"
          } focus:border-indigo-500 focus:outline-none text-black`}
        />
        {errors.address && touched.address && (
          <p className="text-xs text-red-500">{errors.address}</p>
        )}
        <div className="flex">
          <div className="flex flex-col mr-4">
            <label htmlFor="email" className="text-gray-700 text-base mt-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={() => {
                setFieldTouched('email', true);
                handleBlur('email');
              }}
              placeholder="Enter your email"
              className={`mt-1 p-2 rounded-md border text-sm ${
                errors.email && touched.email ? "border-red-500" : "border-gray-300"
              } focus:border-indigo-500 focus:outline-none text-black`}
            />
            {errors.email && touched.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phoneNumber"
              className="text-gray-700 text-base mt-1"
            >
              Mobile Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={() => {
                setFieldTouched('phoneNumber', true);
                handleBlur('phoneNumber');
              }}
              placeholder="Enter your mobile number"
              className={`mt-1 p-2 rounded-md border text-sm ${
                errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-300"
              } focus:border-indigo-500 focus:outline-none text-black`}
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <label
          htmlFor="password"
          className="block text-gray-700 text-base mt-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your password"
          className={` mt-1 p-2 block w-full rounded-md border text-sm ${
            errors.password && touched.password ? "border-red-500" : "border-gray-300"
          } focus:border-indigo-500 focus:outline-none text-black`}
        />
        {errors.password && touched.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}

<div className="flex justify-center">
  <div className="flex flex-col mr-4">
    <label htmlFor="gender" className="text-gray-700 text-base mt-1">
      Gender
    </label>
    <select
  className={`w-full border-2 text-sm border-gray-300 round-xl p-2 mt-1 bg-transparent text-black ${
    errors.gender && touched.gender ? "border-red-500" : "border-gray-300"
  } focus:border-indigo-500 focus:outline-none text-black`}
  id="gender"
  type="gender"
  value={values.gender}
  onChange={handleChange}
  onBlur={handleBlur}
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Others">Others</option>
</select>

    {errors.gender && touched.gender && (
      <p className="text-xs text-red-500">{errors.gender}</p>
    )}
  </div>

  <div className="flex flex-col">
    <label htmlFor="birthdate" className="text-gray-700 text-base mt-1">
      Birthdate
    </label>
    <input
      id="birthdate"
      type="date"
      value={values.birthdate}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`mt-1 p-2 rounded-md border text-sm ${
        errors.birthdate && touched.birthdate ? "border-red-500" : "border-gray-300"
      } focus:border-indigo-500 focus:outline-none text-black`}
    />
    {errors.birthdate && touched.birthdate && (
      <p className="text-xs text-red-500">{errors.birthdate}</p>
    )}
  </div>
</div>

</div>
      <div className="flex justify-center">
        <button
          disabled={isSubmitting}
          type="submit"
          className={`active:scale-[.98] active:duration-75 hover:scale-[1.01] easy-in-out transition-all py-1 px-4 rounded-l bg-green-700 hover:bg-green-600 text-white text-sm font-bold ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
export default SignUpForm;
