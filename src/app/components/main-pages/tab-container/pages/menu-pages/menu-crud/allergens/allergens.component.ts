import { CommonModule } from '@angular/common';

import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';

import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatRadioModule, MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import {MatTableDataSource} from '@angular/material/table';
import { CsMatTableComponent } from "../../../../../../layout/table/cs-mat-table/cs-mat-table.component";
import {MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-allergens',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSlideToggleModule,
    CsMatTableComponent,
    MatRadioGroup,
    MatRadioButton
],
  templateUrl: './allergens.component.html',
  styleUrl: './allergens.component.scss'
})
export class AllergensComponent implements OnInit {

  name: string | undefined;
  displayedColumns: string[] = ['Items','Does_Not_Contain', 'May_Contain', 'Contains'];

  ALLERGENS_DATA : any;
  selectedCount = signal(0);
  itemList: AllergensComponent [] = [];;

 getCategories() {
    this.ALLERGENS_DATA = new MatTableDataSource(this.itemList);
  }


  // Injecting LiveAnnouncer for accessibility announcements


  //private _liveAnnouncer = inject(LiveAnnouncer);
  dialog: any;
  selection: any;

  ngOnInit(): void {


  }




}
