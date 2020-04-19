import React from 'react';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { render, act } from '@testing-library/react';
import Main from './main';
import * as hal from '../../services/hal';
import flushPromises from '../../testUtils/flushPromises';
import { HalRestClient, HalResource, URI } from 'hal-rest-client';

jest.mock('./table', () => {
  return () => <div data-testid="mocked-table"></div>
});

describe('Main specs', () => {
  const halRestClient = new HalRestClient();
  
  beforeEach(() => {
    jest.spyOn(hal, 'getHalClient').mockReturnValue(halRestClient);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a progress indicator when fetching the streams', async () => {
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(new HalResource(halRestClient, new URI('/')));
    const history = createMemoryHistory()
    history.push('/stream');

    const container = render(
      <Router history={history}>
        <Route path="/stream">
          <Main />
        </Route>
      </Router>
    );
    expect(container.getByRole('progressbar')).toBeTruthy();

    await act(async () => {
      await halRestClient.fetchResource;
    });
  });

  it('should render the streams table when streams are fetched', async () => {
    const halResourceWithMessages = new HalResource(halRestClient, new URI('/'));
    halResourceWithMessages.prop('streamStore:message', []);
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(halResourceWithMessages);

    const container = render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      expect(container.getByTestId('mocked-table')).toBeTruthy();
    });
  });

  it('should fetch the streams again when streamid changes', async () => {
    const halResourceWithMessages = new HalResource(halRestClient, new URI('/'));
    halResourceWithMessages.prop('streamStore:message', []);
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(halResourceWithMessages);

    const history = createMemoryHistory()
    history.push('/stream/1');

    render(
      <Router history={history}>
        <Route path="/stream/:streamId?">
          <Main />
        </Route>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      history.push('/stream/2');
      await flushPromises();

      expect(halRestClient.fetchResource).toHaveBeenCalledTimes(2);
      expect(halRestClient.fetchResource).toHaveBeenNthCalledWith(1, './stream/1');
      expect(halRestClient.fetchResource).toHaveBeenNthCalledWith(2, './stream/2');
    });
  });

  it('should render an error message when fetching failed', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(halRestClient, 'fetchResource').mockRejectedValue('');

    const container = render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
    await flushPromises();
    expect(container.getByText(/An error occured while retrieving streams/)).toBeTruthy();

    await act(async () => {
      await halRestClient.fetchResource;
    });
  });
});
