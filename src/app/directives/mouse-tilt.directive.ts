import { Directive, ElementRef, HostListener, OnDestroy, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appMouseTilt]'
})
export class MouseTiltDirective implements AfterViewInit, OnDestroy {

  @Input() tiltMax: number = 12;           // Máximo grados de inclinación
  @Input() scale: number = 1.03;           // Escala al hacer hover
  @Input() speed: number = 400;            // Velocidad de transición (ms)

  private element: HTMLElement;
  private prefersReducedMotion = false;
  private isActive = true;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.checkReducedMotion();
    this.setupStyles();
  }

  private checkReducedMotion(): void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;

    // Escuchar cambios en la preferencia del usuario
    mediaQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.resetTransform();
      }
    });
  }

  private setupStyles(): void {
    this.element.style.transition = `transform ${this.speed}ms cubic-bezier(0.23, 1.0, 0.32, 1)`;
    this.element.style.willChange = 'transform';
    this.element.style.transformStyle = 'preserve-3d';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isActive || this.prefersReducedMotion) return;

    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    // Calcular rotación
    const rotateX = (-mouseY / (rect.height / 2)) * this.tiltMax;
    const rotateY = (mouseX / (rect.width / 2)) * this.tiltMax;

    this.element.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${this.scale})
    `;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.resetTransform();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.prefersReducedMotion) {
      this.isActive = false;
    }
  }

  private resetTransform(): void {
    this.element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  }

  ngOnDestroy(): void {
    this.resetTransform();
  }
}
