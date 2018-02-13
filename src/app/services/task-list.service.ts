import { Observable } from 'rxjs/Observable';
import { TaskList } from '../domain';
import { Http, Headers } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
@Injectable()
export class TaskListService {
    private readonly domain = 'taskList';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http, @Inject('BASE_CONFIG') private config, ) { }

    // POST   Observable<TaskList> 是返回类型
    add(taskList: TaskList): Observable<TaskList> {
        taskList.id = null;
        const uri = `${this.config.url}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(taskList), { headers: this.headers })
            .map(res => res.json());
    }

    // PUT是全部， Observable<TaskList> 是返回类型
    update(taskList: TaskList): Observable<TaskList> {
        const uri = `${this.config.url}/${this.domain}/${taskList.id}`;
        const toUpdate = {
            name: taskList.name,

        };
        return this.http
            .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
            .map(res => res.json());
    }

    // DELETE 3级删除{级联删除}
    del(taskList: TaskList): Observable<TaskList> {
        // 从数组里得到delttasks的流   count
        const uri = `${this.config.url}/taskLists/${taskList.id}`;
        return this.http.delete(uri)
            .mapTo(taskList);
    }


    // get
    get(projectId: string): Observable<TaskList[]> {
        const uri = `${this.config.url}/${this.domain}`;
        return this.http
            .get(uri, { params: { 'projectId': projectId } })
            .map(res => res.json() as TaskList[]);
    }

    swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
        const dragUri = `${this.config.url}/taskLists/${src.id}`;
        const dropUri = `${this.config.url}/taskLists/${target.id}`;
        const drag$ = this.http
            .patch(dragUri, JSON.stringify({ order: target.order }), { headers: this.headers })
            .map(res => res.json());
        const drop$ = this.http
            .patch(dropUri, JSON.stringify({ order: src.order }), { headers: this.headers })
            .map(res => res.json());
        return Observable
            .concat(drag$, drop$)
            .reduce((arrs, list) => [...arrs, list], [])
    }
}