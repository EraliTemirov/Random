import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Regester = ({ onRegister }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      alert("Iltimos, to'liq 6 xonali kodni kiriting.");
      return;
    }

    try {
      const response = await fetch(
        "https://walrus-app-zqt9j.ondigitalocean.app/api/v1/auth/enter-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionCode: fullCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Noma'lum xatolik yuz berdi");
      }

      const data = await response.json();

      if (data.message === "Session kodi to'g'ri tasdiqlandi") {
        // Token va userId'ni localStorage'ga saqlash
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Token muvaffaqiyatli saqlandi");
        } else {
          console.warn("Token mavjud emas");
        }

        if (data.userId) {
          localStorage.setItem("userId", data.userId);
          console.log("UserId muvaffaqiyatli saqlandi");
        } else {
          console.warn("UserId mavjud emas");
        }

        onRegister(); // Agar bu funksiya hali ham kerak bo'lsa
        navigate("/home");
      } else {
        alert("Kutilmagan javob. Iltimos, qaytadan urinib ko'ring.");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      if (error instanceof Error) {
        alert(`Xatolik yuz berdi: ${error.message}`);
      } else {
        alert("Noma'lum xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white px-4"
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Kodni Kiriting
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          @ushbu telegram botiga kiring va tasdiqlash kodini oling.
        </p>
        <div className="flex justify-center space-x-3 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-14 border-2 border-blue-300 rounded-lg text-center text-2xl font-semibold focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg"
        >
          Yuborish
        </button>
      </div>
    </form>
  );
};

export default Regester;
