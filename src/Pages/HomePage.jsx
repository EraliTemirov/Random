import { useState, useEffect } from "react";
import "../App.css";

export const checkAuthToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Token topilmadi");
    return null;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Foydalanuvchi autentifikatsiya qilindi");
      return data;
    } else if (response.status === 401) {
      console.log("Token yaroqsiz yoki muddati tugagan");
      localStorage.removeItem("token");
      return null;
    } else {
      console.log("Kutilmagan javob statusi:", response.status);
      return null;
    }
  } catch (error) {
    console.error("So'rov xatosi:", error);
    return null;
  }
};
const RandomPhoneDisplay = () => {
  const [displayNumber, setDisplayNumber] = useState("998000000000");
  const [loading, setLoading] = useState(false);

  const finalNumber = "998931709455";

  useEffect(() => {
    if (loading) {
      startRandomAnimation();
    }
  }, [loading]);

  const fetchPhoneNumber = () => {
    setLoading(true);
  };

  const startRandomAnimation = () => {
    const duration = 100;
    const totalDigits = finalNumber.length - 3;
    let currentDigit = 0;

    const animateDigit = (digitIndex) => {
      if (digitIndex >= totalDigits) {
        setDisplayNumber(finalNumber);
        setLoading(false);
        return;
      }

      const interval = setInterval(() => {
        setDisplayNumber((prev) => {
          const newNumber = prev.split("");
          newNumber[digitIndex + 3] = Math.floor(Math.random() * 10).toString();
          return newNumber.join("");
        });
      }, duration);

      setTimeout(() => {
        clearInterval(interval);
        setDisplayNumber((prev) => {
          const newNumber = prev.split("");
          newNumber[digitIndex + 3] = finalNumber[digitIndex + 3];
          return newNumber.join("");
        });
        animateDigit(digitIndex + 1);
      }, 1000);
    };

    animateDigit(currentDigit);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 relative overflow-hidden bg-gradient framed">
      <div className="text-6xl font-bold m-8 max-sm:m-4 text-white drop-shadow-lg">
        <h1 className="text-6xl max-sm:text-3xl">{displayNumber}</h1>
      </div>
      <button
        className="px-6 py-3 mt-6 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 transition duration-300 max-sm:px-4 max-sm:py-2 max-sm:text-base animate-bounce"
        onClick={fetchPhoneNumber}
        disabled={loading}
      >
        {loading ? "Loading..." : "Show Phone Number"}
      </button>
    </div>
  );
};

export default RandomPhoneDisplay;
