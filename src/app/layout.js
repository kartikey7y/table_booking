import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weights: ["100", "400", "700", "900"], // Adjust based on your needs
  styles: ["normal", "italic"], // Optional: Include italic if required
});

export const metadata = {
  title: "Booking for table",
  description: "baooking for table in resturant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
