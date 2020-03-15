import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Drawer from './drawer';
import streamsApi, { StreamMessage } from '../../services/streamsApi';
import { act } from 'react-dom/test-utils';
import flushPromises from '../../testUtils/flushPromises';

describe('message drawer specs', () => {
  it('should close the drawer when no messageId is provided', () => {
    const container = render(
      <Drawer onCloseButtonClicked={jest.fn()} streamId={'1234'} messageId={undefined} />
    );

    expect(container.queryByTestId('drawer-content')).toBeFalsy()
  });

  it('renders the message when a message id is provided', async () => {
    jest.spyOn(streamsApi, 'getMessage').mockResolvedValue(StreamMessage.fromJson({
      streamId: 'streamId',
      messageId: 'messageId',
      createdUtc: new Date().toUTCString(),
      streamVersion: 'streamVersion',
      type: 'type',
      position: 'position',
      jsonData: JSON.stringify({ foo: 'bar' }),
    }));

    await act(async () => {
      const container = render(
        <Drawer onCloseButtonClicked={jest.fn()} streamId={'1234'} messageId={'5678'} />
      );
      await flushPromises();
      
      expect(streamsApi.getMessage).toHaveBeenCalledWith('1234', '5678');
      
      expect(container.getByText('streamId')).toBeTruthy();
      expect(container.getByText('messageId')).toBeTruthy();
      expect(container.getByText('streamId')).toBeTruthy();
      expect(container.getByText('type')).toBeTruthy();
      expect(container.baseElement.innerHTML).toContain('foo');
      expect(container.baseElement.innerHTML).toContain('bar');
    });
  });

  it('calls the onCloseButtonClicked when close button is clicked', async () => {
    const buttonClickSpy = jest.fn();
    
    await act(async () => {
      render(
        <Drawer onCloseButtonClicked={buttonClickSpy} streamId={'1234'} messageId={'5678'} />
      );
      await flushPromises();
      fireEvent.click(document.querySelector('button') as HTMLButtonElement);

      expect(buttonClickSpy).toHaveBeenCalled();
    });
  });
});
