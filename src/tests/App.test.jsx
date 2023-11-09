/* eslint-disable */
import { render } from '@testing-library/react';
import App from '../App';

describe("App", () => {
  it("should renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  })
})