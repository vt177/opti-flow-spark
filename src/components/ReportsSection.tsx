import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { BarChart3, ArrowLeft, Package, ShoppingCart, Calendar, TrendingUp, TrendingDown, Users } from 'lucide-react';

type ReportType = 'stock' | 'sales' | 'appointments' | null;

export function ReportsSection() {
  const { setCurrentSection, products, sales, appointments } = useApp();
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'glasses': return 'Óculos de grau';
      case 'sunglasses': return 'Óculos de sol';
      case 'lenses': return 'Lentes';
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const getTotalStock = () => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  const getTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.quantity, 0);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity <= 5);
  };

  const getLastStockUpdate = () => {
    if (products.length === 0) return null;
    return products.reduce((latest, product) => 
      product.createdAt > latest.createdAt ? product : latest
    ).createdAt;
  };

  const getTodaySales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
  };

  const getLast7DaysSales = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sales.filter(sale => new Date(sale.createdAt) >= sevenDaysAgo);
  };

  const getMostSoldProduct = () => {
    const productSales = sales.reduce((acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    const entries = Object.entries(productSales);
    if (entries.length === 0) return null;
    
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
  };

  const getLastSale = () => {
    if (sales.length === 0) return null;
    return sales.reduce((latest, sale) => 
      sale.createdAt > latest.createdAt ? sale : latest
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
      return appointmentDate >= today;
    }).sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === today);
  };

  const getWeekAppointments = () => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today && appointmentDate <= weekFromNow;
    });
  };

  const getLastAppointment = () => {
    if (appointments.length === 0) return null;
    return appointments.reduce((latest, appointment) => 
      appointment.createdAt > latest.createdAt ? appointment : latest
    );
  };

  const reportOptions = [
    {
      id: 'stock' as const,
      title: 'Estoque Atual',
      description: 'Visualizar produtos e quantidades',
      icon: Package,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'sales' as const,
      title: 'Vendas Recentes',
      description: 'Histórico de vendas realizadas',
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'appointments' as const,
      title: 'Consultas Agendadas',
      description: 'Próximas consultas de clientes',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const renderStockReport = () => {
    const lastUpdate = getLastStockUpdate();
    
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total em Estoque</p>
                <p className="text-2xl font-bold text-accent">{getTotalStock()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold text-destructive">{getLowStockProducts().length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-sm font-medium text-foreground">
                  {lastUpdate ? formatDate(lastUpdate.toISOString().split('T')[0]) : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lastUpdate ? lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Products List */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">📦 Detalhes do Estoque</h3>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum produto cadastrado</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="p-4 bg-background rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getProductTypeLabel(product.type)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-semibold ${
                        product.quantity <= 5 ? 'text-destructive' : 'text-primary'
                      }`}>
                        {product.quantity}
                      </span>
                      <p className="text-xs text-muted-foreground">unidades</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderSalesReport = () => {
    const todaySales = getTodaySales();
    const last7DaysSales = getLast7DaysSales();
    const mostSoldProduct = getMostSoldProduct();
    const lastSale = getLastSale();
    
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-2xl font-bold text-accent">{getTotalSales()}</p>
                <p className="text-xs text-muted-foreground">registradas</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas Hoje</p>
                <p className="text-2xl font-bold text-primary">{todaySales.reduce((total, sale) => total + sale.quantity, 0)}</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Últimos 7 Dias</p>
                <p className="text-2xl font-bold text-secondary">{last7DaysSales.reduce((total, sale) => total + sale.quantity, 0)}</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mais Vendido</p>
                <p className="text-sm font-medium text-foreground">
                  {mostSoldProduct ? mostSoldProduct[0] : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mostSoldProduct ? `${mostSoldProduct[1]} unidades` : ''}
                </p>
              </div>
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Last Sale Info */}
        {lastSale && (
          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Última Venda Registrada</p>
                <p className="font-medium">{lastSale.productName} - {lastSale.quantity} unidades</p>
                <p className="text-sm text-muted-foreground">
                  {lastSale.createdAt.toLocaleDateString('pt-BR')} às {lastSale.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-accent" />
            </div>
          </Card>
        )}

        {/* Sales List */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">💰 Todas as Vendas</h3>
          {sales.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma venda registrada</p>
          ) : (
            <div className="space-y-3">
              {sales.slice().reverse().map((sale) => (
                <div key={sale.id} className="p-4 bg-background rounded-lg border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{sale.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {sale.createdAt.toLocaleDateString('pt-BR')} às {sale.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-accent">
                        {sale.quantity}
                      </span>
                      <p className="text-xs text-muted-foreground">vendidas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderAppointmentsReport = () => {
    const upcomingAppointments = getUpcomingAppointments();
    const todayAppointments = getTodayAppointments();
    const weekAppointments = getWeekAppointments();
    const lastAppointment = getLastAppointment();
    
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximas Consultas</p>
                <p className="text-2xl font-bold text-primary">{upcomingAppointments.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultas de Hoje</p>
                <p className="text-2xl font-bold text-accent">{todayAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultas da Semana</p>
                <p className="text-2xl font-bold text-secondary">{weekAppointments.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Última Consulta</p>
                <p className="text-sm font-medium text-foreground">
                  {lastAppointment ? lastAppointment.clientName : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lastAppointment ? formatDate(lastAppointment.date) : ''}
                </p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">📅 Todas as Consultas</h3>
          {upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma consulta agendada</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-background rounded-lg border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.clientName}</h4>
                      <p className="text-sm text-muted-foreground">
                        📅 {formatDate(appointment.date)} às {formatTime(appointment.time)}
                      </p>
                      {appointment.observations && (
                        <p className="text-sm text-muted-foreground mt-1 bg-muted p-2 rounded">
                          {appointment.observations}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => selectedReport ? setSelectedReport(null) : setCurrentSection('welcome')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-primary" />
                Relatórios
              </h1>
              <p className="text-muted-foreground">
                {selectedReport ? 'Visualize os dados detalhados' : 'Selecione o tipo de relatório'}
              </p>
            </div>
          </div>
        </div>

        {!selectedReport ? (
          /* Report Options */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {reportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.id}
                  className="p-6 hover:shadow-soft transition-all duration-300 cursor-pointer bg-gradient-card border-0 hover:scale-105"
                  onClick={() => setSelectedReport(option.id)}
                >
                  <div className="text-center">
                    <div className={`p-4 rounded-lg ${option.color} w-fit mx-auto mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Selected Report */
          <div>
            {selectedReport === 'stock' && renderStockReport()}
            {selectedReport === 'sales' && renderSalesReport()}
            {selectedReport === 'appointments' && renderAppointmentsReport()}
            
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                onClick={() => setCurrentSection('welcome')}
              >
                🔄 Menu Principal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}