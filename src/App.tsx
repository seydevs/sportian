import { Routes, Route, Navigate } from 'react-router-dom';

import { routesApp } from './shared/routes';
import { MainLayout } from './shared/layouts';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/players" />} />
        {routesApp.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </MainLayout>
  );
}

export { App };
