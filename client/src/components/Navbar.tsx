
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
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // check if token exists
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // check for saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card dark:bg-card border-b border-border shadow-sm w-full rounded-none">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            Talk2Task
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="sm:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </Button>
        </div>

        {/* Nav links */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-2 sm:gap-3 text-foreground absolute sm:static top-full left-0 w-full sm:w-auto bg-card sm:bg-transparent border-t sm:border-0 border-border p-3 sm:p-0`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link to="/">
              <Button className="w-full sm:w-auto text-base sm:text-lg" variant="ghost">Home</Button>
            </Link>
            <Link to="/history">
              <Button className="w-full sm:w-auto text-base sm:text-lg" variant="ghost">History</Button>
            </Link>
            <Button onClick={toggleTheme} variant="outline" size="sm" className="w-full sm:w-auto">
              {isDark ? "🌙 Dark" : "☀️ Light"}
            </Button>

            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full sm:w-auto text-base sm:text-lg"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleLogin}
                className="w-full sm:w-auto text-base sm:text-lg"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
