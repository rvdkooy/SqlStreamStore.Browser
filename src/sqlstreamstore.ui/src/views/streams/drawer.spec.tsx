import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Drawer from './drawer';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import * as hal from '../../services/hal';
import flushPromises from '../../testUtils/flushPromises';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { HalRestClient, HalResource } from 'hal-rest-client';

describe('message drawer specs', () => {
  const halRestClient = new HalRestClient();
  const createMessageHalResult = () => {
    const halMessageResult = new HalResource(halRestClient);
    halMessageResult.prop('streamId', 'streamId');
    halMessageResult.prop('messageId', 'messageId');
    halMessageResult.prop('createdUtc', 'createdUtc');
    halMessageResult.prop('type', 'type');
    halMessageResult.prop('payload', { foo: 'bar' });
    return halMessageResult;
  };

  beforeEach(() => {
    jest.spyOn(hal, 'getHalClient').mockReturnValue(halRestClient);
  });

  it('should close the drawer when no messageId is provided', () => {
    const container = render(
      <MemoryRouter>
        <Drawer onCloseButtonClicked={jest.fn()} version={undefined} />
      </MemoryRouter>
    );

    expect(container.queryByTestId('drawer-content')).toBeFalsy()
  });

  it('renders the message when a message id is provided', async () => {
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(createMessageHalResult());

    await act(async () => {
      const history = createMemoryHistory();
      history.push('/streams/1/version1')
      const container = render(
        <Router history={history}>
          <Route path="/streams/1/version1">
            <Drawer onCloseButtonClicked={jest.fn()} version={'version1'} />
          </Route>
        </Router>
      );
      await flushPromises();

      expect(container.getByText('streamId')).toBeTruthy();
      expect(container.getByText('messageId')).toBeTruthy();
      expect(container.getByText('createdUtc')).toBeTruthy();
      expect(container.getByText('type')).toBeTruthy();
      expect(container.baseElement.innerHTML).toContain('foo');
      expect(container.baseElement.innerHTML).toContain('bar');
    });
  });

  it('should render a progress indicator when fetching the message', async () => {
    jest.spyOn(halRestClient, 'fetchResource');
    const history = createMemoryHistory();
    history.push('/streams/1/version1');

    const container = render(
      <Router history={history}>
        <Route path="/streams/1/version1">
          <Drawer onCloseButtonClicked={jest.fn()} version={'version1'} />
        </Route>
      </Router>
    );

    expect(container.getByRole('progressbar')).toBeTruthy();

    await act(async () => {
      await halRestClient.fetchResource;
    });
  });

  it('renders an error message when getting the message fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(halRestClient, 'fetchResource').mockRejectedValue(null);
    const history = createMemoryHistory();
    history.push('/streams/1/version1');

    await act(async () => {
      const container = render(
        <Router history={history}>
          <Route path="/streams/1/version1">
            <Drawer onCloseButtonClicked={jest.fn()} version={'version1'} />
          </Route>
        </Router>
      );
      await flushPromises();

      expect(container.getByText('An error occured while retrieving the message')).toBeTruthy();
    });
  });

  it('calls the onCloseButtonClicked when close button is clicked', async () => {
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(createMessageHalResult());
    const buttonClickSpy = jest.fn();
    const history = createMemoryHistory();
    history.push('/streams/1/version1');

    await act(async () => {
      render(
        <Router history={history}>
          <Route path="/streams/1/version1">
            <Drawer onCloseButtonClicked={buttonClickSpy} version={'version1'} />
          </Route>
        </Router>
      );

      await flushPromises();
      fireEvent.click(document.querySelector('button') as HTMLButtonElement);

      expect(buttonClickSpy).toHaveBeenCalled();
    });
  });

  it('should show when the payload cannot be parsed', async () => {
    const invalidHalMessageWithoutPayload = new HalResource(halRestClient);
    jest.spyOn(console, 'warn').mockReturnValue();
    jest.spyOn(halRestClient, 'fetchResource').mockResolvedValue(invalidHalMessageWithoutPayload);
    const buttonClickSpy = jest.fn();
    const history = createMemoryHistory();
    history.push('/streams/1/version1');

    await act(async () => {
      const container = render(
        <Router history={history}>
          <Route path="/streams/1/version1">
            <Drawer onCloseButtonClicked={buttonClickSpy} version={'version1'} />
          </Route>
        </Router>
      );

      await flushPromises();

      expect(container.getByText('Unable to parse json data')).toBeTruthy();
    });
  });
});
