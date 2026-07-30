import { HashRouter } from './router/router.ts';
import { MainLayout } from './layout/main-layout.ts';
import { LandingPage } from './pages/landing.ts';

const router = new HashRouter('app');

router.addLayout('/', MainLayout);

router.addRoute('/', LandingPage);
