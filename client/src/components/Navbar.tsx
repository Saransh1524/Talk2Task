
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     // The <nav> element itself should stretch full width
// <nav className="sticky top-0 z-50 bg-blue-200 shadow-md w-full   w-full rounded-2xl mx-2 mt-2">
//   <div className="container mx-auto px-4 py-2 flex justify-between items-center">
//     <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
//       Talk2Task
//     </Link>
//     <div className="flex gap-3 text-gray-700">
//       <Link to="/">
//         <Button className="text-lg" variant="ghost">Home</Button>
//       </Link>
//       <Link to="/history">
//         <Button className="text-lg" variant="ghost">History</Button>
//       </Link>
//       <Button
//         variant="outline"
//         onClick={handleLogout}
//         className="border-blue-500 text-blue-500 hover:bg-blue-100 hover:text-blue-600 text-lg"
//       >
//         Logout
//       </Button>
//     </div>
//   </div>
// </nav>

//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check if token exists
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-200 shadow-md w-full rounded-2xl mx-2 mt-2">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Talk2Task
        </Link>
        <div className="flex gap-3 text-gray-700">
          <Link to="/">
            <Button className="text-lg" variant="ghost">Home</Button>
          </Link>
          <Link to="/history">
            <Button className="text-lg" variant="ghost">History</Button>
          </Link>

          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-blue-500 text-blue-500 hover:bg-blue-100 hover:text-blue-600 text-lg"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleLogin}
              className="border-blue-500 text-blue-500 hover:bg-blue-100 hover:text-blue-600 text-lg"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
