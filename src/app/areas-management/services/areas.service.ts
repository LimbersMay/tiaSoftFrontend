import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Area} from "../interfaces/area.interface";
import {environments} from "../../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  private readonly baseUrl = environments.baseURL;

  constructor(
    private readonly httpClient: HttpClient
  ) {}

  public getAreas(): Observable<Area[]> {
    const url = `${this.baseUrl}/areas`;

    return this.httpClient.get<Area[]>(url, {withCredentials: true})
      .pipe(
        map(areas => areas),
        catchError(error => throwError(() => error))
      )
  }

  public createArea(area: Area): Observable<Area> {
    const url = `${this.baseUrl}/areas`;

    return this.httpClient.post<Area>(url, area, {withCredentials: true})
      .pipe(
        map(area => area),
        catchError(error => throwError(() => error))
      )
  }

  public updateArea(area: Area): Observable<Area> {
    const url = `${this.baseUrl}/areas/${area.areaId}`;

    return this.httpClient.put<Area>(url, area, {withCredentials: true})
      .pipe(
        map(area => area),
        catchError(error => throwError(() => error))
      )
  }
}
