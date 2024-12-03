  export interface Task {
    id: string;
    title: string;
    completed: boolean;
    time_work_on: number; 
    createdAt: Date;
    updatedAt: Date;
    assigned_date: string; //only want it to have YYYY-MM-DD, no time 
  }