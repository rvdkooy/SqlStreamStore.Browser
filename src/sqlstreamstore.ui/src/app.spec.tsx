import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { triggerSuccessMessage, triggerErrorMessage } from './components/messages/snackBar';
import App from './App';

describe('App specs', () => {
  it('should show a successfull snackbar message when triggered', () => {
    jest.spyOn(console, 'log').mockReturnValue();
    const container = render(<App />);
    
    act(() => {
      triggerSuccessMessage('test message');
    });
      
    expect(container.findByText('test message')).toBeTruthy();
  });

  it('should show an error snackbar message when triggered', () => {
    jest.spyOn(console, 'log').mockReturnValue();
    const container = render(<App />);
    
    act(() => {
      triggerErrorMessage('test message');
    });
      
    expect(container.findByText('test message')).toBeTruthy();
  });
});
