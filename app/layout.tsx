import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { 
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Management System",
  description: "Event Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <div
              className="shadow-xl flex flex-col mx-auto sm:w-[40%] xl:w-[20%] mt-[10%] p-5"
            >
              <h1 className="text-center text-2xl font-bold my-3">Welcome to EMS</h1>
              <div className="cursor-pointer rounded w-[50%] text-white bg-blue-500  hover:bg-blue-400 p-3 mx-auto">
                <SignInButton />
              </div>
              <div className="cursor-pointer rounded w-[50%] text-white bg-blue-500 hover:bg-blue-400 p-3 mx-auto mt-2">
                <SignUpButton />
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <nav className="flex justify-between p-2">
              <div className="ml-5 text-lg">
                <h1>Event Management System</h1>
              </div>
              <div className="flex mr-5">
                <UserButton />
              </div>
            </nav>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
