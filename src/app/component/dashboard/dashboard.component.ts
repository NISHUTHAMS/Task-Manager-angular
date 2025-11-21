import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  taskService = inject(TaskService);

  users: any[] = [];
  categories: any[] = [];

  selectedUserId!: number;
  selectedCategoryId!: number;

  inprogressTask: any[] = [];
  completedTasks: any[] = [];

  selectedTask: any;

  updateTaskForm: FormGroup;
  newTaskForm: FormGroup;
  newUserForm: FormGroup;
  newCategoryForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.updateTaskForm = fb.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [''],
      dueDate: [''],
      userId: [''],
      categoryId: ['']
    });

    this.newTaskForm = fb.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      dueDate: [''],
      userId: [''],
      categoryId: ['']
    });

    this.newUserForm = fb.group({
      id: [''],
      name: ['', Validators.required], 
    });

    this.newCategoryForm = fb.group({
      id: [''],
      name: ['', Validators.required],  
    });

  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllCategories();
  }

  getAllUsers() {
    this.taskService.getAllUsers().subscribe(res => {
      this.users = res;
    });
  }

  getAllCategories() {
    this.taskService.getAllCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getAllTasks() {
    if (!this.selectedUserId || !this.selectedCategoryId) {
      alert("Please select user and category");
      return;
    }

    this.taskService
      .getAllTasksForUser(this.selectedUserId, this.selectedCategoryId)
      .subscribe(res => {
        this.filterResults(res);
      });
  }

  filterResults(tasks: any[]) {
    this.inprogressTask = tasks.filter(t => !t.completed);
    this.completedTasks = tasks.filter(t => t.completed);
  }

  selectTask(task: any) {
    this.selectedTask = task;
    this.updateTaskForm.patchValue(task);
  }

  updateTask() {
    this.taskService.updateTask(this.updateTaskForm.value).subscribe(() => {
      this.getAllTasks();
    });
  }

  deleteTask(task: any) {
    if (confirm(`Are you sure to delete : ${task.title}?`)) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.getAllTasks();
      });
    }
  }

  addNewTask() {
    this.newTaskForm.patchValue({
      userId: this.selectedUserId,
      categoryId: this.selectedCategoryId
    });

    this.taskService.createNewTask(this.newTaskForm.value).then(() => {
      this.getAllTasks();
      this.newTaskForm.reset();
    });
  }

  addNewUser() {
    if (this.users.some(user => user.name === this.newUserForm.value.name)) {
      alert("User already exists");
      return;
    }

    const userId =
      this.users.length === 0
        ? 1
        : Math.max(...this.users.map((user: any) => user.id)) + 1;

    this.taskService.addNewUser(this.newUserForm.value, userId).subscribe(() => {
      this.newUserForm.reset();
      this.ngOnInit();
    });
  }

  addCategoryUser() {
    if (this.categories.some(category => category.name === this.newCategoryForm.value.name)) {
      alert("Category already exists");
      return;
    }

    const categoryId =
      this.categories.length === 0
        ? 1
        : Math.max(...this.categories.map((category: any) => category.id)) + 1;

    this.taskService.addCategoryUser(this.newCategoryForm.value, categoryId).subscribe(() => {
      this.newCategoryForm.reset();
      this.ngOnInit();
    });
  }
}
