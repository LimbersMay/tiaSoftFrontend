import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ValidatorsService} from "../../../../shared/services/validators.service";
import {Table} from "../../../interfaces/table.interface";
import {Observable} from "rxjs";
import {Area} from "../../../../areas-management/interfaces/area.interface";
import {AreasService} from "../../../../areas-management/services/areas.service";
import {TablesService} from "../../../services/tables.service";
import {MenuItem} from "primeng/api";
import {Bill} from "../../../interfaces/bill.interface";
import {ProductsService} from "../../../../products-management/services/products.service";
import {Product} from "../../../../products-management/interfaces/product.interface";

@Component({
  selector: 'tables-create-order',
  templateUrl: './create-order.component.html',
  styles: ``
})
export class CreateOrderComponent implements OnDestroy, OnInit {
  @Input({ required: true }) display!: boolean;
  @Output() displayChange = new EventEmitter<boolean>();

  // ------------- Form attributes -------------
  @Input({ required: true }) public table: Table | undefined;
  @Input({required: true}) onShowDialog!: Observable<Table | undefined>;

  // Dropdown options
  public areas: Area[] = [];
  public tables: Table[] = [];
  public bills: Bill[] = [];
  public dishes: Product[] = [];

  public items: MenuItem[] = [];

  /*
    * The currentStep is used to display the of the form
    * The first step is 1. Where the user selects the table and the area
    * The second step is 2. Where the user selects the products, the bill and adds notes
    * The third step is 3. Where the user confirms the order
   */
  public currentStep: number = 0;

  /*
    * The orderStatusId is set in the backend to prevent the user from changing it
    * The default value is Pending
   */
  public orderForm = this.fb.nonNullable.group({
    //Properties that come from the table interface
    tableId: [''],
    areaId: [''],
    userId: [''],

    // Own properties
    billId: [''],
    notes: [''],
    totalPrice: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService,

    private readonly areasService: AreasService,
    private readonly tablesService: TablesService,
    private readonly productsService: ProductsService
  ) {}

  public onClose() {
    this.displayChange.emit(false);
    this.currentStep = 0;
  }

  public ngOnDestroy(): void {
    this.displayChange.unsubscribe();
  }

  // ------------- VALIDATORS METHODS -------------
  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.orderForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.orderForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.orderForm, field);
  }

  public ngOnInit() {
    this.onShowDialog.subscribe(value => {

      if (!value) {
        this.orderForm.reset();
        return;
      }

      this.orderForm.patchValue({
        tableId: value.tableId,
        userId: value.user.userId,
        areaId: value.area.areaId
      });
    });

    this.areasService.getAreas().subscribe({
      next: (areas) => {
        this.areas = areas;
      }
    });

    this.tablesService.getTables().subscribe({
      next: (tables) => {
        this.tables = tables;
      }
    });

    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.dishes = products;
      }
    });

    this.items = [
      {
        label: "General",
      },
      {
        label: "Platillos",
      },
      {
        label: "Confirmar",
      }
    ]
  }
}
