import { createElement } from 'react';
import RootLayout from '../layouts/RootLayout';
import WelcomePage from '../pages/WelcomePage';

const routes = [
  {
    path: '/',
    element: createElement(RootLayout),
    children: [
      {
        path: '/',
        element: createElement(WelcomePage),
      },
      // Adicione mais rotas aqui
    ],
  },
];

export default routes;
