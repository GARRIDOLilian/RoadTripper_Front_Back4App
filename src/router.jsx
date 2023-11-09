import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Home } from './views/Home/Home';
import { SignUp } from './views/SignUp/SignUp';
import { SignIn } from './views/SignIn/SignIn';
import Maps from './views/Maps/Maps';
import { Profile } from './views/Profile/Profile';
import { Trip } from './views/Trip/Trip';

const routes = [
  {
    path: '/',
    component: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: '/signup',
    component: <SignUp />
  },
  {
    path: '/signin',
    component: <SignIn />
  },
  {
    path: '/map/:from/:to/:eats/:events/:accomodations/:transports/:bars/:culturals/:sports',
    component: <Maps />
  },
  {
    path: '/map',
    component: <Maps />
  },
  {
    path: '/profile/:id',
    component: <Profile />
  },
  {
    path: '/trip/:id',
    component: <Trip />
  }
];

// eslint-disable-next-line require-jsdoc
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
