import { AppProvider, useApp } from '@/context/AppContext';
import { WelcomeSection } from '@/components/WelcomeSection';
import { ProductsSection } from '@/components/ProductsSection';
import { SalesSection } from '@/components/SalesSection';
import { AppointmentsSection } from '@/components/AppointmentsSection';
import { ReportsSection } from '@/components/ReportsSection';

function AppContent() {
  const { currentSection } = useApp();

  switch (currentSection) {
    case 'welcome':
      return <WelcomeSection />;
    case 'products':
      return <ProductsSection />;
    case 'sales':
      return <SalesSection />;
    case 'appointments':
      return <AppointmentsSection />;
    case 'reports':
      return <ReportsSection />;
    default:
      return <WelcomeSection />;
  }
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
