import { render } from '@testing-library/react';

import ChatMessage from './chat-message';

describe('ChatMessage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChatMessage />);
    expect(baseElement).toBeTruthy();
  });
});
