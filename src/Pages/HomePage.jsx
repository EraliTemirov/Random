import React, { useState, useEffect, useCallback } from "react";
import { Gift } from "lucide-react";
import ReactConfetti from "react-confetti";
import imagePacc from "../assets/рассс.jpg";

const AnimatedNumber = ({ number, onComplete, isSingle }) => {
  const [displayNumber, setDisplayNumber] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let intervalId;
    let currentIndex = 0;

    const generateRandomNumber = () => {
      return Math.floor(Math.random() * 10).toString();
    };

    const animateNumber = () => {
      if (currentIndex < number.length) {
        setDisplayNumber((prev) => {
          const newNumber = prev
            .padEnd(number.length, "_")
            .split("")
            .map((char, index) => {
              if (index === currentIndex) return number[index];
              if (index > currentIndex) return generateRandomNumber();
              return char;
            })
            .join("");
          return newNumber;
        });

        if (Math.random() < 0.3) {
          currentIndex++;
        }
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
      }
    };

    intervalId = setInterval(animateNumber, 50);

    return () => clearInterval(intervalId);
  }, [number]);

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span
      className={`font-mono ${isSingle ? "text-4xl" : "text-xl"} text-white`}
    >
      {displayNumber}
    </span>
  );
};

const AnimatedText = ({ text, onComplete, isSingle }) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;

    const animateText = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(animateText, 100);
      } else {
        setIsComplete(true);
      }
    };

    timeoutId = setTimeout(animateText, 500);

    return () => clearTimeout(timeoutId);
  }, [text]);

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span
      className={`font-bold ${isSingle ? "text-5xl" : "text-2xl"} text-white`}
    >
      {displayText}
    </span>
  );
};

const GiftCard = ({
  giftName,
  userPhone,
  giftImage,
  show,
  onComplete,
  isSingle,
}) => {
  const [showNumber, setShowNumber] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNumberComplete = useCallback(() => {
    setShowName(true);
  }, []);

  const handleNameComplete = useCallback(() => {
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
      onComplete();
    }, 3000);
  }, [onComplete]);

  useEffect(() => {
    if (show) {
      setShowNumber(true);
    }
  }, [show]);

  return (
    <div
      className={`bg-white bg-opacity-20 p-8 rounded-2xl shadow-2xl transition-all duration-300 flex ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${isSingle ? "text-center w-full max-w-2xl mx-auto" : ""}`}
    >
      <div className="flex-shrink-0 mr-4">
        <img
          src={giftImage}
          alt={giftName}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <div className="flex-grow">
        {showNumber && (
          <div
            className={`flex items-center space-x-4 ${
              isSingle ? "justify-center" : ""
            }`}
          >
            <span className={`text-white ${isSingle ? "text-2xl" : "text-xl"}`}>
              Telefon:
            </span>
            <AnimatedNumber
              number={userPhone}
              onComplete={handleNumberComplete}
              isSingle={isSingle}
            />
          </div>
        )}
        {showName && (
          <div className="mt-6">
            <AnimatedText
              text={giftName}
              onComplete={handleNameComplete}
              isSingle={isSingle}
            />
          </div>
        )}
        {showCongrats && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={150}
            gravity={0.1}
            tweenDuration={5000}
            initialVelocityX={3}
            initialVelocityY={5}
            colors={["#FFD700", "#FFA500", "#FF6347", "#FF69B4", "#00CED1"]}
          />
        )}
      </div>
    </div>
  );
};

export default function GiftDistribution() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [distributionResult, setDistributionResult] = useState(null);
  const [error, setError] = useState(null);
  const [showIndex, setShowIndex] = useState(-1);
  const [selectedGiftIndex, setSelectedGiftIndex] = useState(-1);

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleCardComplete = useCallback(() => {
    setShowIndex((prevIndex) => prevIndex + 1);
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch(
        "https://whale-app-lmern.ondigitalocean.app/api/v1/auth/gifts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Sovg'alarni olishda xatolik yuz berdi");
      }
      const data = await response.json();
      setGifts(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const distributeGifts = async () => {
    if (gifts.length === 0) {
      setError("Sovg'alar mavjud emas");
      return;
    }

    setLoading(true);
    setError(null);
    setDistributionResult(null);
    setShowIndex(-1);

    try {
      const nextGiftIndex =
        selectedGiftIndex === -1 ? 0 : (selectedGiftIndex + 1) % gifts.length;
      setSelectedGiftIndex(nextGiftIndex);

      const response = await fetch(
        `https://whale-app-lmern.ondigitalocean.app/api/v1/auth/gifts/random`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Sovg'ani taqsimlashda xatolik yuz berdi");
      }

      const data = await response.json();
      setDistributionResult(
        data.data.map((gift) => ({
          ...gift,
          giftImage: gift.giftImage || "default-gift-image.jpg", // Use a default image if none provided
        }))
      );
      setShowIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-gradient-to-br from-purple-600 to-pink-500 overflow-hidden"
      style={{
        backgroundImage: `url(${imagePacc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style jsx global>{`
        html,
        body {
          overflow: hidden;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          border: 3px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <div className="p-4 flex-grow flex flex-col overflow-hidden ">
        <div className="flex-grow flex flex-col items-center justify-start overflow-y-auto custom-scrollbar mt-96">
          <h1 className="text-6xl max-sm:text-3xl font-bold text-white drop-shadow-lg mb-20">
            Sovg'alar
          </h1>
          <button
            className="px-8 py-4 mb-6 bg-yellow-400 text-purple-900 text-xl font-bold rounded-full shadow-lg hover:bg-yellow-500 transition duration-300 flex items-center space-x-3 z-10"
            onClick={distributeGifts}
            disabled={loading || gifts.length === 0}
          >
            <Gift size={32} />
            <span>
              {loading ? "Tarqatilmoqda..." : "Sovg'alarni tarqatish"}
            </span>
          </button>
          {loading && (
            <div className="text-2xl text-white animate-pulse mb-6">
              Sovg'alar tarqatilmoqda...
            </div>
          )}
          {error && (
            <div className="text-xl text-red-300 bg-red-900 p-4 rounded-lg mb-6">
              Xato: {error}
            </div>
          )}
          {distributionResult && (
            <div className="w-full max-w-4xl px-4 space-y-6">
              {distributionResult.map((item, index) => (
                <GiftCard
                  key={index}
                  giftName={item.giftName}
                  userPhone={item.userPhone}
                  giftImage={item.image}
                  show={index <= showIndex}
                  onComplete={handleCardComplete}
                  isSingle={distributionResult.length === 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
