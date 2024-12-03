import { render, screen, fireEvent } from "@testing-library/react";
import TodaysTasks from "../components/dashboard/TodaysTasks";

// Mock functions
const mockDeleteTask = jest.fn();
const mockSetTasks = jest.fn();

const tasks = [
  { id: 1, title: "Task 1", completed: false, time_work_on: 0 },
  { id: 2, title: "Task 2", completed: true, time_work_on: 30 },
  { id: 3, title: "Task 3", completed: true, time_work_on: 45 },
];

describe("Delete All Completed Tasks Button", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the 'Delete All Completed Tasks' button", () => {
    const mockDeleteTask = jest.fn();
    const mockSetTasks = jest.fn();

    render(
      <TodaysTasks
      setTasks={mockSetTasks}
      deleteTask={mockDeleteTask}
      addTask={jest.fn()}
      updateTask={jest.fn()}
      />
    );

    const deleteButton = screen.getByText(/Delete All Completed Tasks/i);
    expect(deleteButton).toBeInTheDocument();
  });

  test("deletes only completed tasks when clicked", () => {
    const mockSetSelectedDate = jest.fn();
    const selectedDate = new Date("2024-12-03"); 
    render(
      <TodaysTasks
        deleteTask={mockDeleteTask}
        addTask={jest.fn()}
        updateTask={jest.fn()}
        setTasks={mockSetTasks}
      />
    );

    const deleteButton = screen.getByText(/Delete All Completed Tasks/i);

    // Simulate click
    fireEvent.click(deleteButton);

    // Ensure deleteTask is called for each completed task
    expect(mockDeleteTask).toHaveBeenCalledTimes(2);
    expect(mockDeleteTask).toHaveBeenCalledWith(2); // Task 2
    expect(mockDeleteTask).toHaveBeenCalledWith(3); // Task 3
  });

  test("does nothing if no tasks are completed, we dont expect the button to appear", () => {
    const incompleteTasks = [
      { id: 1, title: "Task 1", completed: false, time_work_on: 0 },
      { id: 4, title: "Task 4", completed: false, time_work_on: 15 },
    ];

    render(
      <TodaysTasks
        deleteTask={mockDeleteTask}
        addTask={jest.fn()}
        updateTask={jest.fn()}
        setTasks={mockSetTasks}

      />
    );

    const deleteButton = screen.queryByText(/Delete All Completed Tasks/i);

    expect(deleteButton).not.toBeInTheDocument();
  });
});
