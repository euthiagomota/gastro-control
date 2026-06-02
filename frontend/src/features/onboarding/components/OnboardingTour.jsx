import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import useOnboarding from '../../../shared/context/useOnboarding';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function OnboardingTour() {
  const {
    isTourOpen,
    currentStep,
    currentStepIndex,
    steps,
    nextStep,
    previousStep,
    completeTour,
    closeTour,
  } = useOnboarding();

  const [targetRect, setTargetRect] = useState(null);
  const [observedActionSatisfied, setObservedActionSatisfied] = useState(false);
  const hasTargetElement = Boolean(targetRect);
  const actionRequirementEnabled = Boolean(isTourOpen && currentStep?.advanceOnSelector);
  const isStepActionSatisfied = !actionRequirementEnabled || observedActionSatisfied;
  const spotlightClicksEnabled = currentStep?.spotlightClicks !== false;

  useEffect(() => {
    if (!actionRequirementEnabled) {
      return undefined;
    }

    const checkStepRequirement = () => {
      const actionTarget = document.querySelector(currentStep.advanceOnSelector);
      setObservedActionSatisfied(Boolean(actionTarget));
    };

    checkStepRequirement();

    const observer = new MutationObserver(checkStepRequirement);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-tour'],
    });

    return () => observer.disconnect();
  }, [actionRequirementEnabled, currentStep]);

  useEffect(() => {
    if (!isTourOpen || !actionRequirementEnabled || !isStepActionSatisfied || currentStepIndex >= steps.length - 1) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      nextStep();
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [
    isTourOpen,
    actionRequirementEnabled,
    isStepActionSatisfied,
    currentStepIndex,
    steps.length,
    nextStep,
  ]);

  useEffect(() => {
    let frameId;

    const updateRect = () => {
      if (!isTourOpen || !currentStep?.selector) {
        setTargetRect(null);
        return;
      }

      const targetElement = document.querySelector(currentStep.selector);
      if (!targetElement) {
        setTargetRect(null);
        return;
      }

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      const rect = targetElement.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    frameId = window.requestAnimationFrame(updateRect);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isTourOpen, currentStep]);

  const popupStyle = useMemo(() => {
    if (!targetRect || window.innerWidth < 768) return null;

    const maxWidth = 360;
    const spacing = 12;

    const preferredLeft = targetRect.left;
    const left = clamp(preferredLeft, 16, window.innerWidth - maxWidth - 16);

    const shouldShowBelow = targetRect.top + targetRect.height + 220 < window.innerHeight;
    const top = shouldShowBelow
      ? targetRect.top + targetRect.height + spacing
      : Math.max(16, targetRect.top - 220 - spacing);

    return {
      top,
      left,
      width: maxWidth,
    };
  }, [targetRect]);

  if (!isTourOpen || !currentStep) return null;

  const isLastStep = currentStepIndex === steps.length - 1;
  // Se o step não tem selector, ele é informativo e pode sempre avançar
  // Se tem selector mas não existe, também funciona como informativo
  // Se tem selector E advanceOnSelector, precisa da ação
  const isInformativeStep = !currentStep.selector;
  const canAdvance = isInformativeStep || !actionRequirementEnabled || (hasTargetElement && isStepActionSatisfied) || (!hasTargetElement && !actionRequirementEnabled);

  const handleNext = () => {
    if (isLastStep) {
      completeTour();
      return;
    }

    nextStep();
  };

  return (
    <div
      className={`fixed inset-0 z-[120] ${spotlightClicksEnabled ? 'pointer-events-none' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial guiado do sistema"
    >
      {targetRect ? (
        <div
          className="pointer-events-none fixed rounded-2xl ring-2 ring-primary-400 transition-all duration-200"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.58)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900/60" />
      )}

      <div
        className={`pointer-events-auto fixed z-[121] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5 ${
          popupStyle ? '' : 'left-3 right-3 bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[360px]'
        }`}
        style={popupStyle || undefined}
      >
        <div className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-2.5 py-1 text-xs font-semibold mb-3">
          <Sparkles size={14} />
          Tutorial guiado
        </div>

        <p className="text-xs text-gray-500 mb-1">Passo {currentStepIndex + 1} de {steps.length}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{currentStep.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{currentStep.description}</p>

        {!isInformativeStep && !hasTargetElement && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-800 font-medium">
              Este elemento nao esta disponivel na tela atual. Voce pode continuar navegando para outras telas ou prosseguir para o proximo passo.
            </p>
          </div>
        )}

        {hasTargetElement && !isStepActionSatisfied && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-800 font-medium">
              {currentStep.actionHint || 'Conclua a acao destacada para liberar o proximo passo.'}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={closeTour}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 px-2"
          >
            Pular
          </button>

          <button
            type="button"
            onClick={previousStep}
            disabled={currentStepIndex === 0}
            className="ml-auto rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold px-3 py-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className="rounded-xl bg-primary-700 text-white text-sm font-semibold px-3 py-2 hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLastStep ? 'Finalizar' : 'Proximo'}
          </button>
        </div>
      </div>
    </div>
  );
}
