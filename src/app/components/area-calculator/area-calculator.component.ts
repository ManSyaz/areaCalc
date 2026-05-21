import { Component, OnInit } from '@angular/core';
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

  constructor(private areaService: AreaService) {}

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
}
