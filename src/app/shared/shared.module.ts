import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AboutDialogComponent,
  ],
  exports: [
    AboutDialogComponent,
  ],
  entryComponents: [
    AboutDialogComponent,
  ]
})
export class SharedModule { }
