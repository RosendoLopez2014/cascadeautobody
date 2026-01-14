import { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Cascade Autobody & Paint Supply - your trusted source for professional auto body supplies in Yakima and Toppenish, Washington.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
