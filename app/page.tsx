import { Metadata } from "next";
import HomeScreen from "./features/HomeScreen";

export const metadata: Metadata = {
  title: "TOP | LegalBase",
};

export default function Page() {
  return <HomeScreen isLegiew={false} />;
}
