import { useMemo } from "react";
import bird from "../assets/bird.png";
import cat from "../assets/cat.png";
import deer from "../assets/deer.png";
import eagle from "../assets/eagle.png";
import owl from "../assets/owl.png";
import wolf from "../assets/wolf.png";

const illustrations = [bird, cat, deer, eagle, owl, wolf];

const AuthLayout = ({ children }) => {
  // Memoize random image so it doesn't change on re-render
  const randomImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * illustrations.length);
    return illustrations[randomIndex];
  }, []);
  console.log(randomImage);

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      
  {/* Left Illustration */}
  <div className="hidden md:flex items-center justify-center bg-[#fcefe1] w-full">
    <div className="relative w-full h-full">
      <img
        src={randomImage}
        alt="Auth Illustration"
        className="absolute inset-0 m-auto max-w-full max-h-full object-cover"
      />
    </div>
  </div>

  {/* Right Form */}
  <div className="flex items-center justify-center">
    <div className="w-full max-w-md px-4">{children}</div>
  </div>
</div>
  );
};

export default AuthLayout;
