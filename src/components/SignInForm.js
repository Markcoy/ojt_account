import { useState } from "react";
import axios from "axios";
import Home from "./HomePage"; // Import the Home component
import bcrypt from 'bcryptjs'; // Import bcrypt library

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null); // State to store logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:8000/users", {
        params: {
          email,
        },
      });

      if (response.data.length > 0) {
        const user = response.data[0];
        // Decrypt the password stored in the database and compare it with the entered password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
          console.log("Login successful");
          setLoggedInUser(user); // Set the logged-in user
          setEmail("");
          setPassword("");
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
      setError("Error logging in. Please try again.");
    }
  };


  return (
    <div>
      {loggedInUser ? (
        <Home user={loggedInUser} /> // Render Home component if user is logged in
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-base" htmlFor="email">
              Email
            </label>
            <input
              className={`mt-1 p-2 rounded-md border text-sm focus:border-indigo-500 focus:outline-none text-black`}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignInForm;
