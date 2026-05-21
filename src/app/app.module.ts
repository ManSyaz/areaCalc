import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AreaCalculatorComponent } from './components/area-calculator/area-calculator.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddShapeComponent } from './components/add-shape/add-shape.component';

import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    AreaCalculatorComponent,
    AddShapeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
