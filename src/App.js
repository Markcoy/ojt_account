import { useState } from "react";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [view, setView] = useState("signin");

  return (
    <div className="flex justify-center h-screen items-start bg-gradient-to-b from-green-500 to-black">
      <BrowserRouter>
        <div className="bg-white rounded-lg p-8 shadow-md mt-8">
          <nav className="flex justify-center mb-8">
            <Link
              to="/signin"
              className={`cursor-pointer mx-2 ${
                view === "signin"
                  ? "text-green-700 text-xl font-bold"
                  : "text-gray-400 text-xl"
              }`}
              onClick={() => setView("signin")}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`cursor-pointer mx-2 ${
                view === "signup"
                  ? "text-green-700 text-xl font-bold"
                  : "text-gray-400 text-xl"
              }`}
              onClick={() => setView("signup")}
            >
              Sign Up
            </Link>
          </nav>
          <Routes>
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
