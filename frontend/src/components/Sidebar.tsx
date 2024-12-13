import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ icon, title, to, isSidebarCollapsed }) => {
  const content = (
    <>
      <i
        className={`${icon} text-xl transition-transform group-hover:scale-110`}
      ></i>
      {!isSidebarCollapsed && (
        <span className="ml-3 font-medium transition-colors">{title}</span>
      )}
    </>
  );

  return (
    <li className="group mb-2" title={isSidebarCollapsed ? title : ""}>
      {to ? (
        <Link
          to={to}
          className="flex items-center py-3 px-4 rounded-lg
            text-white/90 hover:text-white no-underline
            hover:bg-white/10 active:bg-white/20
            transition-all duration-200 ease-in-out
            relative overflow-hidden"
        >
          {content}
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
            transform translate-x-[-100%] group-hover:translate-x-[100%] 
            transition-transform duration-700"
          ></div>
        </Link>
      ) : (
        <div
          className="flex items-center py-3 px-4 rounded-lg
          text-white/90 hover:text-white cursor-pointer
          hover:bg-white/10 active:bg-white/20
          transition-all duration-200 ease-in-out
          relative overflow-hidden"
        >
          {content}
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
            transform translate-x-[-100%] group-hover:translate-x-[100%] 
            transition-transform duration-700"
          ></div>
        </div>
      )}
    </li>
  );
};

export const Sidebar = ({ isSidebarCollapsed }) => {
  return (
    <div
      className={`fixed top-[55px] left-0 h-[calc(100vh-55px)] 
        ${isSidebarCollapsed ? "w-20" : "w-52"}
        bg-gradient-to-b from-[#75A47F] to-[#588561]
        shadow-xl z-10 transform transition-all duration-300 ease-in-out
        border-r border-white/10`}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ul className="mt-10 px-2">
            <MenuItem
              icon="fas fa-book"
              title="Thư viện"
              to="/library-card"
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <MenuItem
              icon="fas fa-users"
              title="Nhóm"
              to="/group"
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <MenuItem
              icon="fas fa-heart"
              title="Bộ thẻ yêu thích"
              to="/favorite"
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </ul>
        </div>
      </div>
    </div>
  );
};
