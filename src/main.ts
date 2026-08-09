import { router } from './core/router.ts';
import { MainLayout } from './layout/main-layout.ts';
import { DetailsPage } from './pages/details.ts';
import { PlaylistPage } from './pages/playlist.ts';
import { LandingPage } from './pages/landing.ts';
import { NotFoundPage } from './pages/not-found.ts';

router.addLayout('/', MainLayout);

router.addRoute('/', LandingPage);

router.addRoute('/details/:feedId', DetailsPage);

router.addRoute('/playlist', PlaylistPage);

router.setNotFound(NotFoundPage);