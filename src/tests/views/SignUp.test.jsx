/* eslint-disable */
import { render } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { SignUp } from '../../views/SignUp/SignUp';
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

const SignUpTest = () => {
    return (
        <MemoryRouter initialEntries={['/signup']}>
            <AuthContextProvider>
                <Routes>
                    <Route path={'/signup'} element={<SignUp />} />
                </Routes>
            </AuthContextProvider>
        </MemoryRouter>
    )
}

describe("SignUp", () => {
    describe("render", () => {
        it("should renders without crashing", () => {
            const { getByTestId } = render(<SignUpTest />);
            const signupContainer = getByTestId('signup-container');
            expect(signupContainer).toBeTruthy();
        })
    })

    describe("form", () => {
        const username = "test";
        const email = "test@epitech.eu";
        const password = "testmdp";

        it("should register", () => {
            const { getByTestId } = render(<SignUpTest />);
            const usernameInput = getByTestId('signup-username');
            const emailInput = getByTestId('signup-email');
            const passwordInput = getByTestId('signup-password');
            const confirmPasswordInput = getByTestId('signup-confirm-password');
            const submitButton = getByTestId('submit-button');

            usernameInput.value = username;
            emailInput.value = email;
            passwordInput.value = password;
            confirmPasswordInput.value = password;

            act(() => {
                submitButton.click();
            })

            expect(axios.post).toHaveBeenCalledWith('/register', { username, email, password, confirm_password: password });
        })
    })
})