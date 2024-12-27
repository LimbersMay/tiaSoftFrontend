import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateOrderDto} from "../../menu/interfaces/create-order-dto.interface";
import {environments} from "../../../../../environments/environments";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {from, Observable} from "rxjs";
import {Order} from "../interfaces/order.interface";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private readonly baseUrl = environments.baseURL;
  private readonly connection: HubConnection;

  constructor(
    private readonly httpClient: HttpClient
  ) {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/order`, {withCredentials: true})
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.start()
      .then(() => console.log('Connection started'))
      .catch((error) => console.log('Error while establishing connection: ' + error));
  }

  public createOrder(createOrderDto: CreateOrderDto): Observable<void> {
    return from(this.connection.invoke('CreateOrder', createOrderDto, createOrderDto.areaId));
  }

  public onReceiveOrders(): Observable<Order> {
    return new Observable<Order>(observer => {
      this.connection.on('ReceiveOrder', (order) => {
        observer.next(order);
      });
    });
  }

  public getOrders(): Observable<Order[]> {
    const url = `${this.baseUrl}/orders`;

    return this.httpClient.get<Order[]>(url, { withCredentials: true });
  }

  public getOrdersByTableId(tableId: string): Observable<Order[]> {
    const url = `${this.baseUrl}/orders/${tableId}`;

    return this.httpClient.get<Order[]>(url, { withCredentials: true });
  }
}
