/* eslint-disable */
import React from 'react';
import { render } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { SignIn } from '../../views/SignIn/SignIn';
import { AuthContextProvider } from '../../contexts/AuthContext';

jest.mock('axios', () => ({
    post: jest.fn((url, body) => Promise.resolve({ data: { token: 'token', user: 'user' } })),
    create: jest.fn(() => {
        let axiosInstance = require('axios');
        return axiosInstance;
    })
}));
import axios from 'axios';
import { act } from 'react-dom/test-utils';

const SignInTest = () => {
    return (
        <MemoryRouter initialEntries={['/signin']}>
            <AuthContextProvider>
                <Routes>
                    <Route path={'/signin'} element={<SignIn />} />
                </Routes>
            </AuthContextProvider>
        </MemoryRouter>
    )
}

describe("SignIn", () => {
    describe("render", () => {
        it("should renders without crashing", () => {
            const { getByTestId } = render(<SignInTest />);
            const signinContainer = getByTestId('signin-container');
            expect(signinContainer).toBeTruthy();
        })
    })

    describe("form", () => {
        const email = "test@epitech.eu";
        const password = "testmdp";

        it("should login", () => {
            const { getByTestId } = render(<SignInTest />);
            const emailInput = getByTestId('signin-email');
            const passwordInput = getByTestId('signin-password');
            const submitButton = getByTestId('submit-button');

            emailInput.value = email;
            passwordInput.value = password;

            act(() => {
                submitButton.click();
            })

            expect(axios.post).toHaveBeenCalledWith('/login', { email, password });
        })
    })
})