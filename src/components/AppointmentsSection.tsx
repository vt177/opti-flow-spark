import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ArrowLeft, Plus, Check, X, Clock } from 'lucide-react';

export function AppointmentsSection() {
  const { setCurrentSection, appointments, addAppointment } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientName: '',
    date: '',
    time: '',
    observations: ''
  });
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.date || !formData.time) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.date + 'T' + formData.time);
    const now = new Date();
    
    if (selectedDate <= now) {
      toast({
        title: "Erro",
        description: "A data e horário devem ser no futuro",
        variant: "destructive"
      });
      return;
    }

    addAppointment({
      clientName: formData.clientName,
      date: formData.date,
      time: formData.time,
      observations: formData.observations || undefined
    });

    toast({
      title: "Consulta agendada!",
      description: "Deseja agendar outra consulta?",
    });

    setFormData({ clientName: '', date: '', time: '', observations: '' });
    setShowForm(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

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
                <Calendar className="w-8 h-8 mr-3 text-primary" />
                Agenda de Consultas
              </h1>
              <p className="text-muted-foreground">
                Organize os atendimentos aos clientes
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              {showForm ? 'Agendar Nova Consulta' : 'Consulta Agendada!'}
            </h2>

            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome do cliente</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: Maria Silva"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data da consulta</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="time">Horário da consulta</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="observations">Observações (opcional)</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Ex: Primeira consulta, problema de visão..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Consulta agendada com sucesso!</h3>
                <p className="text-muted-foreground mb-6">
                  Deseja agendar outra consulta?
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

          {/* Appointments List */}
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              Consultas Agendadas ({appointments.length})
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma consulta agendada ainda</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {appointments.slice().reverse().map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-foreground">{appointment.clientName}</h3>
                      <div className="flex items-center text-sm text-primary">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(appointment.time)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      📅 {formatDate(appointment.date)}
                    </p>
                    {appointment.observations && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        "{appointment.observations}"
                      </p>
                    )}
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