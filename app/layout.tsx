import type { Metadata } from "next";
import "./globals.css";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "To-Do",
  description:
    "A simple To-Do List Web App made in NextJS using Typescript, React, Tailwind CSS and NextUI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider children={children} />
      </body>
    </html>
  );
}
