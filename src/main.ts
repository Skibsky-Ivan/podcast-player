import { router } from './core/router.ts';
import { MainLayout } from './layout/main-layout.ts';
import { LandingPage } from './pages/landing.ts';

router.addLayout('/', MainLayout);

router.addRoute('/', LandingPage);
