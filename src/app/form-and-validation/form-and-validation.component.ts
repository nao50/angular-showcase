import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CustomValidator } from './custom-validator';

export interface Product {
  productName: string;
  productCode: string;
  price: number;
  maxQuantity: number;
}
export interface Products {
  product: Product;
  productNumber: number;
}
export interface Order {
  products: Products[];
}

@Component({
  selector: 'app-form-and-validation',
  templateUrl: './form-and-validation.component.html',
  styleUrls: ['./form-and-validation.component.scss']
})
export class FormAndValidationComponent implements OnInit, AfterViewInit {
  Total: number;
  unitPrice: number;
  maxNumber: number;
  product: Product;
  displayRemoveIcon = false;
  formInvalid = false;

  productsList: Products[] = [];
  sampleProducts: Product[] = [
    {productName: 'Apple', productCode: 'p001', price: 100, maxQuantity: 10},
    {productName: 'Orange', productCode: 'p002', price: 80, maxQuantity: 15},
    {productName: 'Banana', productCode: 'p003', price: 60, maxQuantity: 5},
    {productName: 'Pineapple', productCode: 'p004', price: 500, maxQuantity: 3},
  ];

  displayedColumns: string[] = ['productName', 'price', 'productNumber', 'Subtotal'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data = new MatTableDataSource(this.productsList);

  productFormGroup: FormGroup;
  filteredOptions: Observable<Product[]>[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.productFormGroup = this.formBuilder.group({
      products: this.formBuilder.array([
        this.formBuilder.group({
          product: this.formBuilder.control('', []),
          productNumber: this.formBuilder.control(1, [Validators.min(1), CustomValidator.integer]),
        }, { validators: CustomValidator.maxQuantity })
      ], [CustomValidator.maxQuantityTotal]),
      Total: this.formBuilder.control(0, [Validators.required]),
    });

    this.managedFilter(0);
    this.formSubscribe();
  }

  managedFilter(index: number) {
    const arrayControl = this.productFormGroup.get('products') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('product').valueChanges
      .pipe(
      startWith<string | Product>(''),
      map(value => typeof value === 'string' ? value : value.productName),
      map(productName => productName ? this._filter(productName) : this.sampleProducts.slice())
      );
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.sampleProducts.filter(option => option.productName.toLowerCase().includes(filterValue));
  }


  formSubscribe() {
    this.productFormGroup.valueChanges.subscribe(
      (value: Order) => {
        if (this.products.length === 1) {
          this.displayRemoveIcon = false;
        } else {
          this.displayRemoveIcon = true;
        }

        if (this.productFormGroup.status === 'INVALID') {
          this.formInvalid = true;
        } else if ( this.productFormGroup.status === 'VALID') {
          this.formInvalid = false;
        }
        this.calculate(value);
      }
    );
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  get products(): FormArray {
    return this.productFormGroup.get('products') as FormArray;
  }

  addInput() {
    this.products.push(
      this.formBuilder.group({
        product: this.formBuilder.control('', []),
        productNumber: this.formBuilder.control(1, [Validators.min(1), CustomValidator.integer]),
      }, { validators: CustomValidator.maxQuantity }));

    this.managedFilter(this.products.length - 1);
  }

  delInput(index) {
    this.products.removeAt(index);
  }

  displayFn(product: Product) {
    if (product) { return product.productName; }
  }

  getUnitPrice(index: number) {
    this.unitPrice = 0;
    if (this.products.value[index].product) {
      return this.products.value[index].product.price;    }
  }

  getmaxNumber(index: number) {
    this.maxNumber = 0;
    if (this.products.value[index].product) {
      return this.products.value[index].product.maxQuantity;
    }
  }

  delSelectedProduct(index: number) {
    if (this.products.value[index].product) {
      this.products.controls[index].patchValue({ product: '', productNumber: 1}, {emitEvent: true});
    }
  }

  calculate(order?: Order) {
    // calculate Total
    this.Total = 0;
    if (!this.formInvalid) {
      for (const prod of order.products) {
        if (prod.product) {
          this.Total += (prod.product.price * prod.productNumber);
        }
      }
    } else {
      this.Total = 0;
    }

    // calculate Receipt
    const arr = [];
    for (const p of order.products) {
      if (p.product) {
        arr.push(p);
      }
    }

    const m = new Map();
    this.productsList = [];

    arr.reduce((aggr, current) => {
      aggr.set(current.product, aggr.has(current.product) ? aggr.get(current.product) + current.productNumber : current.productNumber);
      return aggr;
    }, m).forEach(function(value, key) {
      this.push({product: key, productNumber: value});
    }, this.productsList);


    if (!this.formInvalid) {
      this.data = new MatTableDataSource(this.productsList);
    } else {
      this.data = new MatTableDataSource([]);
    }
  }

  // TODO
  save() {
    localStorage.setItem('angularShowcase', JSON.stringify(this.productsList));
    const message = 'success';
    const action = 'save';
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // TODO
  load() {}

  reset() {
    while (this.products.length !== 0) {
      this.products.removeAt(0);
    }
    this.addInput();
  }

  getTotal() {
    if (!this.formInvalid) {
      return this.productsList.map(t => (t.product.price * t.productNumber)).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  getErrorMessage(index: number) {
    return this.products.controls[index].get('productNumber').hasError('integerInvalid') ? 'Enter an integer value' :
    this.products.controls[index].get('productNumber').hasError('maxQuantityInvalid') ? 'Exceeds the maximum value' :
    '' ;
  }

  getTotalErrorMessage() {
    return this.products.hasError('totalMaxQuantityInvalid') ? 'Exceeds the total maximum value' :
    '' ;
  }


}
