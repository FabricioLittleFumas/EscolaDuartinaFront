import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from '../auth-service';
import { API_BASE_URL } from '../service/api-base-url';

interface Pagina { numero: number; texto: string; }
interface Documento { nome: string; totalPaginas: number; paginas: Pagina[]; }
interface Trecho { texto: string; pagina: number; }

@Component({
  selector: 'app-pdf-leitor',
  imports: [FormsModule],
  templateUrl: './pdf-leitor.html',
  styleUrl: './pdf-leitor.css',
})
export class PdfLeitor implements OnDestroy {
  readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  readonly disponivel = typeof Audio !== 'undefined';
  readonly gerandoAudio = signal(false);
  private audio?: HTMLAudioElement;
  private audioUrl?: string;
  private readonly audios = new Map<number, Promise<Blob>>();
  readonly documento = signal<Documento | null>(null);
  readonly vozes = signal([
    { voiceURI: 'br-dora', name: 'Dora · Português brasileiro', lang: 'pt-BR' },
    { voiceURI: 'br-alex', name: 'Alex · Português brasileiro', lang: 'pt-BR' },
    { voiceURI: 'br-santa', name: 'Santa · Português brasileiro', lang: 'pt-BR' },
  ]);
  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly estado = signal<'parado' | 'lendo' | 'pausado' | 'concluido'>('parado');
  readonly indice = signal(0);
  readonly pagina = signal(1);
  readonly trechos = signal<Trecho[]>([]);
  voz = 'br-dora';
  velocidade = 1;
  pausa = 450;
  private geracao = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private upload?: Subscription;
  private authSubscription?: Subscription;

  constructor() {
    this.authSubscription = this.auth.authState$.subscribe(() => {
      if (!this.auth.isLoggedIn()) {
        this.parar();
        this.upload?.unsubscribe();
        this.carregando.set(false);
        this.documento.set(null);
        this.trechos.set([]);
      }
    });
  }

