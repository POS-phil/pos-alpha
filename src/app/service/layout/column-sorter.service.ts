import { Injectable } from '@angular/core';

export interface ColumnInfo {
  id: string;
  name: string;
  hidden: boolean;
  preventBeingHidden?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ColumnSorterService {

  loadSavedColumnInfo(columnInfo: ColumnInfo[], saveName?: string): ColumnInfo[] | undefined {
    if (saveName) {
      if (!localStorage) {
        return undefined;
      }

      const loadedInfo = localStorage.getItem(`${saveName}-columns`);

      if (loadedInfo) {
        return JSON.parse(loadedInfo);
      }
      this.saveColumnInfo(columnInfo);
      return columnInfo;
    }
    return undefined;
  }

  saveColumnInfo(columnInfo: ColumnInfo[], saveName?: string): void {
    if (saveName) {
      if (!localStorage) {
        return;
      }

      localStorage.setItem(`${saveName}-columns`, JSON.stringify(columnInfo));
    }
  }

  constructor() { }
}
