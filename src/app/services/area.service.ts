import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Shape {
  id: number;
  name: string;
  formula: string;
  fields: string[];
  isActive?: boolean | number;
}

interface DbShape {
  id: number;
  name: string;
  formula: string;
  isActive?: boolean | number;
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private apiUrl = 'http://localhost:5293/api/Shapes';

  constructor(private http: HttpClient) { }

  getShapes(): Observable<Shape[]> {
    return this.http.get<DbShape[]>(this.apiUrl).pipe(
      map(shapes => shapes
        .filter(shape => shape.isActive === 1 || shape.isActive === true || shape.isActive === undefined)
        .map(shape => ({
          ...shape,
          fields: this.resolveFields(shape)
        })))
    );
  }

  addShape(name: string, formula: string): Observable<Shape> {
    return this.http.post<Shape>(this.apiUrl, {name, formula}).pipe(
      map(shape => ({
        ...shape,
        fields: this.resolveFields(shape)
      }))
    );
  }

  calculateArea(shapeName: string, length: number, height: number, side: number, radius: number): number {
    switch (shapeName.toLowerCase()) {
      case 'rectangle':
      case 'parallelogram':
        return length * height;
      case 'triangle':
        return (length * height) / 2;
      case 'square':
        return side * side;
      case 'circle':
        return Math.PI * radius * radius;
      default:
        return 0;
    }
  }

  private resolveFields(shape: DbShape): string[] {
    const formula = shape.formula?.toLowerCase() ?? '';
    if (formula.includes('radius')) {
      return ['radius'];
    }
    if (formula.includes('side') || shape.name.toLowerCase().includes('square')) {
      return ['side'];
    }
    if (formula.includes('length') && formula.includes('height')) {
      return ['length', 'height'];
    }
    if (formula.includes('length * length')) {
      return ['side'];
    }
    return ['length', 'height'];
  }
}
