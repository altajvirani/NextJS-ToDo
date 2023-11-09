interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: Date;
  status: boolean;
}

export type { Task };
