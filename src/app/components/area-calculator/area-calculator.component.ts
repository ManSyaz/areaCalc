import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AreaService, Shape } from '../../services/area.service';

@Component({
  selector: 'app-area-calculator',
  templateUrl: './area-calculator.component.html',
  styleUrls: ['./area-calculator.component.css']
})
export class AreaCalculatorComponent implements OnInit {

  shapes: Shape[] = [];
  selectedShape: Shape | null = null;
  fieldValues: { [key: string]: number } = {};
  selectedUnit: string = 'cm';
  result: number | null = null;
  copied: boolean = false;
  units = ['cm', 'm', 'in', 'ft'];

  constructor(private areaService: AreaService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.areaService.getShapes().subscribe({
      next: (data) => {
        this.shapes = data;
        if (data.length > 0) this.selectShape(data[0]);
      },
      error: (err) => console.error('Failed to load shapes:', err)
    });
  }

  selectShape(shape: Shape): void {
    this.selectedShape = shape;
    this.result = null;
    this.fieldValues = {};
    this.getFormulaFields(shape.formula).forEach(field => {
      this.fieldValues[field] = 0;
    });
  }

  getFormulaFields(formula: string): string[] {
    const matches = formula.match(/\b[a-zA-Z_][a-zA-Z_0-9]*\b/g) || [];
    const seen = new Set<string>();
    return matches.filter(token => {
      if (seen.has(token)) return false;
      seen.add(token);
      return true;
    });
  }

  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      length: 'Length',
      height: 'Height',
      a: 'A (parallel side 1)',
      b: 'B (parallel side 2)',
      h: 'Height (h)',
      r: 'Radius',
      base: 'Base',
      width: 'Width',
      side: 'Side',
      d1: 'Diagonal 1',
      d2: 'Diagonal 2'
    };
    return labels[field] || field.toUpperCase();
  }

  updateResult(): void {
    if (!this.selectedShape) return;

    try {
      let expression = this.selectedShape.formula;
      const fields = this.getFormulaFields(this.selectedShape.formula);

      fields.forEach(field => {
        const value = this.fieldValues[field] ?? 0;
        expression = expression.replace(
          new RegExp(`\\b${field}\\b`, 'g'),
          value.toString()
        );
      });

      this.result = Function(`"use strict"; return (${expression})`)();
    } catch (e) {
      console.error('Formula error:', e);
      this.result = null;
    }
  }

  // Keep calculateArea() as an alias if your button still uses it
  calculateArea(): void {
    this.updateResult();
  }

  copyResult(): void {
    if (this.result === null) return;
    navigator.clipboard.writeText(
      `${this.result.toFixed(2)} ${this.selectedUnit}²`
    );
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }

  compareShapes(s1: Shape, s2: Shape): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
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
      default:
        svgContent = `<text x="32" y="34" text-anchor="middle" font-size="28" fill="currentColor">${shapeName.charAt(0).toUpperCase()}</text>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }
}