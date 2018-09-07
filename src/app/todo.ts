
export class Todo {
  todoId: number;
  title: string;
  createdDate: string;
  lastModifiedDate: string;
  completed = false;
  edit = false;
  oldTitle: string;
}
