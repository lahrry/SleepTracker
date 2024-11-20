import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertions
import TodaysTasks from './components/dashboard/TodaysTasks';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TodaysTask Component', ()=> {
    // Clear mock before each test to reset its state
    beforeEach(() => {
        jest.clearAllMocks();
    });
    mockedAxios.post.mockResolvedValue({ data: { id: 1, title: 'Test Task', completed: false } });
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.put.mockResolvedValue({});
    mockedAxios.delete.mockResolvedValue({});

    test('displays an error when the user tries to add an empty task', async () => {
        render(<TodaysTasks/>);
        //we first find the add task button and click it without entering anything in the input field 
        const addTaskButton = screen.getByText('Add Task');
        fireEvent.click(addTaskButton);
        //simulates user clicking, want to check that the error message appears 
        const errorMessage = await screen.findByText("Task cannot be empty");
        expect(errorMessage).toBeInTheDocument();
    });

    test('test successful addition of a task', async () => {
        // Mock the GET request to return the initial task
        mockedAxios.get.mockResolvedValueOnce({ data: [] });
        // Mock the POST request to return the new task
        mockedAxios.post.mockResolvedValueOnce({
          data: { id: 2, title: 'Test Task', completed: false },
        });
        // Render the component
        render(<TodaysTasks />);
        // Wait for the GET request to complete
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
        // Simulate the user adding a task
        const input = screen.getByLabelText('New Task'); // Adjust label text if necessary
        const addTaskButton = screen.getByText('Add Task');
        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(addTaskButton);
        // Wait for the POST request and UI update
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5001/api/v1/tasks',
          { title: 'Test Task' }
        ));
        // Verify the new task is displayed in the DOM
        const newTask = await screen.findByText('Test Task'); // Use `findByText` for asynchronous updates
        expect(newTask).toBeInTheDocument();
      });

      test('displays a dialog for duplicate task confirmation', async () => {
        // Mock the GET request to return an initial task
        mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Test Task', completed: false }] });
        render(<TodaysTasks />);
        // Wait for the GET request to complete
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
        // Simulate adding a duplicate task
        const input = screen.getByLabelText('New Task'); // Adjust label text if necessary
        const addTaskButton = screen.getByText('Add Task');
        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(addTaskButton); // Add the task
        const newTask = await screen.findByText('Test Task'); // Use `findByText` for asynchronous updates
        expect(newTask).toBeInTheDocument();
        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(addTaskButton); // Attempt duplicate
        // Wait for the duplicate dialog to appear
        const dialogText = await screen.findByText('This task already exists. Are you sure you want to add it?');
        expect(dialogText).toBeInTheDocument();
      });

      test('closes the duplicate task dialog when "No" is clicked', async () => {
        // Mock the GET request to return an initial task
        mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Test Task', completed: false }] });
        render(<TodaysTasks />);
        // Wait for the GET request to complete
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
        // Simulate adding a duplicate task
        const input = screen.getByLabelText('New Task');
        const addTaskButton = screen.getByText('Add Task');
        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(addTaskButton);
        //check if it was updated - properly inputted 
        const newTask = await screen.findByText('Test Task'); // Use `findByText` for asynchronous updates
        expect(newTask).toBeInTheDocument();
        //then try to add again 
        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(addTaskButton); // Attempt duplicate
        // Wait for the duplicate dialog to appear
        const dialogText = await screen.findByText('This task already exists. Are you sure you want to add it?');
        expect(dialogText).toBeInTheDocument();
        // Simulate clicking "No" in the dialog
        const noButton = await screen.findByText('No');
        fireEvent.click(noButton);
        // Ensure the dialog is no longer visible
        await waitFor(() => {
          expect(screen.queryByText('This task already exists. Are you sure you want to add it?')).not.toBeInTheDocument();
        });
        //still expect the original task to be in the document 
        expect(newTask).toBeInTheDocument();
      });     
})