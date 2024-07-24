import {Routes} from '@angular/router';
import {InventoryPageComponent} from "./inventory-page/inventory-page.component";

export const routes: Routes = [
  {
    path: '',
    component: InventoryPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
