import {Component, OnInit} from '@angular/core';
import {Area} from "../../interfaces/area.interface";
import {AreasService} from "../../services/areas.service";
import {MessageService} from "primeng/api";
import {ErrorService} from "../../../shared/services/error.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit{

  public areas: Area[] = [];
  public display!: boolean;

  public areaForm = this.fb.group({
    areaId: [''],
    name: ['', Validators.required],
    description: ['']
  })

  constructor(
    private readonly areasService: AreasService,
    private readonly messageService: MessageService,
    private readonly errorService: ErrorService,
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService
  ) {}

  public get currentArea(): Area {
    return this.areaForm.value as Area;
  }

  public showDialog(area?: Area) {
    this.display = true;

    if (!area) return;

    this.areaForm.reset(area);
  }

  public closeDialog(): void {
    this.display = false;
    this.areaForm.reset();
  }

  public onSubmit() {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      return;
    }

    if (!this.currentArea.areaId){
      return this.areasService.createArea(this.currentArea).subscribe({
        next: area => {
          this.areas.unshift(area);
          this.closeDialog();

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Area creada correctamente'
          });
        },
        error: error => {
          const errorMessage = this.errorService.getErrorMessage(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
        }
      })
    }

    return this.areasService.updateArea(this.currentArea).subscribe({
      next: area => {
        const index = this.areas.findIndex(a => a.areaId === area.areaId);
        this.areas[index] = area;
        this.closeDialog();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Area actualizada correctamente'
        });
      },
      error: error => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    })
  }

  public ngOnInit() {
    this.areasService.getAreas().subscribe({
      next: (areas: Area[]) => this.areas = areas,
      error: (error: any) => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    })
  }

  // Validators
  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.areaForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.areaForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.areaForm, field);
  }
}
