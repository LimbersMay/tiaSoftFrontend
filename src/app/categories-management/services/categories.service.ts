import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Category} from "../interfaces/category.interface";
import {environments} from "../../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly baseUrl: string = environments.baseURL;

  constructor(private readonly httpClient: HttpClient) {}

  public getCategories(): Observable<Category[]> {
    const url = `${this.baseUrl}/categories`;

    return this.httpClient.get<Category[]>(url, {withCredentials: true})
      .pipe(
        map(categories => categories),
        catchError(error => throwError(() => error))
      );
  }

  public createCategory(category: Category): Observable<Category> {
    const url = `${this.baseUrl}/categories`;

    return this.httpClient.post<Category>(url, category, {withCredentials: true})
      .pipe(
        map(category => category),
        catchError(error => throwError(() => error))
      );
  }

  public updateCategory(category: Category): Observable<Category> {
    const url = `${this.baseUrl}/categories/${category.categoryId}`;

    return this.httpClient.put<Category>(url, category, {withCredentials: true})
      .pipe(
        map(category => category),
        catchError(error => throwError(() => error))
      );
  }
}
