import { Routes, Route } from 'react-router-dom';

import { routesApp } from './shared/routes';
import { MainLayout } from './shared/layouts';

function App() {
  return (
    <MainLayout>
      <Routes>
        {routesApp.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </MainLayout>
  );
}

export { App };
