import { afterNextRender, computed, DestroyRef, effect, ElementRef, inject, Signal, signal } from '@angular/core';

export function criarContagemAnimada(
  elemento: Signal<ElementRef<HTMLElement>>,
  total: () => number | null,
): Signal<number | null> {
  const destroyRef = inject(DestroyRef);
  const visivel = signal(false);
  const concluida = signal(false);
  const parcial = signal(0);
  let observador: IntersectionObserver | undefined;
  let iniciou = false;

  afterNextRender(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      concluida.set(true);
      return;
    }

    observador = new IntersectionObserver(([entrada]) => {
      if (!iniciou) visivel.set(!!entrada?.isIntersecting && entrada.intersectionRatio >= 0.5);
    }, { threshold: 0.5 });

    observador.observe(elemento().nativeElement);
    destroyRef.onDestroy(() => observador?.disconnect());
  });

  effect(onCleanup => {
    const alvo = total();
    if (!visivel() || alvo === null) return;

    observador?.disconnect();
    if (iniciou || alvo === 0) {
      iniciou = true;
      concluida.set(true);
      return;
    }
    iniciou = true;

    const inicio = performance.now();
    const duracao = 750;
    const intervalo = 40;
    let ultimaAtualizacao = inicio - intervalo;
    let quadro: number;

    const atualizar = (agora: number): void => {
      const progresso = Math.max(0, (agora - inicio) / duracao);
      if (progresso >= 1) {
        concluida.set(true);
        return;
      }

      if (agora - ultimaAtualizacao >= intervalo) {
        const variacao = Math.random() * Math.min(18, alvo * 0.05);
        const estimativa = Math.floor(alvo * (1 - (1 - progresso) ** 2) + variacao);
        parcial.update(valor => Math.min(alvo - 1, Math.max(valor, estimativa)));
        ultimaAtualizacao = agora;
      }

      quadro = requestAnimationFrame(atualizar);
    };

    quadro = requestAnimationFrame(atualizar);
    onCleanup(() => cancelAnimationFrame(quadro));
  });

  return computed(() => {
    const alvo = total();
    return alvo === null || concluida() ? alvo : parcial();
  });
}
