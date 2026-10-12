import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Capsul Space — Your Smart Wardrobe Sanctuary',
  description: 'Curate your wardrobe, discover personalized outfit combinations, and master capsule dressing.',
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
