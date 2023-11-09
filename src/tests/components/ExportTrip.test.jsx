/* eslint-disable */
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ExportTrip from '../../components/ExportTrip/ExportTrip';

describe("ExportTrip", () => {

    const location = {
        from: "Toulouse",
        waypoints: [
            "Carcassone",
            "Montpellier"
        ],
        to: "Perpignan"
    }
    const activities = {
        Restaurants: ["Resto 1", "Resto 2"]
    }
    const onClose = jest.fn();
    const onDownload = jest.fn();

    describe("Render", () => {
        it("should renders", () => {
            const { getByTestId } = render(
                <ExportTrip
                    open={true}
                    onClose={onClose}
                    onDownload={onDownload}
                    location={location}
                    activities={activities}
                />
            );
            const layoutContainer = getByTestId('exporttrip-container');
            expect(layoutContainer).toBeTruthy();
        })

        it("should not renders", () => {
            const { queryByTestId } = render(
                <ExportTrip
                    open={false}
                    onClose={onClose}
                    onDownload={onDownload}
                    location={location}
                    activities={activities}
                />
            );
            const layoutContainer = queryByTestId('exporttrip-container');
            expect(layoutContainer).toBeNull();
        })
    })

    describe("Buttons", () => {
        it("should call onClose", () => {
            const { getByTestId } = render(
                <ExportTrip
                    open={true}
                    onClose={onClose}
                    onDownload={onDownload}
                    location={location}
                    activities={activities}
                />
            );
            const btnClose = getByTestId("exporttrip-btn-close");

            act(() => {
                btnClose.click();
            })

            expect(onClose).toHaveBeenCalledTimes(1)
        })

        it("should call onDownload", () => {
            const { getByTestId } = render(
                <ExportTrip
                    open={true}
                    onClose={onClose}
                    onDownload={onDownload}
                    location={location}
                    activities={activities}
                />
            );
            const btnDownload = getByTestId("exporttrip-btn-download");

            act(() => {
                btnDownload.click();
            })

            expect(onDownload).toHaveBeenCalledTimes(1)
        })
    })
})