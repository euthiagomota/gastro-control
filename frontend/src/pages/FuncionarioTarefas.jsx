import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function FuncionarioTarefas() {
  const tarefasData = {
    pendentes: [
      { id: 1, titulo: 'Conferir estoque de frios', prioridade: 'alta', horario: '12:00', responsavel: 'João' },
      { id: 2, titulo: 'Atualizar validade dos produtos', prioridade: 'media', horario: '14:00', responsavel: 'Carlos' },
      { id: 3, titulo: 'Limpar estação de preparo', prioridade: 'baixa', horario: '16:00', responsavel: 'João' },
    ],
    emAndamento: [
      { id: 4, titulo: 'Separar ingredientes do almoço', prioridade: 'alta', horario: '11:00', responsavel: 'João' },
      { id: 5, titulo: 'Preparar molhos do dia', prioridade: 'media', horario: '11:30', responsavel: 'Ana' },
    ],
    concluidas: [
      { id: 6, titulo: 'Lavar utensílios da manhã', prioridade: 'baixa', horario: '09:00', responsavel: 'João' },
      { id: 7, titulo: 'Receber entrega de frango', prioridade: 'alta', horario: '08:30', responsavel: 'Carlos' },
    ],
  };

  const [expandedTarefa, setExpandedTarefa] = useState(null);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'media': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'baixa': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const sections = [
    {
      key: 'pendentes',
      title: 'Pendentes',
      data: tarefasData.pendentes,
      borderColor: 'border-l-amber-400',
      indicator: (
        <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0" />
      ),
      actions: (id) => (
        <>
          <Button variant="primary" size="xs">Iniciar</Button>
          <Button variant="outline" size="xs">Observação</Button>
        </>
      ),
    },
    {
      key: 'emAndamento',
      title: 'Em andamento',
      data: tarefasData.emAndamento,
      borderColor: 'border-l-blue-400',
      indicator: (
        <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex-shrink-0 animate-pulse" />
      ),
      actions: (id) => (
        <>
          <Button variant="primary" size="xs">Concluir</Button>
          <Button variant="outline" size="xs">Observação</Button>
        </>
      ),
    },
    {
      key: 'concluidas',
      title: 'Concluídas',
      data: tarefasData.concluidas,
      borderColor: 'border-l-green-400',
      indicator: (
        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">✓</span>
        </div>
      ),
      actions: (id) => (
        <Button variant="outline" size="xs">Observação</Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Tarefas</h1>
        <p className="text-sm text-gray-500">Gerencie suas tarefas do dia</p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <Card key={section.key} className="!p-0 overflow-hidden">
          {/* Section Header */}
          <div className={`px-5 py-4 border-b border-gray-200 border-l-4 ${section.borderColor} flex items-center justify-between`}>
            <h2 className="text-base font-bold text-gray-900">
              {section.title}
            </h2>
            <span className="text-sm font-semibold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
              {section.data.length}
            </span>
          </div>

          {/* Tasks */}
          <div className="divide-y divide-gray-100">
            {section.data.map((tarefa) => {
              const isExpanded = expandedTarefa === tarefa.id;
              return (
                <div key={tarefa.id}>
                  <button
                    onClick={() => setExpandedTarefa(isExpanded ? null : tarefa.id)}
                    className={`w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors ${
                      section.key === 'concluidas' ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {section.indicator}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1.5">
                          <p className={`text-sm font-medium flex-1 ${
                            section.key === 'concluidas' ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}>
                            {tarefa.titulo}
                          </p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 ${getPriorityStyle(tarefa.prioridade)}`}>
                            {tarefa.prioridade}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">⏰ {tarefa.horario}</span>
                          <span className="flex items-center gap-1">👤 {tarefa.responsavel}</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 pt-3">
                      {section.actions(tarefa.id)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Help */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">Dica de uso</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Clique em uma tarefa para expandir e ver opções de ação. Você pode iniciar, concluir ou adicionar observações.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
