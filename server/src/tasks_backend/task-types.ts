export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time_work_on: number; 
  createdAt: Date;
  updatedAt: Date;
}