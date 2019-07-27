import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// compornent
import { TopComponent } from './top/top.component';
import { FormAndValidationComponent } from './form-and-validation/form-and-validation.component';
import { FileComponent } from './file/file.component';
import { GeolocationComponent } from './geolocation/geolocation.component';

const routes: Routes = [
  {
    path: 'top',
    component: TopComponent,
  },
  {
    path: 'form-validation',
    component: FormAndValidationComponent,
  },
  {
    path: 'file',
    component: FileComponent,
  },
  {
    path: 'geolocation',
    component: GeolocationComponent,
  },
  {
    path: '**',
    redirectTo: 'top',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
