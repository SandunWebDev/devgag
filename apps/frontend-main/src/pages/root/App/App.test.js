import { render, screen } from '@testing-library/react';

import TestAppWrapper from '../../../tests/helpers/TestAppWrapper/TestAppWrapper';

import App from './App';

test('Renders DevGag header.', () => {
    render(
        <TestAppWrapper>
            <App />
        </TestAppWrapper>,
    );
    const headerElement = screen.getByText(/devgag/i);
    expect(headerElement).toBeInTheDocument();
});
