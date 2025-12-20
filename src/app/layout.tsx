import "@/app/globals.css";
import { Toaster } from 'react-hot-toast';
import ClientLayout from "@/components/ClientLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | StudyMate',
    default: 'StudyMate - Your Personal Student Assistant',
  },
  description: 'StudyMate helps you manage your learning journey with personalized roadmaps, course tracking, task management, and progress monitoring. Your complete academic companion.',
  keywords: ['study', 'learning', 'education', 'roadmap', 'courses', 'student assistant', 'academic', 'progress tracking'],
  authors: [{ name: 'StudyMate Team' }],
  creator: 'StudyMate',
  publisher: 'StudyMate',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '--',
    siteName: 'StudyMate',
    title: 'StudyMate - Your Personal Student Assistant',
    description: 'Manage your learning journey with personalized roadmaps and course tracking',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
