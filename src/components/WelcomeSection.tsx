import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Eye, Package, ShoppingCart, Calendar, BarChart3 } from 'lucide-react';
import opticalHero from '@/assets/optical-hero.jpg';

export function WelcomeSection() {
  const { setCurrentSection } = useApp();

  const menuItems = [
    {
      title: 'Cadastrar Produtos',
      description: 'Gerencie o estoque de óculos e lentes',
      icon: Package,
      section: 'products' as const,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Registrar Vendas',
      description: 'Registre as vendas realizadas',
      icon: ShoppingCart,
      section: 'sales' as const,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Agenda de Consultas',
      description: 'Organize consultas de clientes',
      icon: Calendar,
      section: 'appointments' as const,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Relatórios',
      description: 'Visualize resumos e estatísticas',
      icon: BarChart3,
      section: 'reports' as const,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <Eye className="w-16 h-16 mx-auto mb-4 text-primary-foreground drop-shadow-lg" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
              Sistema de Gestão Ótica – Simples, rápido e eficiente para estoque, vendas e agenda
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto drop-shadow">
              Organize sua ótica com eficiência, reduza erros e aumente a satisfação dos clientes.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-glow">
            <img 
              src={opticalHero} 
              alt="Ótica moderna com óculos elegantes" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            O que deseja fazer hoje?
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha uma das opções abaixo para começar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.section}
                className="p-6 hover:shadow-soft transition-all duration-300 cursor-pointer bg-gradient-card border-0 hover:scale-105"
                onClick={() => setCurrentSection(item.section)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" className="w-full justify-between">
                    Acessar
                    <span className="text-primary">→</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => setCurrentSection('products')}
            className="px-8 py-4 text-lg"
          >
            <Eye className="w-5 h-5 mr-2" />
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}