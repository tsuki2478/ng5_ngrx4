import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User, Project } from '../domain';

@Injectable()
export class UserService {
    private readonly domain = 'users';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor( @Inject('BASE_CONFIG') private config,
        private http: Http) {
    }


    searchUsers(filter: string): Observable<User[]> {
        const uri = `${this.config.url}/${this.domain}`;
        return this.http
            .get(uri, { params: { 'email_like': filter } })
            .map(res => res.json() as User[]);
    }

    getUsersByProject(projectId: string): Observable<User[]> {
        const uri = `${this.config.url}/${this.domain}`;
        return this.http
        .get(uri, { params: { 'projectId': projectId } })
            .map(res => res.json() as User[]);
    }

    addProjectRef(user: User, projectId: string): Observable<User> {
        const uri = `${this.config.url}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];

        if (projectIds.indexOf(projectId) > -1) {
            return Observable.of(user);
        }
        return this.http
            .patch(uri, JSON.stringify({ projectIds: [...projectIds, projectId] }), { headers: this.headers })
            .map(res => res.json() as User);
    }

    removeProjectRef(user: User, projectId: string): Observable<User> {
        const uri = `${this.config.url}/${this.domain}/${user.id}`;
        const projectIds = (user.projectIds) ? user.projectIds : [];
        const index = projectIds.indexOf(projectId);
        // 如果不存在，则返回
        if (index === -1) {
            return Observable.of(user);
        }
        // 刚好删除index
        const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
        return this.http
            .patch(uri, JSON.stringify({ projectIds: toUpdate }), { headers: this.headers })
            .map(res => res.json() as User);
    }

    // 批量处理
    batchUpdateProjectRef(project: Project): Observable<User[]> {
        const projectId = project.id;
        // 防止他是空
        const memberIds = project.members ? project.members : [];
        return Observable.from(memberIds)
            // 根据id取得流，拍扁。将project所以user都拿出来
            .switchMap(id => {
                const uri = `${this.config.url}/${this.domain}/${id}`;
                return this.http.get(uri).map(res => res.json() as User);
            })
            // 过滤
            .filter(user => user.projectIds.indexOf(projectId) === -1)
            .switchMap(u => this.addProjectRef(u, projectId))
            .reduce((arr, curr) => [...arr, curr], []);
    }
}
