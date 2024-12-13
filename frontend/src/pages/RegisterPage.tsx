import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import layout from "../assets/images/layout.png";
import logo from "../assets/images/Logo.png";
import axios from "axios";

export const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState("register");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const [errormessage, setErrorMessage] = useState("");

  const validateEmail = (value) => {
    if (!value) {
      setErrorMessage("Email không được để trống.");
    } else if (!value.endsWith("@gmail.com")) {
      setErrorMessage("Email phải có đuôi @gmail.com.");
    } else {
      setErrorMessage(""); // Dữ liệu hợp lệ
    }
  };

  const handleBlur = () => {
    validateEmail(email);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  useEffect(() => {
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    let days = 31;
    if (monthInt === 2) {
      days = isLeapYear(yearInt) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(monthInt)) {
      days = 30;
    }

    setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
  }, [month, year]);

  const years = Array.from(
    { length: 125 },
    (_, i) => new Date().getFullYear() - i
  );

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    const payload = { email, username, password, dateOfBirth };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Đăng ký thành công!", response.data);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        // Xử lý lỗi từ server
        setErrorMessage(err.response.data.msg || "Đăng ký thất bại");
      } else {
        // Lỗi kết nối hoặc lỗi khác
        console.error("Lỗi kết nối:", err);
        setErrorMessage("Không thể kết nối tới server");
      }
    }
  };

  return (
    <div className="flex items-center h-screen w-full bg-gray-100">
      <img src={layout} className="h-screen" />
      <div className="w-[650px] h-[740px] top-4 right-12 rounded-3xl absolute bg-white">
        <div className="flex gap-x-40 p-6">
          <div className="grid grid-cols-2 gap-x-32 mt-20 ml-14">
            <p
              className={`font-serif text-lg whitespace-nowrap transition-opacity duration-300 ${
                activeTab === "register"
                  ? "opacity-100 font-bold underline"
                  : "opacity-50"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Đăng Ký
            </p>
            <Link
              to="/login"
              className={`font-serif text-lg whitespace-nowrap transition-opacity duration-300 ${
                activeTab === "login"
                  ? "opacity-100 font-bold underline"
                  : "opacity-50"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Đăng Nhập
            </Link>
          </div>
          <img className="" src={logo} />
        </div>
        <div className="ml-20 mt-[-16px]">
          <p className="font-serif">Ngày sinh</p>
          <div className="flex gap-4 mt-1">
            <select
              className="bg-white w-[150px] h-[50px] rounded-lg font-serif p-4 border border-black text-center"
              name="day"
              id="day"
              value={day}
              onChange={handleDayChange}
            >
              <option value="" disabled hidden>
                Ngày
              </option>
              {daysInMonth.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="bg-white w-[150px] h-[50px] rounded-lg font-serif p-4 border border-black text-center"
              name="month"
              id="month"
              value={month}
              onChange={handleMonthChange}
            >
              <option value="" disabled hidden>
                Tháng
              </option>
              {[
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12",
              ].map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="bg-white w-[150px] h-[50px] rounded-lg font-serif p-4 border border-black text-center"
              name="year"
              id="year"
              value={year}
              onChange={handleYearChange}
            >
              <option value="" disabled hidden>
                Năm
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="ml-20 mt-4">
          <p className="font-serif">Tên người dùng</p>
          <input
            className="bg-gray-100 w-[480px] h-[50px] rounded-lg mt-1 p-4"
            type="text"
            name="username"
            id="username"
            placeholder="abc123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="ml-20 mt-4">
          <p className="font-serif">Email</p>
          <input
            className="bg-gray-100 w-[480px] h-[50px] rounded-lg mt-1 font-serif p-4"
            type="email"
            name="email"
            id="email"
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        <div className="ml-20 mt-4 relative">
          <p className="font-serif">Password</p>
          <img
            className="absolute ml-[440px] mt-4"
            src="src\images\eyes.png"
            alt=""
          />
          <input
            className="bg-gray-100 w-[480px] h-[50px] rounded-lg mt-1 font-serif p-4"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="ml-20 mt-2 h-6">
          {errormessage && <p className="text-red-500">{errormessage}</p>}{" "}
        </div>
        <div className="flex justify-center items-center mt-2">
          <button
            onClick={handleRegister}
            className="w-[250px] h-[40px] bg-[#75A47F] rounded-2xl text-[#FCFFE0]"
          >
            Đăng ký ngay
          </button>
        </div>
        <div className="">
          <p className="ml-[430px] mt-8">Tìm hiểu thêm về chúng tôi</p>
          <p className="flex gap-3 mt-2 ml-[450px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-8 w-8"
            >
              <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-8 w-8"
            >
              <path d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-8 w-8"
            >
              <path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              className="h-8 w-8"
            >
              <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
};
