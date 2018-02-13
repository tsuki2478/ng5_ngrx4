import {Inject, Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Task, User, TaskList} from '../domain';

@Injectable()
export class TaskService {
  private readonly domain = 'tasks';
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(@Inject('BASE_CONFIG') private config,
              private http: Http) {
  }

  add(task: Task): Observable<Task> {
    const uri = `${this.config.url}/${this.domain}`;
    const toAdd = {
      taskListId: task.taskListId,
      desc: task.desc,
      completed: task.completed,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      dueDate: task.dueDate,
      priority: task.priority,
      remark: task.remark,
      reminder: task.reminder,
      createDate: task.createDate
    };
    // const addTaskRef$ = this.addTaskRef()
    return this.http
      .post(uri, JSON.stringify(toAdd), {headers: this.headers})
      .map(res => res.json());

  }

  update(task: Task): Observable<Task> {
    const uri = `${this.config.url}/${this.domain}/${task.id}`;
    const toUpdate = {
      desc: task.desc,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      dueDate: task.dueDate,
      reminder: task.reminder,
      priority: task.priority,
      remark: task.remark
    };
    return this.http
      .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
      .map(res => res.json());
  }

  del(task: Task): Observable<Task> {
    const uri = `${this.config.url}/${this.domain}/${task.id}`;
    return this.http
      .delete(uri)
      .mapTo(task);
  }

  // GET /tasklist
  get(taskListId: string): Observable<Task[]> {
    const uri = `${this.config.url}/${this.domain}`;
    return this.http
      .get(uri, {params: {'taskListId': taskListId}})
      .map(res => res.json());
  }

  getByLists(lists: TaskList[]): Observable<Task[]> {
    return Observable.from(lists)
      .mergeMap(list => this.get(list.id))
      .reduce((tasks, t) => [...tasks, ...t], []);
  }

  moveAll(srcListId, targetListId): Observable<Task[]> {
    return this.get(srcListId)
      .mergeMap(tasks => Observable.from(tasks))
      .mergeMap(task => this.move(task.id, targetListId))
      .reduce((arrTasks, t) => {
        return [...arrTasks, t];
      }, []);
  }

  move(taskId: string, taskListId: string): Observable<Task> {
    const uri = `${this.config.url}/${this.domain}/${taskId}`;
    return this.http
      .patch(uri, JSON.stringify({taskListId: taskListId}), {headers: this.headers})
      .map(res => res.json());
  }

  complete(task: Task): Observable<Task> {
    const uri = `${this.config.url}/${this.domain}/${task.id}`;
    return this.http
      .patch(uri, JSON.stringify({completed: !task.completed}), {headers: this.headers})
      .map(res => res.json());
  }

  
}
