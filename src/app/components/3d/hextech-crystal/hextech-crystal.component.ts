import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-hextech-crystal',
  template: `<canvas #canvas class="hextech-canvas"></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hextech-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class HextechCrystalComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private crystal!: THREE.Group;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    this.initThree();
    this.createCrystal();
    this.animate();
    this.setupResize();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Soft ambient light (LoL blue-ish)
    const ambientLight = new THREE.AmbientLight(0x3a5f8a, 0.6);
    this.scene.add(ambientLight);

    // Main directional light (gold)
    const mainLight = new THREE.DirectionalLight(0xC8AA6E, 1.1);
    mainLight.position.set(5, 8, 5);
    this.scene.add(mainLight);

    // Rim light (blue)
    const rimLight = new THREE.DirectionalLight(0x4A90E2, 0.7);
    rimLight.position.set(-6, -3, -4);
    this.scene.add(rimLight);
  }

  private createCrystal(): void {
    this.crystal = new THREE.Group();

    // Main crystal body - Icosahedron (very LoL / Hextech feeling)
    const geometry = new THREE.IcosahedronGeometry(1.6, 0);

    // Glowing material
    const material = new THREE.MeshPhongMaterial({
      color: 0xC8AA6E,
      emissive: 0x2a2118,
      shininess: 85,
      specular: 0xF0E6D2,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
    });

    const mainCrystal = new THREE.Mesh(geometry, material);
    this.crystal.add(mainCrystal);

    // Inner glowing core
    const coreGeometry = new THREE.IcosahedronGeometry(0.85, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x4A90E2,
      transparent: true,
      opacity: 0.25,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    this.crystal.add(core);

    // Golden edges / wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xF0E6D2, 
      transparent: true, 
      opacity: 0.65 
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    this.crystal.add(wireframe);

    // Small orbiting hex fragments
    for (let i = 0; i < 5; i++) {
      const fragment = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 0),
        new THREE.MeshPhongMaterial({
          color: i % 2 === 0 ? 0xC8AA6E : 0x4A90E2,
          emissive: 0x111111,
          shininess: 60
        })
      );

      const angle = (i / 5) * Math.PI * 2;
      const radius = 2.8;
      fragment.position.x = Math.cos(angle) * radius;
      fragment.position.z = Math.sin(angle) * radius * 0.6;
      fragment.position.y = (Math.random() - 0.5) * 1.2;
      fragment.userData = { 
        angle, 
        radius, 
        speed: 0.3 + Math.random() * 0.4,
        yOffset: fragment.position.y 
      };
      this.crystal.add(fragment);
    }

    this.scene.add(this.crystal);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (!this.crystal) return;

    // Gentle rotation
    this.crystal.rotation.y += 0.0028;
    this.crystal.rotation.x = Math.sin(Date.now() / 8000) * 0.08;

    // Animate orbiting fragments
    this.crystal.children.forEach((child, index) => {
      const data = child.userData as any;
      if (data && data.speed) {
        data.angle += data.speed * 0.0035;

        child.position.x = Math.cos(data.angle) * data.radius;
        child.position.z = Math.sin(data.angle) * data.radius * 0.55;
        child.position.y = data.yOffset + Math.sin(Date.now() / 900 + index) * 0.25;

        child.rotation.x += 0.015;
        child.rotation.y += 0.022;
      }
    });

    this.renderer.render(this.scene, this.camera);
  };

  private setupResize(): void {
    const canvas = this.canvasRef.nativeElement;

    const updateSize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width && height) {
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    };

    // Initial size
    setTimeout(updateSize, 50);

    // Responsive
    this.resizeObserver = new ResizeObserver(() => updateSize());
    this.resizeObserver.observe(canvas.parentElement || canvas);
  }
}
