/* eslint-disable */
import { render } from '@testing-library/react';
import { Layout } from "../../components/Layout";

describe("Layout", () => {
    it("should renders without children", () => {
        const { getByTestId } = render(<Layout />);
        const layoutContainer = getByTestId('appbar');
        expect(layoutContainer).toBeTruthy();
    })

    it("should renders with children", () => {
        const { getByTestId } = render(
            <Layout>
                <p data-testid="layout-children">children</p>
            </Layout>
        );
        const layoutChildren = getByTestId('layout-children');
        expect(layoutChildren).toBeTruthy();
    })
})