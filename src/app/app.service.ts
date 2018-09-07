import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  host = '/api/todos';

  constructor(
    private http: HttpClient
  ) { }

  readTodoList(page, size) {
    return this.http.get(`${this.host}?page=${page}&size=${size}`);
  }

  createTodo(todo) {
    return this.http.post(`${this.host}`, todo);
  }

  updateTodo(todo) {
    return this.http.patch(`${this.host}`, todo);
  }

  deleteTodo(id) {
    return this.http.delete(`${this.host}/${id}`);
  }
}
