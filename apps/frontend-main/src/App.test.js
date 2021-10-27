import { render, screen } from '@testing-library/react';

import App from './App';

test('Renders welcome message.', () => {
    render(<App />);
    const welcomeElement = screen.getByText(/welcome/i);
    expect(welcomeElement).toBeInTheDocument();
});
