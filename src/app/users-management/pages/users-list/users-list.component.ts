import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {User} from "../../../auth/interfaces/user.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {FilterService, MessageService} from "primeng/api";
import {ErrorService} from "../../../shared/services/error.service";

const ROLES = [
  "Mesero",
  "Gerente",
  "Capitan"
];

@Component({
  selector: 'users-management-list',
  templateUrl: './users-list.component.html',
  styles: ``
})
export class UsersListComponent implements OnInit {

  public users!: User[];
  public isEditing = false;

  public display!: boolean;

  public roles = ROLES.map(role => ({
    name: role,
    code: role
  }));

  public userForm: FormGroup = this.fb.nonNullable.group({
    userId: [''],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roles: [[], Validators.required],
    password: [],
  });

  constructor(
    private readonly usersService: UsersService,
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService,
    private readonly messageService: MessageService,
    private readonly errorService: ErrorService,
    private readonly filterService: FilterService
  ) {}

  public showDialog(user?: User) {
    this.display = true;

    if (!user) return;

    this.isEditing = true;
    this.userForm.reset(user);

    const userRoles = user.roles.map(role => ({
      name: role,
      code: role
    }));

    this.userForm.get('roles')?.reset(userRoles);
  }

  public get currentUser(): User {
    return {
      ...this.userForm.value,
      roles: this.userForm.get('roles')?.value.map((role: any) => role.code)
    } as User;
  }

  public closeDialog() {
    this.userForm.reset();
    this.display = false;
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.userForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.userForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.userForm, field);
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.userForm.value.userId) {
      return this.usersService.updateUser(this.currentUser)
        .subscribe({
          next: (user: User) => {
            const index = this.users.findIndex(u => u.userId === user.userId);
            this.users[index] = user;

            this.messageService.add({ severity: 'success', summary: 'Usuario actualizado', detail: "El usuario se actualizó correctamente"});
            this.closeDialog();
          },
          error: (err) => {
            const errorMessage = this.errorService.getErrorMessage(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage});
          }
        });
    }

    return this.usersService.createUser(this.currentUser)
      .subscribe({
        next: (user: User) => {
          this.users.push(user);
          this.messageService.add({ severity: 'success', summary: 'Usuario creado exitosamente', detail: "El usuario se creó correctamente"});
          this.closeDialog();
        },
        error: (err) => {
          const errorMessage = this.errorService.getErrorMessage(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage});
        }
      })
  }

  ngOnInit() {
    this.filterService.register('hasRole', (value: string[], filter: string[]): boolean => {

      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      return filter.some(role => value.includes(role));
    });

    this.usersService.getUsers()
      .subscribe({
        next: (users: User[]) => this.users = users,
        error: (err) => {
          const errorMessage = this.errorService.getErrorMessage(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage});
        }
      });
  }
}