  enviar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.carregando()) return;
    this.erro.set('');
    if (!this.auth.isLoggedIn()) { this.erro.set('Entre na sua conta para enviar um PDF.'); return; }
    if (!file.name.toLowerCase().endsWith('.pdf') || file.size === 0 || file.size > 25 * 1024 * 1024) {
      this.erro.set('Selecione um PDF de até 25 MB.'); return;
    }
    this.parar();
    this.documento.set(null);
    this.trechos.set([]);
    this.carregando.set(true);
    const form = new FormData();
    form.append('arquivo', file);
    this.upload = this.http.post<Documento>(`${API_BASE_URL}/leitura-pdf`, form).subscribe({
      next: documento => {
        this.documento.set(documento);
        this.trechos.set(documento.paginas.flatMap(pagina => this.dividir(pagina.texto)
          .map(texto => ({ texto, pagina: pagina.numero }))));
        this.pagina.set(this.trechos()[0]?.pagina ?? 1);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.erro.set(error.error?.message ?? (error.status === 0
          ? 'Não foi possível conectar ao servidor.' : 'Falha no envio do PDF. Tente novamente.'));
      },
    });
  }

  private dividir(texto: string): string[] {
    const limpo = texto.replace(/\u00ad/g, '').replace(/(\p{L})-\r?\n(?=\p{Ll})/gu, '$1');
    const segmentador = new Intl.Segmenter('pt', { granularity: 'sentence' });
    const resultado: string[] = [];
    for (const paragrafo of limpo.split(/\r?\n\s*\r?\n/)) {
      let trecho = '';
      for (const { segment } of segmentador.segment(paragrafo.replace(/\s+/g, ' ').trim())) {
        const frase = segment.trim();
        if (trecho && trecho.length + frase.length > 320) {
          resultado.push(trecho);
          trecho = '';
        }
        // Long sentences are split at whitespace without dropping words.
        let restante = frase;
        while (restante.length > 420) {
          if (trecho) { resultado.push(trecho); trecho = ''; }
          const prefixo = restante.slice(0, 320);
          const clausulas = [...prefixo.matchAll(/[,;:]\s/g)];
          const ultima = clausulas.at(-1);
          const corte = ultima && ultima.index >= 140 ? ultima.index + 1 : prefixo.lastIndexOf(' ');
          const limite = corte > 0 ? corte : 320;
          resultado.push(restante.slice(0, limite).trim());
          restante = restante.slice(limite).trim();
        }
        trecho += (trecho ? ' ' : '') + restante;
      }
      if (trecho.trim()) resultado.push(trecho.trim() + '\n\n');
    }
    return resultado;
  }

  async testarVoz(): Promise<void> {
    if (!this.voz || !this.auth.isLoggedIn()) return;
    this.parar(false);
    const geracao = this.geracao;
    this.erro.set('');
    this.gerandoAudio.set(true);
    try {
      const blob = await this.sintetizar('Olá! Vamos descobrir novas ideias? Escolha seu documento e acompanhe a leitura no seu ritmo.');
      if (geracao !== this.geracao) return;
      this.gerandoAudio.set(false);
      this.criarAudio(blob);
      await this.audio!.play();
    } catch (error) { this.falhaAudio(error, geracao); }
  }

  reproduzir(): void {
    if (!this.voz || !this.auth.isLoggedIn() || !this.trechos().length) return;
    this.erro.set('');
    if (this.estado() === 'pausado') {
      this.estado.set('lendo');
      if (this.gerandoAudio()) return;
      if (this.audio && !this.audio.ended) {
        const geracao = this.geracao;
        this.audio.play().catch(error => this.falhaAudio(error, geracao));
      } else this.falar(this.geracao);
      return;
    }
    this.parar(false);
    if (this.indice() >= this.trechos().length) this.indice.set(0);
    this.estado.set('lendo');
    this.falar(this.geracao);
  }

  private sintetizar(texto: string): Promise<Blob> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/leitura-pdf/voz`,
      { texto: texto.trim(), voz: this.voz }, { responseType: 'blob' }));
  }

  private preparar(indice: number): Promise<Blob> {
    let pedido = this.audios.get(indice);
    if (!pedido) {
      pedido = this.sintetizar(this.trechos()[indice].texto);
      this.audios.set(indice, pedido);
      // Report prefetch failures when the segment is played.
      void pedido.catch(() => {});
    }
    return pedido;
  }

  private criarAudio(blob: Blob): void {
    this.audio?.pause();
    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
    this.audioUrl = URL.createObjectURL(blob);
    this.audio = new Audio(this.audioUrl);
    this.audio.playbackRate = this.velocidade;
    this.audio.preservesPitch = true;
  }

  private async falar(geracao: number): Promise<void> {
    if (geracao !== this.geracao || this.estado() !== 'lendo') return;
    if (!this.auth.isLoggedIn()) { this.parar(); return; }
    const trecho = this.trechos()[this.indice()];
    if (!trecho) { this.estado.set('concluido'); return; }
    this.pagina.set(trecho.pagina);
    this.gerandoAudio.set(true);
    try {
      const blob = await this.preparar(this.indice());
      if (geracao !== this.geracao) return;
      this.gerandoAudio.set(false);
      if (this.estado() !== 'lendo') return;
      this.criarAudio(blob);
      this.audio!.onended = () => {
        if (geracao !== this.geracao) return;
        this.audios.delete(this.indice());
        this.indice.update(indice => indice + 1);
        if (this.indice() >= this.trechos().length) { this.estado.set('concluido'); return; }
        const proximo = this.trechos()[this.indice()];
        const fimParagrafo = trecho.texto.endsWith('\n\n') || proximo.pagina !== trecho.pagina;
        if (this.estado() === 'lendo') {
          this.timer = setTimeout(() => this.falar(geracao), fimParagrafo ? this.pausa : 0);
        }
      };
      this.audio!.onerror = () => this.falhaAudio(new Error('Áudio inválido'), geracao);
      await this.audio!.play();
      if (this.indice() + 1 < this.trechos().length) void this.preparar(this.indice() + 1);
    } catch (error) { this.falhaAudio(error, geracao); }
  }

  private async falhaAudio(error: unknown, geracao: number): Promise<void> {
    if (geracao !== this.geracao) return;
    this.parar(false);
    let mensagem = 'Não foi possível gerar ou reproduzir a voz neural. Tente novamente.';
    if (error instanceof HttpErrorResponse && error.error instanceof Blob) {
      try { mensagem = JSON.parse(await error.error.text()).message ?? mensagem; } catch {}
    }
    this.erro.set(mensagem);
  }

  pausar(): void {
    clearTimeout(this.timer);
    this.estado.set('pausado');
    this.audio?.pause();
  }

  parar(reiniciar = true): void {
    this.geracao++;
    clearTimeout(this.timer);
    this.audio?.pause();
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.audio = undefined;
    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
    this.audioUrl = undefined;
    this.audios.clear();
    this.gerandoAudio.set(false);
    this.estado.set('parado');
    if (reiniciar) {
      this.indice.set(0);
      this.pagina.set(this.trechos()[0]?.pagina ?? 1);
    }
  }

  irPagina(numero: number): void {
    this.parar(false);
    const indice = this.trechos().findIndex(trecho => trecho.pagina >= numero);
    this.indice.set(indice < 0 ? this.trechos().length : indice);
    this.pagina.set(numero);
  }

  get progresso(): number {
    return this.trechos().length ? Math.round(this.indice() / this.trechos().length * 100) : 0;
  }

  get textoPagina(): string {
    return this.documento()?.paginas.find(pagina => pagina.numero === this.pagina())?.texto ?? '';
  }

  ngOnDestroy(): void {
    this.parar();
    this.upload?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
