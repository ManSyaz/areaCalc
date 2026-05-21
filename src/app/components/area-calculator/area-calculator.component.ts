import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AreaService, Shape } from 'src/app/services/area.service';

@Component({
  selector: 'app-area-calculator',
  templateUrl: './area-calculator.component.html',
  styleUrls: ['./area-calculator.component.css']
})
export class AreaCalculatorComponent implements OnInit {
  shapes: Shape[] = [];
  selectedShape: Shape | null = null;
  units = ['cm', 'm', 'in', 'ft'];
  selectedUnit = 'cm';

  length = 0;
  height = 0;
  side = 0;
  radius = 0;

  result: number | null = null;
  copied = false;

  constructor(private areaService: AreaService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.areaService.getShapes().subscribe(shapes => {
      this.shapes = shapes;
      this.selectedShape = shapes[0] || null;
      this.updateResult();
    });
  }

  selectShape(shape: Shape): void {
    this.selectedShape = shape;
    this.length = 0;
    this.height = 0;
    this.side = 0;
    this.radius = 0;
    this.result = null;
  }

  updateResult(): void {
    if (!this.selectedShape || !this.validateInputs()) {
      this.result = null;
      return;
    }

    this.result = this.areaService.calculateArea(
      this.selectedShape.name,
      this.length,
      this.height,
      this.side,
      this.radius
    );
  }

  validateInputs(): boolean {
    if (!this.selectedShape) {
      return false;
    }

    if (this.selectedShape.fields.includes('length') && this.length <= 0) {
      return false;
    }

    if (this.selectedShape.fields.includes('height') && this.height <= 0) {
      return false;
    }

    if (this.selectedShape.fields.includes('side') && this.side <= 0) {
      return false;
    }

    if (this.selectedShape.fields.includes('radius') && this.radius <= 0) {
      return false;
    }

    return true;
  }

  copyResult(): void {
    if (this.result === null) {
      return;
    }

    const value = `${this.result.toFixed(2)} ${this.selectedUnit}²`;
    navigator.clipboard.writeText(value).then(() => {
      this.copied = true;
      window.setTimeout(() => {
        this.copied = false;
      }, 1600);
    });
  }

  getShapeIcon(shapeName: string): SafeHtml {
    let svgContent: string;

    switch (shapeName.toLowerCase()) {
      case 'rectangle':
        svgContent = `<rect x="8" y="14" width="48" height="28" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'triangle':
        svgContent = `<polygon points="32,8 56,48 8,48" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'square':
        svgContent = `<rect x="12" y="12" width="40" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'circle':
        svgContent = `<circle cx="32" cy="28" r="20" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'parallelogram':
        svgContent = `<polygon points="18,44 10,12 46,12 54,44" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'trapezoid':
        svgContent = `<polygon points="14,44 50,44 42,12 22,12" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'rhombus':
        svgContent = `<polygon points="32,8 56,28 32,48 8,28" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'pentagon':
        svgContent = `<polygon points="32,8 56,26 47,50 17,50 8,26" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'hexagon':
        svgContent = `<polygon points="32,8 54,20 54,44 32,56 10,44 10,20" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      case 'ellipse':
        svgContent = `<ellipse cx="32" cy="28" rx="24" ry="16" fill="none" stroke="currentColor" stroke-width="4"/>`;
        break;
      default:
        svgContent = `<text x="32" y="34" text-anchor="middle" font-size="28" fill="currentColor">${shapeName.charAt(0).toUpperCase()}</text>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

}
