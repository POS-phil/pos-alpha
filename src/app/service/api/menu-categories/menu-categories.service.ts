import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuCategories } from '../../../common/menu-categories';

@Injectable()
export class MenuCategoriesService {

  constructor(private http: HttpClient) { }

  //private menuCategoriesApiUrl = 'http://147.93.111.68:8080/api/menu-category';
  private menuCategoriesApiUrl = 'http://localhost:8080/api/menu-category';

  getMenuCategories(): Observable<MenuCategories[]> {
    return this.http.get<MenuCategories[]>(`${this.menuCategoriesApiUrl}`);
  }

  getSubCategories(parentId: number): Observable<MenuCategories[]> {
    return this.http.get<MenuCategories[]>(`${this.menuCategoriesApiUrl}/subcategories/${parentId}`);
  }

  createCategory(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.menuCategoriesApiUrl}/create`, formData);
  }

  deleteCategories(categoryId: number[]) : Observable<any> {
    return this.http.delete(`${this.menuCategoriesApiUrl}/delete`, { body: categoryId, responseType: 'text' });
  }

  getMenuCategoryIdAndName(): Observable<any> {
    return this.http.get<any>(`${this.menuCategoriesApiUrl}/id_name`);
  }

  updateCategoryField(categoryId: number, field: string, value: boolean): Observable<any> {
    return this.http.patch<any>(
      `${this.menuCategoriesApiUrl}/${categoryId}/toggle?field=${field}&value=${value}`,
      {}
    );
  }

  checkCategoryExists(categoryName: string): Observable<{ exists: boolean }> {
  return this.http.get<{ exists: boolean }>(`${this.menuCategoriesApiUrl}/exists`, {
    params: { categoryName }
  });
}
}
