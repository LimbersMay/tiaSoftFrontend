import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'tables-accounts-page',
  templateUrl: './accounts-page.component.html',
  styles: ``
})
export class AccountsPageComponent implements OnInit{

  public id: string | null = null;

  constructor(private readonly router: ActivatedRoute) {}

  public ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
  }
}
