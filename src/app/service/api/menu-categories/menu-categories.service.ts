import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuCategories } from '../../../common/menu-categories';

@Injectable()
export class MenuCategoriesService {

  constructor(private http: HttpClient) { }

  private menuCategoriesApiUrl = 'http://localhost:8080/api/menu-category';

  getMenuCategories(): Observable<MenuCategories[]> {
    return this.http.get<MenuCategories[]>(`${this.menuCategoriesApiUrl}`);
  }

  createCategory(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.menuCategoriesApiUrl}/create`, formData);
}

getImageUrl(filename: string): string {
    return `${this.menuCategoriesApiUrl}/image/${filename}`;
}
}
