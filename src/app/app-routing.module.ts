import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaCalculatorComponent } from './components/area-calculator/area-calculator.component';
import { AddShapeComponent } from './components/add-shape/add-shape.component';

const routes: Routes = [
  { path: 'calculator', component: AreaCalculatorComponent },
  { path: 'add-shape', component: AddShapeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
