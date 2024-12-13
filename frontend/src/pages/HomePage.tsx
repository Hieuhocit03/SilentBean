import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#75A47F] to-[#5e8d64] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo placement */}
            <div className="flex justify-center mb-2 mt-[-30px]">
              <img
                src={Logo}
                alt="Silent Bean Logo"
                className="h-48 w-auto animate-fade-in"
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  animation: "fadeIn 0.6s ease-in",
                }}
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Làm chủ bất kỳ kiến thức nào với
              <span className="block text-gray-100 mt-3">Silent Bean</span>
            </h1>
            <p
              className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto font-inter"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Tạo, học và nắm vững các môn học của bạn với hệ thống thẻ ghi nhớ
              thông minh của chúng tôi. Hoàn hảo cho sinh viên, chuyên gia và
              những người học suốt đời.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white text-[#75A47F] rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Bắt đầu nào!
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tại sao nên chọn hệ thống thẻ ghi nhớ của chúng tôi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-[#75A47F]/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#75A47F] rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Bạn đã sẵn sàng để bắt đầu học chưa?
              </h2>
              <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
                Tham gia cùng hàng ngàn sinh viên đang cải thiện thói quen học
                tập của mình với hệ thống thẻ ghi nhớ của chúng tôi.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white text-[#75A47F] rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Học ngay thôi!
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Học thông minh",
    description:
      "Hệ thống của chúng tôi thích ứng với tốc độ học tập của bạn và giúp bạn tập trung vào những gì bạn cần ôn tập nhất.",
    icon: (
      <svg
        className="w-6 h-6 text-[#75A47F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "Tổ chức dễ dàng",
    description:
      "Tạo và sắp xếp các thẻ ghi nhớ của bạn thành các bộ cho các môn học và chủ đề khác nhau.",
    icon: (
      <svg
        className="w-6 h-6 text-[#75A47F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: "Theo dõi tiến độ",
    description:
      "Theo dõi tiến độ học tập của bạn và xác định những lĩnh vực cần chú ý nhiều hơn.",
    icon: (
      <svg
        className="w-6 h-6 text-[#75A47F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];
