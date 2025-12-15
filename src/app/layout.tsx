import "@/app/globals.css";
import { Toaster } from 'react-hot-toast';

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>StudyMate</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
