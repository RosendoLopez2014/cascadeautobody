import { Metadata } from "next";
import { PaintPageClient } from "./PaintPageClient";

export const metadata: Metadata = {
  title: "Paint Mixing Services",
  description:
    "Professional paint mixing and color matching services at Cascade Autobody & Paint Supply. Custom colors, OEM matching, and expert support.",
};

export default function PaintServicesPage() {
  return <PaintPageClient />;
}
