import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, act, getByTestId, queryByTestId, wait } from '@testing-library/react'
import SearchBar from './searchbar';

describe('seachbar specs', () => {
  it('should by default show the command buttons', () => {
    const container = render(
      <MemoryRouter>
        <SearchBar onSearchStreamId={() => { }} />
      </MemoryRouter>
    );

    expect(container.queryByTestId('open-search-button')).toBeTruthy();
    expect(container.queryByTestId('first-page-button')).toBeTruthy();
    expect(container.queryByTestId('previous-page-button')).toBeTruthy();
    expect(container.queryByTestId('next-page-button')).toBeTruthy();
    expect(container.queryByTestId('last-page-button')).toBeTruthy();
  });

  it('should show the search input when search button is clicked', () => {
    const container = render(
        <MemoryRouter>
          <SearchBar onSearchStreamId={() => { }} />
        </MemoryRouter>
      );

    fireEvent.click(container.getByTestId('open-search-button'));

    expect(container.getByTestId('search-container')).toBeTruthy();
    expect((container.queryByTestId('open-search-button'))).toBeFalsy();
    expect((container.queryByTestId('first-page-button'))).toBeFalsy();
    expect((container.queryByTestId('previous-page-button'))).toBeFalsy();
    expect((container.queryByTestId('next-page-button'))).toBeFalsy();
    expect((container.queryByTestId('last-page-button'))).toBeFalsy();
  })
});
