interface Task {
  id: number;
  title: string;
  deadline?: Date;
  status: boolean;
}

export type { Task };
