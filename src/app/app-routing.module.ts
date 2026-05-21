import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaCalculatorComponent } from './components/area-calculator/area-calculator.component';

const routes: Routes = [
  { path: '', component: AreaCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
