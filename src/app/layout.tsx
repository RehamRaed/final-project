import "@/app/globals.css";

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
      </body>
    </html>
  );
}
