import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MYIN — Your skills. Your community. Your impact.",
  description:
    "An AI-powered opportunity network connecting Muslim students with meaningful internships, volunteer roles, mentorships, and community projects.",
  openGraph: {
    title: "MYIN — Muslim Youth Internship Network",
    description: "Your skills. Your community. Your impact.",
    images: [{ url: "/og.png", width: 1792, height: 896, alt: "MYIN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MYIN — Muslim Youth Internship Network",
    description: "Your skills. Your community. Your impact.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
