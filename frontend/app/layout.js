import "./globals.css";

export const metadata = {
  title: "AI Image Analyst",
  description: "Object Detection Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}