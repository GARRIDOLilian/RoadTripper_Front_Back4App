/* eslint-disable */
import { render } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { Home } from '../../views/Home/Home';

describe("Home", () => {
    it("should renders without crashing", () => {
        const { getByTestId } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                </Routes>
            </MemoryRouter>
        );
        const homeContainer = getByTestId('home-container');
        expect(homeContainer).toBeTruthy();
    })
})