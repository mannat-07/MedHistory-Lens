import { createBrowserRouter } from "react-router";
import { Landing } from "./components/Landing";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Processing } from "./components/Processing";
import { NewDashboard } from "./components/NewDashboard";
import { HealthOverview } from "./components/HealthOverview";
import { AiPrediction } from "./components/AiPrediction";
import { Reports } from "./components/Reports";
import { BloodCount } from "./components/BloodCount";
import { HeartCholesterol } from "./components/HeartCholesterol";
import { OrganSugarLevels } from "./components/OrganSugarLevels";
import { Vitamins } from "./components/Vitamins";
import { BiomarkerDetail } from "./components/BiomarkerDetail";
import { NewAiChat } from "./components/NewAiChat";
import { UploadReport } from "./components/UploadReport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/processing",
    Component: Processing,
  },
  {
    path: "/upload-report",
    Component: UploadReport,
  },
  {
    path: "/dashboard",
    Component: NewDashboard,
  },
  {
    path: "/health-overview",
    Component: HealthOverview,
  },
  {
    path: "/ai-prediction",
    Component: AiPrediction,
  },
  {
    path: "/reports",
    Component: Reports,
  },
  {
    path: "/blood-count",
    Component: BloodCount,
  },
  {
    path: "/heart-cholesterol",
    Component: HeartCholesterol,
  },
  {
    path: "/organ-sugar",
    Component: OrganSugarLevels,
  },
  {
    path: "/vitamins",
    Component: Vitamins,
  },
  {
    path: "/biomarker/:biomarker",
    Component: BiomarkerDetail,
  },
  {
    path: "/chat",
    Component: NewAiChat,
  },
]);