import React from "react";
import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { LibraryCard } from "./pages/LibraryCard.tsx";
import { FlashCard } from "./pages/FlashCard.tsx";
import CardDetails from "./components/CardDetails.tsx";
import FlashCardMode from "./components/FlashCardMode.tsx";
import ActiveRecallMode from "./components/ActiveRecallMode.tsx";
import MatchGame from "./components/MathGameMode.tsx";
import { GroupPage } from "./pages/GroupPage.tsx";
import AddFlashCard from "./components/AddFlashCard.tsx";
import GroupComment from "./components/GroupComment.tsx";
import { UserDetail } from "./pages/UserDetail.tsx";
import { ChallengePage } from "./pages/ChallengePage.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import { DashBoard } from "./pages/DashBoard.tsx";
import { FavoriteCards } from "./pages/FavoriteCards.tsx";
import ForgotPassword from "./components/ForgotPassword.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/library-card" element={<LibraryCard />} />
          <Route path="/flash-card" element={<FlashCard />} />
          <Route path="/card-detail/:_id" element={<CardDetails />} />
          <Route path="/card/:_id" element={<FlashCardMode />} />
          <Route path="/card-ar/:_id" element={<ActiveRecallMode />} />
          <Route path="/card-game/:_id" element={<MatchGame />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/group/:groupId/add" element={<AddFlashCard />} />
          <Route path="/group/:cardId/comments" element={<GroupComment />} />
          <Route path="/profile/:userId" element={<UserDetail />} />
          <Route path="/challenge/:cardId" element={<ChallengePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/favorite" element={<FavoriteCards />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
