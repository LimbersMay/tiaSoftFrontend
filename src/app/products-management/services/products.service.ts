import { Injectable } from '@angular/core';
import {environments} from "../../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {Product} from "../interfaces/product.interface";
import {UpdateProductImage} from "../interfaces/update-product-image.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public baseUrl: string = environments.baseURL;

  constructor(private readonly httpClient: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/products`;

    return this.httpClient.get<Product[]>(url, {withCredentials: true})
      .pipe(
        map((products) => products),
        catchError( (err) => throwError(() => err))
      );
  }

  public updateProduct(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/products/${product.productId}`;

    return this.httpClient.put<Product>(url, product, {withCredentials: true})
      .pipe(
        map((user) => user),
        catchError((err) => throwError(() => err))
      );
  }

  public updateProductImage(productId: string, image: File): Observable<string> {
    const url = `${this.baseUrl}/products/updateImage/${productId}`;

    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient.post(url, formData, {
      withCredentials: true,
      responseType: 'text'
    })
      .pipe(
        map((result) => result),
        catchError((err) => throwError(() => err))
      );
  }

  public createProduct(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/products`;

    return this.httpClient.post<Product>(url, product, {withCredentials: true})
      .pipe(
        map((user) => user),
        catchError((err) => throwError(() => err))
      );
  }
}
