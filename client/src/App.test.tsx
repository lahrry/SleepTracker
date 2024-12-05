import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
    
    // Match partial text
    const description = screen.getByText(/SleepWell is your companion for balancing productivity and rest/i, { exact: false });
    expect(description).toBeInTheDocument();
  });

  test('renders "How to Use SleepWell" section', () => {
    renderWelcomePage();

    const sectionTitle = screen.getByText('How to Use SleepWell');
    expect(sectionTitle).toBeInTheDocument();
    
    // Match partial text
    const instructions = screen.getByText(/Add your tasks for the day and track time/i, { exact: false });
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
    
    // Verify navigation
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  });

  test('renders main content sections in correct order', () => {
    renderWelcomePage();

    // Match partial text for content sections
    const content = screen.getByText(/foster guilt-free, restful nights/i, { exact: false });
    expect(content).toBeInTheDocument();

    const instructions = screen.getByText(/Add your tasks for the day and track time/i, { exact: false });
    expect(instructions).toBeInTheDocument();

    // Verify order of sections
    const allText = document.body.textContent || '';
    const welcomeIndex = allText.indexOf('Welcome to SleepWell!');
    const whatIsIndex = allText.indexOf('What is SleepWell?');
    const howToUseIndex = allText.indexOf('How to Use SleepWell');

    expect(welcomeIndex).toBeLessThan(whatIsIndex);
    expect(whatIsIndex).toBeLessThan(howToUseIndex);
  });
});
