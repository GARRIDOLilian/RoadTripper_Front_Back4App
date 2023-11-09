import React, { createContext, useContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { useStateWithLocalStorage } from '../utils/storage';

const AuthContext = createContext({});
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useStateWithLocalStorage('user', null);
  const [token, setToken] = useStateWithLocalStorage('token');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedActivities, setSavedActivities] = useState();
  const [urlSearch, setUrlSearch] = useState();

  const setSession = (accessToken) => {
    if (accessToken) {
      setToken(accessToken);
      setIsValid(true);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      setToken(null);
      setIsValid(false);
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  };

  const loginAPI = async (email, password) => {
    try {
      const result = await axiosInstance.post('/login', {
        email,
        password
      });
      setUser(result.data.user);
      setSession(result.data.token);
      return result;
    } catch (e) {
      if (e.response.data) {
        return `${e.response.status} ${e.response.data}`;
      }
      return e;
    }
  };

  const registerAPI = async (values) => {
    try {
      return await axiosInstance.post('/register', values);
    } catch (e) {
      if (e.response.data) {
        return `${e.response.status} ${e.response.data}`;
      }
      return new Error(e);
    }
  };

  const logout = () => {
    setSession(null);
    setUser(null);
  };

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        setSession(null);
        return false;
      }
    } catch (e) {
      setSession(null);
      return false;
    }
    if (!isValid) {
      setIsValid(true);
    }
    return true;
  };

  isTokenValid();

  const fetchAPI = async (
    url,
    method = 'GET',
    body = null,
    responseType = 'json',
    cancelToken
  ) => {
    try {
      isTokenValid();
      setIsLoading(true);
      const result = await axiosInstance({
        url,
        method,
        responseType,
        cancelToken,
        data: body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsLoading(false);
      return result;
    } catch (e) {
      setIsLoading(false);
      return e;
    }
  };

  const dispatchAPI = (type, options) => {
    switch (type) {
      case 'LOGIN':
        return loginAPI(options.email, options.password);
      case 'REGISTER':
        return registerAPI(options);
      case 'LOGOUT':
        return logout();
      case 'GET':
        return fetchAPI(
          options.url,
          'GET',
          null,
          options.responseType,
          options.cancelToken
        );
      case 'DELETE':
        return fetchAPI(options.url, 'DELETE');
      case 'POST':
      case 'PATCH':
        return fetchAPI(options.url, type, options.body);
      default:
        return new Error('Unknown dispatchAPI type!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isValid,
        dispatchAPI,
        isLoading,
        savedActivities,
        setSavedActivities,
        urlSearch,
        setUrlSearch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default () => useContext(AuthContext);
