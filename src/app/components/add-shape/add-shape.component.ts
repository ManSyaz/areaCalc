import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AreaService, Shape } from 'src/app/services/area.service';

@Component({
  selector: 'app-add-shape',
  templateUrl: './add-shape.component.html',
  styleUrls: ['./add-shape.component.css']
})
export class AddShapeComponent {

  name: string = '';
  formula: string = '';
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private areaService: AreaService, private router: Router) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.name.trim() || !this.formula.trim()) {
      this.errorMessage = 'Both Name and Formula are required.';
      return;
    }

    this.isSubmitting = true;

    this.areaService.addShape(this.name.trim(), this.formula.trim()).subscribe({
      next: (newShape) => {
        this.successMessage = `"${newShape.name}" added successfully!`;
        this.name = '';
        this.formula = '';
        this.isSubmitting = false;

        // Redirect to calculator after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/calculator']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Failed to add shape. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}