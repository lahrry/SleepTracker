import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('WelcomePage Component', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockedUsedNavigate.mockClear();
  });

  const renderWelcomePage = () => {
    return render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );
  };

  test('renders the welcome title', () => {
    renderWelcomePage();
    const welcomeTitle = screen.getByText('Welcome to SleepWell!');
    expect(welcomeTitle).toBeInTheDocument();
  });

  test('renders "What is SleepWell?" section', () => {
    renderWelcomePage();
    const sectionTitle = screen.getByText('What is SleepWell?');
    expect(sectionTitle).toBeInTheDocument();
    
    // Test for presence of key content in the description
    const description = screen.getByText(/Discover a new approach to wellness with SleepWell/, { exact: false });
    expect(description).toBeInTheDocument();
  });

  test('renders "How to Use the App" section', () => {
    renderWelcomePage();
    const sectionTitle = screen.getByText('How to Use the App');
    expect(sectionTitle).toBeInTheDocument();
    
    // Test for presence of key content in the instructions
    const instructions = screen.getByText(/Our app is designed to boost your productivity/, { exact: false });
    expect(instructions).toBeInTheDocument();
  });

  test('renders the "Let\'s get started!" button', () => {
    renderWelcomePage();
    const button = screen.getByText("Let's get started!");
    expect(button).toBeInTheDocument();
  });

  test('clicking the button navigates to /home', () => {
    renderWelcomePage();
    const button = screen.getByText("Let's get started!");
    
    fireEvent.click(button);
    
    // Verify that navigate was called with the correct path
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  });

  test('renders main content sections in correct order', () => {
    renderWelcomePage();
    const content = screen.getByText(/Discover a new approach to wellness with SleepWell/).closest('.section-text');
    expect(content).toBeInTheDocument();
    
    const instructions = screen.getByText(/Our app is designed to boost your productivity/).closest('.section-text');
    expect(instructions).toBeInTheDocument();
    
    // Verify the order of sections
    const allText = document.body.textContent;
    const welcomeIndex = allText?.indexOf('Welcome to SleepWell!') || 0;
    const whatIsIndex = allText?.indexOf('What is SleepWell?') || 0;
    const howToUseIndex = allText?.indexOf('How to Use the App') || 0;
    
    expect(welcomeIndex).toBeLessThan(whatIsIndex);
    expect(whatIsIndex).toBeLessThan(howToUseIndex);
  });

  
});