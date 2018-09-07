import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {Todo} from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  todos: any;
  page = 1;
  pages = [1, 2, 3];
  maxPage = 1;
  size = 3;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {
    this.readTodoList();
  }

  readTodoList() {
    this.appService.readTodoList(this.page, this.size)
      .subscribe(res => {
        this.maxPage = Math.floor(res['totalCount'] / this.size);
        if (res['totalCount'] % this.size !== 0) {
          this.maxPage++;
        }
        if (this.pages.indexOf(this.page) < 0) {
          this.pages = [];
          const start = Math.floor((this.page - 1) / this.size) * this.size + 1;
          for (let i = 0; i < 3; ++i) {
            this.pages.push(start + i);
          }
        }

        this.todos = res['todos'];
      }, err => {
        console.error(err);
      });
  }

  createOrUpdateTodo(i) {
    const todo = this.todos[i];
    const titleSplit = todo.title.split(' ');
    const referenceIds = [];
    for (let j = titleSplit.length - 1; j >= 0; --j) {
      if (titleSplit[j].indexOf('@') === 0 && !isNaN(titleSplit[j].substring(1))) {
        referenceIds.push(titleSplit[j].substring(1) * 1);
        titleSplit.splice(j, 1);
      }
    }
    todo.title = titleSplit.join(' ');
    todo.references = [];
    referenceIds.reverse().forEach(id => {
      const ref = new Todo();
      ref.todoId = id;
      ref.completed = true;
      todo.references.push(ref);
    });
    if (todo.todoId === undefined) {
      this.createTodo(i);
    } else {
      this.updateTodo(i);
    }
  }

  createTodo(i) {
    this.appService.createTodo(this.todos[i])
      .subscribe(res => {
        this.todos.splice(i, 1, res);
        this.checkPages();
      }, err => {
        console.error(err);
      });
  }

  updateTodo(i) {
    const oldCompleted = this.todos[i].edit ? this.todos[i].completed : !this.todos[i].completed;
    this.appService.updateTodo(this.todos[i])
      .subscribe(res => {
        this.todos.splice(i, 1, res);
      }, err => {
        console.error(err);
        this.todos[i].completed = oldCompleted;
      });
  }

  cancelOrdeleteTodo(i) {
    if (this.todos[i].edit) {
      this.cancel(i);
    } else {
      this.deleteTodo(i);
    }
  }

  cancel(i) {
    this.todos[i].edit = false;
    this.todos[i].title = this.todos[i].oldTitle;
  }

  deleteTodo(i) {
    this.todos.splice(i, 1);
  }

  changeCompleted(i, e) {
    this.todos[i].completed = e.target.checked;
    if (this.todos[i].todoId) {
      this.updateTodo(i);
    }
  }

  addItem() {
    this.todos.push(new Todo());
  }

  edit(i) {
    this.todos[i].edit = true;
    this.todos[i].oldTitle = this.todos[i].title;
    const references = this.todos[i].references;
    references.forEach(ref => {
      this.todos[i].title += ' @' + ref.todoId;
    });
  }

  movePage(n) {
    if (n <= 0 || n > this.maxPage) {
      return;
    }
    this.page = n;
    this.readTodoList();
  }

  first() {
    if (this.page === 1) {
      return;
    }
    this.page = 1;
    this.readTodoList();
  }

  last() {
    if (this.page === this.maxPage) {
      return;
    }
    this.page = this.maxPage;
    this.readTodoList();
  }

  next() {
    if (this.page >= this.maxPage) {
      return;
    }
    this.page++;
    this.readTodoList();
  }

  prev() {
    if (this.page <= 1) {
      return;
    }
    this.page--;
    this.readTodoList();
  }

  checkPages() {
    this.appService.readTodoList(this.page, this.size)
      .subscribe(res => {
        this.maxPage = Math.floor(res['totalCount'] / this.size);
        if (res['totalCount'] % this.size !== 0) {
          this.maxPage++;
        }
        if (this.pages.indexOf(this.page) < 0) {
          this.pages = [];
          const start = Math.floor((this.page - 1) / this.size) * this.size + 1;
          for (let i = 0; i < 3; ++i) {
            this.pages.push(start + i);
          }
        }
      });
  }

}
