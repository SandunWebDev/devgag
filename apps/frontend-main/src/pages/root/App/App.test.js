import { render, screen } from '@testing-library/react';

import App from './App';

test('Renders DevGag header.', () => {
    render(<App />);
    const headerElement = screen.getByText(/devgag/i);
    expect(headerElement).toBeInTheDocument();
});
