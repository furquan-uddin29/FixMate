import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import DatabaseBanner from '@/components/common/DatabaseBanner';

export const metadata = {
  title: 'FixMate – On-Demand Local Technician & Repair Service Platform',
  description: 'Your Home, Our Responsibility. Connect with verified plumbers, electricians, AC technicians, appliance repair workers, and home maintenance professionals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-navy-50/50 text-navy-900 antialiased">
        <AuthProvider>
          <DatabaseBanner />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
