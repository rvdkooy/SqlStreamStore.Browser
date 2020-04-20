import React from 'react';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { render, act, fireEvent, wait } from '@testing-library/react';
import Main from './main';
import * as hal from '../../services/hal';
import flushPromises from '../../testUtils/flushPromises';
import { HalRestClient, HalResource, URI } from 'hal-rest-client';
import * as snackBar from '../../components/messages/snackBar';

describe('Main specs', () => {
  let defaultHalresponse: HalResource;
  const halRestClient = new HalRestClient();
  
  beforeEach(() => {
    jest.spyOn(hal, 'getHalClient').mockReturnValue(halRestClient);
    defaultHalresponse = new HalResource(halRestClient, new URI('/'));
    const messageOne = new HalResource(halRestClient, new URI('/row1'));
    messageOne.link('streamStore:feed', new HalResource(halRestClient, new URI('/feed')));
    messageOne.link('streamStore:message', new HalResource(halRestClient, new URI('/message')));
    messageOne.prop('messageId', '1');
    defaultHalresponse.prop('streamStore:message', [ messageOne ]);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a progress indicator when fetching the streams', async () => {
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(defaultHalresponse);
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
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(defaultHalresponse);

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      expect(document.querySelectorAll('table tbody tr').length).toBe(1);
    });
  });

  it('should fetch the streams again when streamid changes', async () => {
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(defaultHalresponse);

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

  it('should show when a stream is successfully deleted', async () => {
    const history = createMemoryHistory()
    history.push('/stream/1');
    defaultHalresponse.prop('streamStore:delete-stream', {});
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(defaultHalresponse);
    jest.spyOn(defaultHalresponse, 'delete').mockResolvedValue(null);
    jest.spyOn(history, 'push');
    jest.spyOn(snackBar, 'triggerMessage');

    const container = render(
      <Router history={history}>
        <Route path="/stream/:streamId?">
          <Main />
        </Route>
      </Router>
    );
    await flushPromises();
    
    fireEvent.click(container.getByTestId('delete-stream-button'));
    fireEvent.click(container.getByTestId('confirm-button'));
    
    await wait(() => {
      expect(defaultHalresponse.delete).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith('/stream');
      expect(snackBar.triggerMessage).toHaveBeenCalledWith({
        message: 'Successfully deleted the stream',
        severity: 'success',
      });
    });
  });

  it('should show when a stream is NOT successfully deleted', async () => {
    const history = createMemoryHistory()
    history.push('/stream/1');
    defaultHalresponse.prop('streamStore:delete-stream', {});
    jest.spyOn(console, 'error').mockReturnValue();
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(defaultHalresponse);
    jest.spyOn(defaultHalresponse, 'delete').mockRejectedValue(null);
    jest.spyOn(history, 'push');
    jest.spyOn(snackBar, 'triggerMessage');

    const container = render(
      <Router history={history}>
        <Route path="/stream/:streamId?">
          <Main />
        </Route>
      </Router>
    );
    await flushPromises();
    
    fireEvent.click(container.getByTestId('delete-stream-button'));
    fireEvent.click(container.getByTestId('confirm-button'));
    
    await wait(() => {
      expect(defaultHalresponse.delete).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith('/stream');
      expect(snackBar.triggerMessage).toHaveBeenCalledWith({
        message: 'Couldn\'t delete the stream',
        severity: 'error',
      });
    });
  });
});
