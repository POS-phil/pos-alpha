import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuCategories } from '../../../common/menu-categories';

@Injectable()
export class MenuCategoriesService {

  constructor(private http: HttpClient) { }

  private menuCategoriesApiUrl = 'http://localhost:8080/api/menu-categories';

  getMenuCategories(categoryId: number ) : Observable<MenuCategories[]>{
    return this.http.get<MenuCategories[]>(`${this.menuCategoriesApiUrl}/${categoryId}`);
  }

  createMenuCategory(category: MenuCategories): Observable<MenuCategories> {
    return this.http.post<MenuCategories>(`${this.menuCategoriesApiUrl}/create`, category);
  }
  
}
