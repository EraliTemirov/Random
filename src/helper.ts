export const checkAuthToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Token topilmadi");
    throw new Error("Token topilmadi");
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
