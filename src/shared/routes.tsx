import { Navigate } from 'react-router-dom';
import { routePlayers } from '../modules/players/route';

const routesApp = [
  ...routePlayers,
  {
    path: '/',
    element: <Navigate to="/players" replace />,
  },
];

export { routesApp };
