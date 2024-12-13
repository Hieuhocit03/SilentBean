import React, { useState } from "react";
import GroupList from "../components/GroupList.tsx";
import GroupForm from "../components/GroupForm.tsx";
import GroupDetail from "../components/GroupDetail.tsx";
import GroupSearchList from "../components/GroupSearchList.tsx";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";

export const GroupPage = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null); // Nhóm đang chọn
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false); // Trạng thái tạo nhóm
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsCreatingGroup(false); // Nếu chuyển sang detail, tắt trạng thái tạo nhóm
  };

  const handleJoinGroup = (groupId: string) => {
    setSelectedGroupId(groupId); // Tham gia nhóm và xem detail
    setIsCreatingGroup(false);
  };

  const handleCreateGroup = () => {
    setIsCreatingGroup(true); // Chuyển sang trang tạo nhóm
    setSelectedGroupId(null); // Không chọn nhóm nào
  };

  const handleBack = () => {
    // Quay lại trạng thái ban đầu
    if (isCreatingGroup) {
      setIsCreatingGroup(false); // Nếu đang tạo nhóm, quay lại màn hình ban đầu
    } else if (selectedGroupId) {
      setSelectedGroupId(null); // Nếu đang xem chi tiết nhóm, quay lại danh sách nhóm
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <Header
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "hidden" : "block"
        }`}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      </div>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <div className="flex flex-col md:w-1/2 bg-white shadow-md rounded-lg p-4">
          <GroupList onSelectGroup={handleGroupSelect} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:w-1/2 bg-white shadow-md rounded-lg p-4">
          {/* Nút Back */}
          {(selectedGroupId || isCreatingGroup) && (
            <button
              onClick={handleBack}
              className="mb-4 text-sm text-gray-500 hover:text-gray-800 underline self-start"
            >
              ← Quay lại
            </button>
          )}

          {!selectedGroupId && !isCreatingGroup && (
            <>
              <GroupSearchList onJoinGroup={handleJoinGroup} />
              <h2 className="text-xl font-semibold mt-6 text-gray-700 border-b pb-2">
                Tạo nhóm mới
              </h2>
              <button
                onClick={handleCreateGroup}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Tạo ngay
              </button>
            </>
          )}

          {selectedGroupId && !isCreatingGroup && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                Thông tin chi tiết nhóm
              </h2>
              <GroupDetail groupId={selectedGroupId} />
            </>
          )}

          {isCreatingGroup && (
            <>
              <GroupForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
