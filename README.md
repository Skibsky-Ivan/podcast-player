# Podcast Player

## Tasks [RSSchool Stage 0.5 — Podcast Player](https://github.com/rolling-scopes-school/tasks/blob/master/stage0.5%20Bootcamp/tasks/podcast-player/README.md)

<img width="160" height="81" alt="изображение" src="https://github.com/user-attachments/assets/151adcda-4dfe-47bd-94f4-3a41350faf1a" />
<img width="160" height="81" alt="изображение" src="https://github.com/user-attachments/assets/cc9722ea-0d1b-4466-8758-7a1e81b9c873" />
<img width="160" height="81" alt="изображение" src="https://github.com/user-attachments/assets/63f6fedd-9586-43a3-84e9-139b15ecdd8f" />


## [Deployment](https://skibsky-ivan.github.io/podcast-player/)

---

## Section 1 — Landing page and search (40/40)

* [x] The landing page loads and renders a list of podcasts fetched from the Podcast Index API
* [x] Each podcast tile shows: cover image, title, author/feed name
* [x] A search input is present on the landing page
* [x] When the search input is empty, the default podcast list is shown
* [x] When the search input has a value, search results are displayed
* [x] Search requests are debounced (verified in DevTools Network tab)
* [x] A loading indicator is shown while a request is in flight

## Section 2 — Podcast details page (25/25)

* [x] Clicking a podcast tile navigates to a details page for that podcast
* [x] The details page lists episodes for the selected podcast
* [x] Each episode item shows: title, publication date, duration
* [x] An in-app control (Header nav / logo) returns the user to the landing page without using the browser's "Back" button

## Section 3 — Podcast player (45/45)

* [x] Selecting an episode starts playback in the player
* [x] The player has a working Play / Pause toggle button
* [x] The player shows current time and total time
* [x] The player has a progress bar that updates as the audio plays
* [x] Clicking the progress bar seeks the audio to the clicked position
* [x] The player stays visible on screen during navigation between pages
* [x] The user can use search and browse episode lists while audio continues playing without interruption
* [x] Selecting a different episode replaces the current stream with the new one (no double-playback)

## Section 4 — Memory and playlist (30/30)

* [x] A playlist page exists and is reachable from the app's navigation
* [x] The user can add an episode to the playlist from the details page
* [x] The user can remove an episode from the playlist
* [x] The playlist contents persist across page reloads (stored in localStorage)
* [x] The playback position of the currently playing episode is stored in localStorage
* [x] When the user returns to a previously listened episode, playback resumes from roughly 10 seconds before the last saved position

## Penalties

* [x] No UI framework used (Vanilla TypeScript, no React/Vue/Angular/Svelte)
* [x] Page transitions do not cause full reloads (SPA with custom HistoryRouter)
* [x] No console errors during normal use
* [x] Layout is correct on the latest Chrome at a 1280px viewport

---

## Technical Stack

* **Language:** TypeScript
* **Bundler:** Vite
* **API:** Podcast Index API
* **Architecture:** Custom Component-based framework (no external UI libraries)
* **Routing:** Custom HistoryRouter (SPA, no hash)
* **State:** Global Store with pub/sub pattern
* **Persistence:** localStorage (playlist & playback positions)