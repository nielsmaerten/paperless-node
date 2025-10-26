import { HttpClient } from '../core/httpClient.js';
import type { NonUndefined, OperationQuery, OperationRequestBody, OperationResponse, Schema } from '../core/types.js';

type Task = Schema<'TasksView'>;
type TaskListQuery = OperationQuery<'tasks_list'>;
type TaskRetrieveQuery = OperationQuery<'tasks_retrieve'>;
type AcknowledgeTasksResponse = OperationResponse<'acknowledge_tasks'>;
type AcknowledgeTasksBody = NonUndefined<OperationRequestBody<'acknowledge_tasks'>>;
type RunTaskBody = NonUndefined<OperationRequestBody<'tasks_run_create'>>;

type TaskIdentifier = number;

/**
 * Client for interacting with long-running Paperless tasks.
 */
export class TasksResource {
  /**
   * @param http Shared HTTP client used to perform API calls.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a list of tasks, optionally filtered by their status.
   */
  list(query?: TaskListQuery): Promise<Task[]> {
    return this.http.get<Task[]>('/api/tasks/', { params: query });
  }

  /**
   * Retrieves a task by its identifier.
   */
  retrieve(id: TaskIdentifier, query?: TaskRetrieveQuery): Promise<Task> {
    return this.http.get<Task>(`/api/tasks/${id}/`, { params: query });
  }

  /**
   * Marks the provided tasks as acknowledged to clear pending notifications.
   */
  acknowledge(body: AcknowledgeTasksBody, query?: OperationQuery<'acknowledge_tasks'>): Promise<AcknowledgeTasksResponse> {
    return this.http.post<AcknowledgeTasksResponse, AcknowledgeTasksBody>('/api/tasks/acknowledge/', body, {
      params: query,
    });
  }

  /**
   * Triggers a Paperless background task.
   */
  run(body: RunTaskBody, query?: OperationQuery<'tasks_run_create'>): Promise<Task> {
    return this.http.post<Task, RunTaskBody>('/api/tasks/run/', body, {
      params: query,
    });
  }
}
