import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DripCheck — Your Smart Wardrobe',
  description: 'Manage your wardrobe and get outfit suggestions for any occasion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen text-gray-900 bg-[#FAFAFA]`}>
        {children}
      </body>
    </html>
  );
}
