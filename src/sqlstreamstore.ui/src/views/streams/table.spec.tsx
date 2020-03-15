import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { StreamResponse } from '../../services/streamsApi';
import Table from './table';

describe('Streams table specs', () => {
  it('should render its data', () => {
    const created = new Date().toUTCString();
    const streams = [
      StreamResponse.fromJson({ streamId: '1', messageId: '1', createdUtc: created, streamVersion: '1', type: '1', position: '1' }),
      StreamResponse.fromJson({ streamId: '2', messageId: '2', createdUtc: created, streamVersion: '2', type: '2', position: '2' }),
    ];
    
    render(
      <MemoryRouter>
        <Table streams={streams} />
      </MemoryRouter>
    );

    expect(document.querySelectorAll('table tbody tr').length).toBe(2);
  });

  it('should tell when there is no data', () => {
    const container = render(
      <MemoryRouter>
        <Table streams={[]} />
      </MemoryRouter>
    );

    expect(container.getByText(/No results/)).toBeTruthy();
  });
});
