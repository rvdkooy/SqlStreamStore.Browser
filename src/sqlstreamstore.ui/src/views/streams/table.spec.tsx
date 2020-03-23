import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Table from './table';
import { HalResource, HalRestClient, URI } from 'hal-rest-client';

describe('Streams table specs', () => {
  it('should render its data', () => {
    const halClient = new HalRestClient();
    const first = new HalResource(halClient);
    first.prop('messageId', 1);
    first.link('streamStore:feed', new HalResource(halClient, new URI('/stream/1')));
    first.link('streamStore:message', new HalResource(halClient, new URI('/message/1')));
    const second = new HalResource(halClient);
    second.prop('messageId', 2);
    second.link('streamStore:feed', new HalResource(halClient, new URI('/stream/2')));
    second.link('streamStore:message', new HalResource(halClient, new URI('/message/2')));

    render(
      <MemoryRouter>
        <Table streams={[first, second]} />
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
