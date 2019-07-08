import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

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

  sampleProducts: Product[] = [
    {productName: 'Apple', productCode: 'p001', price: 100, maxQuantity: 10},
    {productName: 'Orange', productCode: 'p002', price: 80, maxQuantity: 15},
    {productName: 'Banana', productCode: 'p003', price: 60, maxQuantity: 5},
    {productName: 'Pineapple', productCode: 'p004', price: 500, maxQuantity: 3},
  ];

  productFormGroup: FormGroup;
  filteredOptions: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
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

    this.formSubscribe();
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
    this.products.push(this.formBuilder.group({
      product: this.formBuilder.control('', []),
      productNumber: this.formBuilder.control(1, [Validators.min(1), CustomValidator.integer]),
    }, { validators: CustomValidator.maxQuantity }));
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
      return this.products.value[index].product.price;
    }
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
  }

  getErrorMessage(index: number) {
    return this.products.controls[index].get('productNumber').hasError('integerInvalid') ? 'Enter an integer value' :
    this.products.controls[index].get('productNumber').hasError('maxQuantityInvalid') ? 'Exceeds the maximum value' :
    '' ;
  }


}
