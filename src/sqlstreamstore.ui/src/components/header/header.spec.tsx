import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react'
import Header from './header';

describe('Header specs', () => {
  it('should render the header and title', async () => {
    const container = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const title = await container.findByText('SqlStreamStore browser');
    expect(title).toBeDefined();
  });
});