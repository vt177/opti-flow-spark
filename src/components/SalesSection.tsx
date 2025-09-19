import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, ArrowLeft, Plus, Check, X, AlertCircle } from 'lucide-react';

export function SalesSection() {
  const { setCurrentSection, products, sales, addSale, setProducts } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: ''
  });
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.quantity) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um produto e informe a quantidade",
        variant: "destructive"
      });
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    const quantity = parseInt(formData.quantity);

    if (!product) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive"
      });
      return;
    }

    if (quantity > product.quantity) {
      toast({
        title: "Erro",
        description: `Estoque insuficiente. Disponível: ${product.quantity} unidades`,
        variant: "destructive"
      });
      return;
    }

    // Add sale
    addSale({
      productId: product.id,
      productName: product.name,
      quantity: quantity
    });

    // Update product stock
    setProducts(prev => prev.map(p => 
      p.id === product.id 
        ? { ...p, quantity: p.quantity - quantity }
        : p
    ));

    toast({
      title: "Venda registrada!",
      description: "Deseja registrar outra venda?",
    });

    setFormData({ productId: '', quantity: '' });
    setShowForm(false);
  };

  const availableProducts = products.filter(p => p.quantity > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentSection('welcome')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3 text-primary" />
                Registro de Vendas
              </h1>
              <p className="text-muted-foreground">
                Registre as vendas realizadas na ótica
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              {showForm ? 'Registrar Nova Venda' : 'Venda Registrada!'}
            </h2>

            {availableProducts.length === 0 && showForm ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg font-semibold mb-2">Nenhum produto disponível</h3>
                <p className="text-muted-foreground mb-6">
                  Cadastre produtos primeiro ou verifique o estoque
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection('products')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Produtos
                </Button>
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product">Produto</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => setFormData({ ...formData, productId: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Estoque: {product.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade vendida</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={formData.productId ? products.find(p => p.id === formData.productId)?.quantity || 0 : 0}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Ex: 2"
                    className="mt-1"
                  />
                  {formData.productId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Máximo: {products.find(p => p.id === formData.productId)?.quantity} unidades
                    </p>
                  )}
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Registrar Venda
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Venda registrada com sucesso!</h3>
                <p className="text-muted-foreground mb-6">
                  Deseja registrar outra venda?
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="success"
                    onClick={() => setShowForm(true)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Sim
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentSection('welcome')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Não
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Sales List */}
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              Vendas Recentes ({sales.length})
            </h2>

            {sales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma venda registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sales.slice().reverse().map((sale) => (
                  <div key={sale.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{sale.productName}</h3>
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
      </div>
    </div>
  );
}