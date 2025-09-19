import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Package, ArrowLeft, Plus, Check, X } from 'lucide-react';

export function ProductsSection() {
  const { setCurrentSection, products, addProduct } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'glasses' | 'sunglasses' | 'lenses' | '',
    quantity: ''
  });
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.quantity) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    addProduct({
      name: formData.name,
      type: formData.type as 'glasses' | 'sunglasses' | 'lenses',
      quantity: parseInt(formData.quantity)
    });

    toast({
      title: "Produto cadastrado!",
      description: "Deseja adicionar outro produto?",
    });

    setFormData({ name: '', type: '', quantity: '' });
    setShowForm(false);
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'glasses': return 'Óculos de grau';
      case 'sunglasses': return 'Óculos de sol';
      case 'lenses': return 'Lentes';
      default: return type;
    }
  };

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
                <Package className="w-8 h-8 mr-3 text-primary" />
                Cadastro de Produtos
              </h1>
              <p className="text-muted-foreground">
                Gerencie o estoque de produtos da sua ótica
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              {showForm ? 'Cadastrar Novo Produto' : 'Produto Cadastrado!'}
            </h2>

            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Óculos Ray-Ban Classic"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo do produto</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="glasses">Óculos de grau</SelectItem>
                      <SelectItem value="sunglasses">Óculos de sol</SelectItem>
                      <SelectItem value="lenses">Lentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade em estoque</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Ex: 10"
                    className="mt-1"
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Salvar Produto
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Produto cadastrado com sucesso!</h3>
                <p className="text-muted-foreground mb-6">
                  Deseja adicionar outro produto?
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

          {/* Products List */}
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              Produtos Cadastrados ({products.length})
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto cadastrado ainda</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getProductTypeLabel(product.type)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-primary">
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
      </div>
    </div>
  );
}