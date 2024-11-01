import "../globals.css";
import AuthNavbar from "../components/auth/authnavbar";

export default function RootLayout({ children }) {
  return (
    <main className="flex flex-col justify-between min-h-screen bg-customBackground">
      <AuthNavbar />
      <div className="flex-1  bg-black">{children}</div>
    </main>
  );
}
