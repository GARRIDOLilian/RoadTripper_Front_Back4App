/* eslint-disable */
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Maps from '../../views/Maps/Maps';
import { AuthContextProvider } from '../../contexts/AuthContext';

describe('TC - 3: Maps', () => {
  describe('TC - 3.1: Maps', () => {
    it('should renders without crashing', () => {
      const { getByTestId } = render(
        <MemoryRouter
          initialEntries={[
            '/map/Perpignan,%20Pyrénées-Orientales,%20France/Toulouse,%20Haute-Garonne,%20France/false/false/false/false/false/false/false'
          ]}
        >
          <AuthContextProvider>
            <Routes>
              <Route
                path={
                  '/map/:from/:to/:eats/:events/:accomodations/:transports/:bars/:culturals/:sports'
                }
                element={<Maps />}
              />
            </Routes>
          </AuthContextProvider>
        </MemoryRouter>
      );
      const mapContainer = getByTestId('map-container');
      expect(mapContainer).toBeTruthy();
    });
  });
});
