import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import { Project, User } from '../domain';
 
@Injectable()
export class ProjectService {
    private readonly domain = 'projects';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http, @Inject('BASE_CONFIG') private config, ) { }

    // POST   Observable<Project> 是返回类型
    add(project: Project): Observable<Project> {
        const uri = `${this.config.url}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(project), { headers: this.headers })
            .map(res => res.json());
    }

    // PUT是全部， Observable<Project> 是返回类型
    update(project: Project): Observable<Project> {
        const uri = `${this.config.url}/${this.domain}/${project.id}`;
        const toUpdate = {
            name: project.name,
            coverImg: project.coverImg,
            desc: project.desc
        };
        return this.http
            .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
            .map(res => res.json());
    }

    // DELETE 3级删除{级联删除}
    del(project: Project): Observable<Project> {
        // 从数组里得到delttasks的流   count
        const delTasks$ = Observable.from(project.taskLists ? project.taskLists : [])
            // 这里的意思是，在删除时，如果有新的流要删除，那么就一并删除
            .mergeMap(listId => this.http.delete(`${this.config.url}/taskLists/${listId}`))
            .count();
        return delTasks$
            .switchMap(() => this.http.delete(`${this.config.url}/${this.domain}/${project.id}`))
            .mapTo(project);
    }


    // get
    get(userId: string): Observable<Project[]> {
        const uri = `${this.config.url}/${this.domain}`;
        return this.http
            .get(uri, { params: { 'members_like': userId },  headers: this.headers})
            .map(res => res.json()  );
    }

    Invite(projectId: string, users: User[]): Observable<Project> {
        const uri = `${this.config.uri}/${this.domain}/${projectId}`;
        return this.http
            .get(uri)
            .map(res => res.json())
            .switchMap((project: Project) => {
                const existingMemberIds = project.members;
                const invitedIds = users.map(user => user.id);
                const newIds = _.union(existingMemberIds, invitedIds);
                return this.http
                    .patch(uri, JSON.stringify({ members: newIds }), { headers: this.headers })
                    .map(res => res.json());
            });
    }
}