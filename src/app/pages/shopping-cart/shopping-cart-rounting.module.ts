import { ShoppingCartComponent } from './shopping-cart.component';
import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';


const routes: Routes = [
  {path: '',  component:ShoppingCartComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule { }
