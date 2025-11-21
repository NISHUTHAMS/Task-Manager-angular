import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}users`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}categories`);
  }

  getAllTasksForUser(userId: number, categoryId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}todos?userId=${userId}&categoryId=${categoryId}`
    );
  }

  updateTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}todos/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}todos/${id}`);
  }

  
  async getAllTasks(): Promise<any[]> {
    return await firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}todos`)
    );
  }

  
  async createNewTask(task: any): Promise<any> {
    const tasks = await this.getAllTasks();

    const newId =
      tasks.length === 0 ? 1 : Math.max(...tasks.map((t: any) => t.id)) + 1;

    const newTask = { ...task, id: newId };

    return await firstValueFrom(
      this.http.post(`${this.baseUrl}todos`, newTask)
    );
  }

  addNewUser(user: any, userId: number): Observable<any> {
    user.id = userId;           
    return this.http.post<any>(this.baseUrl + 'users', user);

  }

  addCategoryUser(category: any, categoryId: number): Observable<any> {
    category.id = categoryId;           
    return this.http.post<any>(this.baseUrl + 'categories', category);

  }


}
