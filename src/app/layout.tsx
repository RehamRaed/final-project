import '@/app/globals.css';
import { AuthProvider } from '@/components/SessionProvider';

export const metadata = {
    title: 'Final Project App',
    description: 'Roadmap selection and user authentication project.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}