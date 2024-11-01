import "./globals.css";
import Navbar from "./components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/FVIps0fbRrSC7t5Ko3J4Dw.webp" />
      </head>
      <body>
        <div className="navbar-container">
          <Navbar />
        </div>
        <div className="content-container">
          {children}
        </div>
      </body>
    </html>
  );
}
