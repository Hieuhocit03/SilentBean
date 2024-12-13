import { useState } from "react";
import React from "react";
import axios from "axios";
import logo from "../assets/images/Logo.png";
import { KeyRound, ArrowLeft, Mail, Lock } from "lucide-react";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/check-email",
        { email }
      );
      setMessage(response.data.message);
      setError("");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setError("");

      const confirmRedirect = window.confirm(
        "Đặt lại mật khẩu thành công! Bạn có muốn đến trang đăng nhập không?"
      );
      if (confirmRedirect) {
        window.location.href = "/login";
      } else {
        setStep(1);
        setEmail("");
        setNewPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Silent Bean"
            className="w-32 h-32 mx-auto mb-4 animate-fade-in"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </h1>
          <p className="text-gray-600">
            {step === 1
              ? "Nhập email của bạn để đặt lại mật khẩu"
              : "Tạo mật khẩu mới cho tài khoản của bạn"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 animate-fade-in">
              <p className="font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 animate-fade-in">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCheckEmail} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập email để xác minh"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                <KeyRound className="h-5 w-5" />
                <span>{isLoading ? "Kiểm tra..." : "Tiếp tục"}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại kiểm tra
              </button>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  <KeyRound className="h-5 w-5" />
                  <span>
                    {isLoading ? "Đang thiết lập lại..." : "Đặt lại mật khẩu"}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p> Bạn còn nhớ mật khẩu không?</p>
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
