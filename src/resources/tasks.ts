import { HttpClient } from '../core/httpClient.js';
import type { NonUndefined, OperationQuery, OperationRequestBody, OperationResponse, Schema } from '../core/types.js';

type Task = Schema<'TasksView'>;
type TaskListQuery = OperationQuery<'tasks_list'>;
type TaskRetrieveQuery = OperationQuery<'tasks_retrieve'>;
type AcknowledgeTasksResponse = OperationResponse<'acknowledge_tasks'>;
type AcknowledgeTasksBody = NonUndefined<OperationRequestBody<'acknowledge_tasks'>>;
type RunTaskBody = NonUndefined<OperationRequestBody<'tasks_run_create'>>;

type TaskIdentifier = number;

export class TasksResource {
  constructor(private readonly http: HttpClient) {}

  list(query?: TaskListQuery): Promise<Task[]> {
    return this.http.get<Task[]>('/api/tasks/', { params: query });
  }

  retrieve(id: TaskIdentifier, query?: TaskRetrieveQuery): Promise<Task> {
    return this.http.get<Task>(`/api/tasks/${id}/`, { params: query });
  }

  acknowledge(body: AcknowledgeTasksBody, query?: OperationQuery<'acknowledge_tasks'>): Promise<AcknowledgeTasksResponse> {
    return this.http.post<AcknowledgeTasksResponse, AcknowledgeTasksBody>('/api/tasks/acknowledge/', body, {
      params: query,
    });
  }

  run(body: RunTaskBody, query?: OperationQuery<'tasks_run_create'>): Promise<Task> {
    return this.http.post<Task, RunTaskBody>('/api/tasks/run/', body, {
      params: query,
    });
  }
}
