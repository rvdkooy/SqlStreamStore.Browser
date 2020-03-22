import React from 'react';
import { HalResource, URI, HalRestClient } from 'hal-rest-client';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { render, fireEvent, wait } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import SearchBar from './searchbar';

describe('seachbar specs', () => {
  const halLinks = {
    first: new HalResource(new HalRestClient(), new URI('/first')),
    previous: new HalResource(new HalRestClient(), new URI('/previous')),
    next: new HalResource(new HalRestClient(), new URI('/next')),
    last: new HalResource(new HalRestClient(), new URI('/last')),
  };

  it('should by default show the command buttons', () => {
    const container = render(
      <MemoryRouter>
        <SearchBar fromPosition="1" halLinks={halLinks} />
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
          <SearchBar fromPosition="1" halLinks={halLinks} />
        </MemoryRouter>
      );

    fireEvent.click(container.getByTestId('open-search-button'));

    expect(container.getByTestId('search-container')).toBeTruthy();
    expect((container.queryByTestId('open-search-button'))).toBeFalsy();
    expect((container.queryByTestId('first-page-button'))).toBeFalsy();
    expect((container.queryByTestId('previous-page-button'))).toBeFalsy();
    expect((container.queryByTestId('next-page-button'))).toBeFalsy();
    expect((container.queryByTestId('last-page-button'))).toBeFalsy();
  });

  it('should close the search input when close button is clicked', () => {
    const container = render(
        <MemoryRouter>
          <SearchBar fromPosition="1" halLinks={halLinks} />
        </MemoryRouter>
      );

    fireEvent.click(container.getByTestId('open-search-button'));
    expect(container.getByTestId('search-container')).toBeTruthy();
    
    fireEvent.click(container.getByTestId('close-search-button'));
    expect(container.queryAllByTestId('search-container').length).toBeFalsy();
  });

  it('should call onSearchStreamId when submitting the search string', () => {
    const memoryHistory = createMemoryHistory();
    const customHalLinks = {
      ...halLinks,
      ['streamStore:find']: new HalResource(new HalRestClient(), new URI('/find/{streamId}', true)),
    }
    jest.spyOn(memoryHistory, 'push');
    const container = render(
        <Router history={memoryHistory}>
          <SearchBar fromPosition="1" halLinks={customHalLinks} />
        </Router>
      );

    fireEvent.click(container.getByTestId('open-search-button'));
    fireEvent.change(container.getByLabelText('Search for stream id'), { target: { value: '1234' } })
    fireEvent.submit(document.querySelector('form') as Element);
    expect(memoryHistory.push).toHaveBeenCalledWith('/find/1234');
  });
  
  it('should open the search input when the route contains a streamid', () => {
    const history = createMemoryHistory()
    history.push('/streams/streamid');
    
    const container = render(
        <Router history={history}>
          <Route path="/streams/:streamId?">
            <SearchBar fromPosition="1" halLinks={halLinks} />
          </Route>
        </Router>
      );

    expect(container.getByTestId('search-container')).toBeTruthy();
  });

  it('should close the search input when the route removes a streamid', async () => {
    const history = createMemoryHistory()
    history.push('/streams/streamid');
    
    const container = render(
        <Router history={history}>
          <Route path="/streams/:streamId?">
            <SearchBar fromPosition="1" halLinks={halLinks} />
          </Route>
        </Router>
      );

    expect(container.queryAllByTestId('search-container').length).toBeTruthy();

    history.push('/streams');
    
    await wait(() => {
      expect(container.queryAllByTestId('search-container').length).toBeFalsy();
    });
  });
});
