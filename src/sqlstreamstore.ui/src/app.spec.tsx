import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { triggerMessage } from './components/messages/snackBar';
import App from './App';

describe('App specs', () => {
  it('should show a snackbar message when triggered', () => {
    jest.spyOn(console, 'log').mockReturnValue();
    const container = render(<App />);
    
    act(() => {
      triggerMessage({
        message: 'test message',
        severity: 'info',
      });
    });
      
    expect(container.findByText('test message')).toBeTruthy();
  });
});
