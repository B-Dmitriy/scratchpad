enum TaskStatuses {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}

export interface Task {
    task_id: number // ???
    title: string // varchar(256),
    description: string // text,

    status: TaskStatuses // varchar in (...)

    created_at: string // Date
    updated_at: string // Date
}

export interface CreateTaskBody {
    title: string
    description: string | null
}

export interface EditTaskBody {
    title: string
    description: string | null
    status: TaskStatuses
}

export interface GetTasksListBody {
    limit: number
    page: number
}