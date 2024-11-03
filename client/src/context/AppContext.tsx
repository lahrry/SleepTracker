import { createContext, useState } from "react";
import { Task } from "../types/types";

// Exercise: Create add budget to the context

interface AppContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const initialState: AppContextType = {
  tasks: [],
  setTasks: () => {}
};

export const AppContext = createContext<AppContextType>(initialState);

export const AppProvider = (props: any) => {
  const [tasks, setTasks] = useState<Task[]>(initialState.tasks);

  return (
    <AppContext.Provider
      value={{
        tasks: tasks,
        setTasks: setTasks
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
