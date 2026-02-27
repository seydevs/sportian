import { ListPlayers, DetailPlayers } from './features';

const routePlayers = [
  {
    path: '/players',
    element: <ListPlayers />,
  },
  {
    path: '/players/:id',
    element: <DetailPlayers />,
  },
];

export { routePlayers };
