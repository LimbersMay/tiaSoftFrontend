import {Component, OnInit} from '@angular/core';
import {RolesService} from "../../services/roles.service";
import {Role} from "../../interfaces/role.interface";
import {ErrorService} from "../../../shared/services/error.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit{

  public roles!: Role[];

  constructor(
    private readonly rolesService: RolesService,
    private readonly errorService: ErrorService,
    private readonly messageService: MessageService
  ) {}

  public ngOnInit() {
    this.rolesService.getRoles()
      .subscribe({
        next: roles => this.roles = roles,
        error: error => {
          const errorMessage = this.errorService.getErrorMessage(error);
          this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
        }
      })
  }
}
