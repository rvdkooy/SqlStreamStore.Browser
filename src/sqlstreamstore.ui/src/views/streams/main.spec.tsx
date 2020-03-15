import React from 'react';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { render, act } from '@testing-library/react';
import Main from './main';
import streamsApi from '../../services/streamsApi';
import flushPromises from '../../testUtils/flushPromises';

jest.mock('./table', () => {
  return () => <div data-testid="mocked-table"></div>
});

describe('Main specs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a progress indicator when fetching the streams', async () => {
    jest.spyOn(streamsApi, 'getStreams').mockResolvedValue([]);
    const history = createMemoryHistory()
    history.push('/streams');

    const container = render(
      <Router history={history}>
        <Route path="/streams">
          <Main />
        </Route>
      </Router>
    );
    expect(container.getByRole('progressbar')).toBeTruthy();

    await act(async () => {
      await streamsApi.getStreams;
    });
  });

  it('should render the streams table when streams are fetched', async () => {
    jest.spyOn(streamsApi, 'getStreams').mockResolvedValue([]);
    await act(async () => {

      const container = render(
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      );
      await flushPromises();
      expect(container.getByTestId('mocked-table')).toBeTruthy();
    });
  });

  it('should fetch the streams again when streamid changes', async () => {
    await act(async () => {
      jest.spyOn(streamsApi, 'getStreams').mockResolvedValue([]);
      const history = createMemoryHistory()
      history.push('/streams/1');

      render(
        <Router history={history}>
          <Route path="/streams/:streamId?">
            <Main />
          </Route>
        </Router>
      );
      await flushPromises();
      history.push('/streams/2');
      await flushPromises();

      expect(streamsApi.getStreams).toHaveBeenCalledTimes(2);
      expect(streamsApi.getStreams).toHaveBeenNthCalledWith(1, '1');
      expect(streamsApi.getStreams).toHaveBeenNthCalledWith(2, '2');
    });
  });

  it('should render an error message when fetching failed', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(streamsApi, 'getStreams').mockRejectedValue('');
    const container = render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
    await flushPromises();
    expect(container.getByText(/An error occured while retrieving streams/)).toBeTruthy();

    await act(async () => {
      await streamsApi.getStreams;
    });
  });
});
