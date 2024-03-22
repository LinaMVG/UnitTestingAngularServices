import { Component, OnInit } from '@angular/core';
import { Product } from './../../models/product.model';

import { ProductsService } from './../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  styleUrls: ['./products.component.scss'],
  imports: [CommonModule]
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productsService.getAllSimple()
    .subscribe(products => {
      this.products = products;
    });
  }

}
