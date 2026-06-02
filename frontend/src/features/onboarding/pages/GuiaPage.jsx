import { BookOpenCheck, Lightbulb, Map, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../shared/ui/Card';
import Button from '../../../shared/ui/Button';
import useOnboarding from '../../../shared/context/useOnboarding';
import { DEMANDA_TOUR_ID, demandaSteps } from '../constants/demandaSteps';

const sections = [
  {
    title: 'Demanda',
    what: 'Demanda e a etapa onde voce registra a previsao de vendas por prato, dia a dia.',
    purpose: 'Serve para transformar intuicao em planejamento operacional baseado em numero.',
    when: 'Use no inicio do turno, na abertura da semana ou sempre que houver mudanca no volume esperado.',
    next: 'Depois de revisar os dados, siga para Cardapio e Calculo para validar custos e necessidades de insumo.',
    route: '/admin/demanda',
  },
  {
    title: 'Cardapio',
    what: 'Cardapio mostra quais pratos estao ativos e em quais categorias eles estao organizados.',
    purpose: 'Ajuda a priorizar itens de maior giro e manter foco no mix mais rentavel.',
    when: 'Use antes de fechar a demanda final e sempre que houver alteracao de menu ou promocao.',
    next: 'Com o cardapio validado, avance para Fichas Tecnicas.',
    route: '/admin/cardapio',
  },
  {
    title: 'Fichas Tecnicas',
    what: 'Fichas Tecnicas definem os ingredientes de cada prato, quantidade por porcao e custo.',
    purpose: 'Garantem padrao de preparo e tornam o calculo de ingredientes confiavel.',
    when: 'Use sempre que criar ou ajustar um prato no Cardapio.',
    next: 'Depois de ajustar fichas, siga para Calculo para transformar pratos em necessidade de ingredientes.',
    route: '/admin/fichas-tecnicas',
  },
  {
    title: 'Calculo',
    what: 'Calculo junta Demanda e Fichas Tecnicas para mostrar quanto de cada ingrediente sera necessario.',
    purpose: 'Explica de onde vem cada numero e permite ajuste de margem e disponibilidade.',
    when: 'Use depois de revisar Demanda e Fichas Tecnicas.',
    next: 'Com o calculo validado, siga para Estoque para comparar necessario e disponivel.',
    route: '/admin/calculo',
  },
  {
    title: 'Estoque',
    what: 'Estoque concentra ingredientes, niveis minimos e alertas de itens criticos ou vencimento.',
    purpose: 'Evita ruptura, desperdicio e compra emergencial fora de planejamento.',
    when: 'Use apos atualizar demanda e antes de liberar producao para garantir disponibilidade.',
    next: 'Com o estoque conferido, finalize em Producao para executar o plano com seguranca.',
    route: '/admin/estoque',
  },
  {
    title: 'Producao',
    what: 'Producao e o plano de execucao final dos pratos que realmente precisam ser preparados.',
    purpose: 'Conecta previsao e disponibilidade de insumos para orientar a equipe de cozinha.',
    when: 'Use no momento de iniciar o preparo e ao longo do turno para acompanhar status.',
    next: 'Ao fim do dia, retorne para Demanda e compare previsto vs real para melhorar a previsao seguinte.',
    route: '/admin/producao',
  },
];

const quickTips = [
  'Comece sempre pela tela de Demanda para alimentar o restante do fluxo.',
  'Atualize as Fichas Tecnicas antes de confiar no Calculo.',
  'Use os indicadores de saldo no Estoque para priorizar compras.',
  'Revise o Guia sempre que houver novos colaboradores na operacao.',
];

export default function GuiaPage() {
  const navigate = useNavigate();
  const {
    startTour,
    resumeTour,
    resetTour,
    canResumeTour,
    completedTours,
  } = useOnboarding();

  const isDemandaTourCompleted = Boolean(completedTours[DEMANDA_TOUR_ID]);
  const canResumeDemandaTour = canResumeTour(DEMANDA_TOUR_ID);

  const handleStartTour = () => {
    startTour(DEMANDA_TOUR_ID, demandaSteps, { force: true, startFrom: 'start' });
  };

  const handleResumeTour = () => {
    resumeTour(DEMANDA_TOUR_ID, demandaSteps);
  };

  const handleRestartTour = () => {
    resetTour(DEMANDA_TOUR_ID);
    startTour(DEMANDA_TOUR_ID, demandaSteps, { force: true, startFrom: 'start' });
  };

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1 text-xs font-semibold mb-3">
          <BookOpenCheck size={14} />
          Guia do usuario
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Como usar o GastroControl</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
          Este guia foi pensado para quem esta chegando agora. Cada secao explica claramente o que voce esta vendo,
          quando usar e qual e o proximo passo dentro do fluxo operacional.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" className="w-full sm:w-auto" onClick={handleStartTour}>
            <PlayCircle size={15} />
            Iniciar tutorial
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleResumeTour}
            disabled={!canResumeDemandaTour}
          >
            Continuar de onde parei
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => navigate('/admin/demanda')}>
            <Map size={15} />
            Ir para Demanda
          </Button>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={handleRestartTour}>
            Reiniciar tutorial da Demanda
          </Button>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Status do tutorial de Demanda: {isDemandaTourCompleted ? 'concluido' : canResumeDemandaTour ? 'em andamento' : 'nao iniciado'}.
        </p>
      </header>

      <Card className="rounded-3xl !p-5 border border-primary-100 bg-primary-50/50">
        <h2 className="text-base font-bold text-primary-900 mb-1">Ordem recomendada de uso</h2>
        <p className="text-sm text-primary-800 leading-relaxed">
          Demanda {'->'} Cardapio {'->'} Fichas Tecnicas {'->'} Calculo {'->'} Estoque {'->'} Producao.
          Seguir essa ordem reduz erros de compra e melhora previsibilidade da operacao.
        </p>
      </Card>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="rounded-3xl !p-5 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-900">O que e:</span> {section.what}</p>
              <p><span className="font-semibold text-gray-900">Para que serve:</span> {section.purpose}</p>
              <p><span className="font-semibold text-gray-900">Quando usar:</span> {section.when}</p>
              <p><span className="font-semibold text-gray-900">O que acontece depois:</span> {section.next}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full sm:w-auto"
              onClick={() => navigate(section.route)}
            >
              Abrir {section.title}
            </Button>
          </Card>
        ))}
      </section>

      <Card className="rounded-3xl !p-5 border border-amber-200 bg-amber-50">
        <div className="flex items-center gap-2 mb-2 text-amber-800">
          <Lightbulb size={16} />
          <h3 className="text-sm font-semibold">Dicas rapidas de operacao</h3>
        </div>
        <ul className="space-y-2 text-sm text-amber-900">
          {quickTips.map((tip) => (
            <li key={tip} className="leading-relaxed">- {tip}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
