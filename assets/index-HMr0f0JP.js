(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`/podcast-player`,t=new class{routes=[];layouts=[];rootElement;listeners=[];currLayout=null;currPage=null;currLayoutClass=null;constructor(e){let t=document.getElementById(e);if(!t)throw Error(`Контейнер с id "${e}" не найден в DOM!`);this.rootElement=t,window.addEventListener(`popstate`,()=>this.handleRoute()),window.addEventListener(`load`,()=>this.handleRoute()),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[data-link]`);if(t){let n=t.getAttribute(`href`);if(!n)return;let r=new URL(n,window.location.href);if(r.origin!==window.location.origin)return;e.preventDefault(),this.navigate(r.pathname+r.search+r.hash)}})}addRoute(e,t){let n=[],r=e.replace(/:(\w+)/g,(e,t)=>(n.push(t),`([^/]+)`)),i=RegExp(`^${r}$`);this.routes.push({path:e,regex:i,paramNames:n,pageClass:t})}addLayout(e,t){this.layouts.push({prefix:e,layoutClass:t}),this.layouts.sort((e,t)=>t.prefix.length-e.prefix.length)}matchRoute(e){for(let t of this.routes){let n=e.match(t.regex);if(n){let e={};return t.paramNames?.forEach((t,r)=>{e[t]=n[r+1]}),{route:t,params:e}}}return null}resolvePageClass(e){let t=this.matchRoute(e);if(t)return{PageClass:t.route.pageClass,params:t.params};let n=this.routes.find(e=>e.path===`/404`);if(n)return{PageClass:n.pageClass,params:{}};throw Error(`Не найден pageClass для маршрута "${e}" и не зарегистрирован /404`)}resolveLayout(e){let t=this.layouts.find(t=>e.startsWith(t.prefix));if(!t)throw Error(`Не найден layoutClass для префикса пути "${e}"`);return t.layoutClass}switchLayout(e){this.currLayoutClass!==e&&(this.currLayout?.unmount(),this.currLayout=new e,this.currLayout.mount(this.rootElement),this.currLayoutClass=e)}renderPage(e,t){if(this.currPage&&=(this.currPage.unmount(),null),!this.currLayout)throw Error(`Не удалось инициализировать Layout`);let n=this.currLayout.element.querySelector(`#outlet`);if(!n)throw Error(`Элемент #outlet не найден в макете (Layout)`);this.currPage=new e(t),this.currPage.mount(n)}handleRoute(){let t=window.location.pathname;t.startsWith(e)&&(t=t.slice(15)||`/`);let{PageClass:n,params:r}=this.resolvePageClass(t),i=this.resolveLayout(t);this.switchLayout(i),this.renderPage(n,r),this.listeners.forEach(e=>e(t,r))}onRouterChange(t){this.listeners.push(t);let n=window.location.pathname;return n.startsWith(e)&&(n=n.slice(15)||`/`),t(n,{}),()=>{this.listeners=this.listeners.filter(e=>e!==t)}}navigate(t){let n=e+t;window.location.pathname+window.location.search+window.location.hash!==n&&(window.history.pushState({},``,n),this.handleRoute())}}(`app`),n=class{props;state;element;constructor(e={}){let{tagName:t=`div`,className:n=``,dataset:r={},props:i={}}=e;this.props=i,this.state={},this.element=document.createElement(t),n&&(this.element.className=n),r&&Object.assign(this.element.dataset,r)}setState(e){let t={...this.state};this.state={...t,...e},this.onStateChanges(t,this.state),this.update()}onStateChanges(e,t){}onMount(){}onUnmount(){}render(){return``}update(){this.element.innerHTML=this.render(),this.afterRender()}afterRender(){}mount(e){this.update(),e.appendChild(this.element),this.onMount()}unmount(){this.onUnmount(),this.element.remove()}},r=class extends n{unsubscribe=null;constructor(){super({tagName:`header`,className:`header container`})}onMount(){this.unsubscribe=t.onRouterChange(e=>{this.updateActiveClass(e)})}onUnmount(){this.unsubscribe?.()}updateActiveClass(e){this.element.querySelectorAll(`.nav-link`).forEach(t=>{let n=t.getAttribute(`href`)||``,r=e===n||e.startsWith(`${n}/`);t.classList.toggle(`active`,r)})}render(){return`
      <a href="/" class="logo" data-link>
        <span class="icon icon-audio-wave logo-icon"></span>
        <span class="logo-text">AudioWave</span>
      </a>
      <nav class="nav">
        <a href="/" class="nav-link" data-link>
          <span class="icon icon-home"></span>
          <span>Home</span>
        </a>
        <a href="/playlist" class="nav-link" data-link>
          <span class="icon icon-playlist"></span>
          <span>Playlist</span>
        </a>
      </nav>
    `}},i=new class{state={podcasts:[],currPodcast:null,episodes:[],currEpisode:null,isPlaying:!1};listiners=[];getState(){return this.state}setState(e){this.state={...this.state,...e},this.notify()}getPodcastById(e){return this.state.podcasts.find(t=>String(t.id)===e)}subscribe(e){return this.listiners.push(e),()=>{this.listiners=this.listiners.filter(t=>t!==e)}}notify(){this.listiners.forEach(e=>e(this.state))}};function a(e){if(!e)return`00:00`;let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=Math.floor(e%60),i=e=>String(e).padStart(2,`0`);return t>0?`${i(t)}:${i(n)}:${i(r)}`:`${i(n)}:${i(r)}`}var o=`podcast-positions`,s=`podcast-playlist`;function c(){try{let e=localStorage.getItem(o);return e&&JSON.parse(e)||{}}catch{return{}}}function l(e){let t=c()[e];return typeof t==`number`&&t>0?t:null}function u(e,t){let n=c();n[e]=Math.floor(t),localStorage.setItem(o,JSON.stringify(n))}function d(e){let t=c();delete t[e],localStorage.setItem(o,JSON.stringify(t))}function f(){try{let e=localStorage.getItem(s);return e&&JSON.parse(e)||[]}catch{return[]}}function p(e){let t=f();if(t.some(t=>t.episode.id===e.episode.id))return;let n=[e,...t];localStorage.setItem(s,JSON.stringify(n))}function m(e){let t=f().filter(t=>t.episode.id!==e);localStorage.setItem(s,JSON.stringify(t))}function h(e){return f().some(t=>t.episode.id===e)}var g=class extends n{audio=document.createElement(`audio`);goToPodcastBtn=null;playBtn=null;playIcon=null;progressBar=null;timeDisplay=null;titleEl=null;coverEl=null;volumeSlider=null;speedSlider=null;isDragging=!1;pendingSeek=null;unsubscribe=null;onLoadedMetadata=()=>{if(this.progressBar&&(this.progressBar.max=String(this.audio.duration)),this.pendingSeek!==null){let e=Math.max(0,this.pendingSeek);this.audio.currentTime=e,this.progressBar&&(this.progressBar.value=String(e)),this.timeDisplay&&(this.timeDisplay.textContent=`${a(e)} / ${this.state.currEpisode?.duration}`),this.pendingSeek=null}};onTimeUpdate=()=>{let e=Math.floor(this.audio.currentTime);if(this.timeDisplay&&(this.timeDisplay.textContent=`${a(e)} / ${this.state.currEpisode?.duration}`),!this.isDragging&&(this.progressBar&&(this.progressBar.value=String(e),this.updateSliderProgress(this.progressBar)),e>0&&e%3==0)){let t=this.state.currEpisode;t&&u(t.id,e)}};onEnded=()=>{let e=this.state.currEpisode;e&&d(e.id),i.setState({isPlaying:!1})};onPlayClick=()=>{i.setState({isPlaying:!i.getState().isPlaying})};onProgressChange=()=>{this.audio.currentTime=Number(this.progressBar?.value),this.progressBar&&this.updateSliderProgress(this.progressBar)};onProgressMouseDown=()=>{this.isDragging=!0};onMouseUp=()=>{this.isDragging=!1};onGoToPodcast=()=>{let e=i.getState().currEpisode?.podcastId;e&&t.navigate(`/details/${e}`)};onVolumeInput=()=>{this.audio.volume=Number(this.volumeSlider?.value)};onSpeedInput=()=>{this.audio.playbackRate=Number(this.speedSlider?.value)};updateSliderProgress(e){let t=Number(e.min),n=Number(e.max),r=(Number(e.value)-t)/(n-t)*100;e.style.setProperty(`--progress`,`${r}%`)}persistPlaybackPosition=()=>{let e=i.getState().currEpisode,t=this.audio.currentTime;e&&t>0&&u(e.id,t)};constructor(){super({tagName:`aside`,className:`player`}),this.state={currEpisode:i.getState().currEpisode,isPlaying:!1}}onMount(){this.element.appendChild(this.audio),this.unsubscribe=i.subscribe(e=>{this.handleStoreChange(e)}),this.audio.addEventListener(`loadedmetadata`,this.onLoadedMetadata),this.audio.addEventListener(`timeupdate`,this.onTimeUpdate),this.audio.addEventListener(`ended`,this.onEnded),this.playBtn?.addEventListener(`click`,this.onPlayClick),this.progressBar?.addEventListener(`change`,this.onProgressChange),this.progressBar?.addEventListener(`mousedown`,this.onProgressMouseDown),this.goToPodcastBtn?.addEventListener(`click`,this.onGoToPodcast),this.volumeSlider?.addEventListener(`input`,this.onVolumeInput),this.speedSlider?.addEventListener(`input`,this.onSpeedInput),[this.volumeSlider,this.speedSlider].forEach(e=>{e&&(this.updateSliderProgress(e),e.addEventListener(`input`,()=>this.updateSliderProgress(e)))}),window.addEventListener(`beforeunload`,this.persistPlaybackPosition),document.addEventListener(`mouseup`,this.onMouseUp)}handleStoreChange(e){let t=this.state.currEpisode?.id,n=e.currEpisode;if(this.element.classList.toggle(`player--empty`,!n),t!==n?.id)if(this.pendingSeek=null,n){this.audio.src=n.audioUrl,this.progressBar&&(this.progressBar.value=`0`,this.updateSliderProgress(this.progressBar));let t=l(n.id);t!==null&&(this.pendingSeek=Math.max(0,t-10)),this.titleEl&&(this.titleEl.textContent=n.title||``),this.coverEl&&(this.coverEl.src=n.coverUrl||``),this.timeDisplay&&(this.timeDisplay.textContent=`00:00 / ${n.duration}`),e.isPlaying&&this.audio.play()}else this.audio.src=``,this.titleEl&&(this.titleEl.textContent=`Выберите эпизод`),this.coverEl&&(this.coverEl.src=``),this.progressBar&&(this.progressBar.value=`0`),this.timeDisplay&&(this.timeDisplay.textContent=`00:00 / 00:00`);else e.isPlaying!==this.state.isPlaying&&(e.isPlaying?this.audio.play():this.audio.pause());this.playIcon&&(this.playIcon.className=e.isPlaying?`icon icon-pause`:`icon icon-play`),this.state={currEpisode:e.currEpisode,isPlaying:e.isPlaying}}onUnmount(){this.audio.removeEventListener(`loadedmetadata`,this.onLoadedMetadata),this.audio.removeEventListener(`timeupdate`,this.onTimeUpdate),this.audio.removeEventListener(`ended`,this.onEnded),this.playBtn?.removeEventListener(`click`,this.onPlayClick),this.progressBar?.removeEventListener(`change`,this.onProgressChange),this.progressBar?.removeEventListener(`mousedown`,this.onProgressMouseDown),this.goToPodcastBtn?.removeEventListener(`click`,this.onGoToPodcast),this.volumeSlider?.removeEventListener(`input`,this.onVolumeInput),this.speedSlider?.removeEventListener(`input`,this.onSpeedInput),window.removeEventListener(`beforeunload`,this.persistPlaybackPosition),document.removeEventListener(`mouseup`,this.onMouseUp),this.unsubscribe?.()}render(){return`
      <input type="range" class="player-progress-top" min="0" max="0" value="0">

      <div class="player-left">
        <button class="control-btn" id="go-to-podcast-btn" title="переход к подкасту">
          <span class="icon icon-previous"></span>
        </button>
        <button class="control-btn" id="play-btn" title="Играть / Пауза">
          <span class="icon icon-play"></span>
        </button>

        <span class="time-display">00:00 / 00:00</span>
      </div>

      <div class="player-center">
        <div class="player-cover-container">
          <img class="player-cover" src="" alt="" loading="lazy" />
        </div>
        <div class="player-text">
          <h2 class="player-title">Выберите эпизод</h2>
        </div>
      </div>

      <div class="player-right">
        <div class="player-volume-wrapper">
          <button class="control-btn" id="volume-btn" title="Громкость">
            <span class="icon icon-volume"></span>
          </button>
          <input type="range" class="player-slider player-volume-slider" 
                min="0" max="1" step="0.1" value="1">
        </div>
        <div class="player-speed-wrapper">
          <button class="control-btn" id="speed-btn" title="Скорость">
            <span class="icon icon-speed"></span>
          </button>
          <input type="range" class="player-slider player-speed-slider" 
                min="0.5" max="2" step="0.25" value="1">
        </div>
      </div> 
    `}afterRender(){this.goToPodcastBtn=this.element.querySelector(`#go-to-podcast-btn`),this.playBtn=this.element.querySelector(`#play-btn`),this.playIcon=this.element.querySelector(`#play-btn .icon`),this.progressBar=this.element.querySelector(`.player-progress-top`),this.timeDisplay=this.element.querySelector(`.time-display`),this.titleEl=this.element.querySelector(`.player-title`),this.coverEl=this.element.querySelector(`.player-cover`),this.volumeSlider=this.element.querySelector(`.player-volume-slider`),this.speedSlider=this.element.querySelector(`.player-speed-slider`)}},_=class extends n{header=null;player=null;render(){return`
      <div id="header-slot"></div>
      
      <div id="outlet"></div>

      <div id="player-slot"></div>
    `}afterRender(){let e=this.element.querySelector(`#header-slot`);e&&!this.header&&(this.header=new r,this.header.mount(e));let t=this.element.querySelector(`#player-slot`);t&&!this.player&&(this.player=new g,this.player.mount(t))}onUnmount(){this.header?.unmount(),this.header=null,this.player?.unmount(),this.player=null}},v=class extends n{constructor(e){super({tagName:`section`,className:`podcast-hero`,props:e})}render(){let e=this.props;return`
      <div class="container hero-container">
        <div class="hero-cover">
          <img 
            class="hero-img" 
            src="${e.coverUrl||``}" 
            alt="" 
          />
        </div>
        <div class="hero-details">
          <h1 class="podcast-title">
            ${e.title||`Название подкаста`}
          </h1>
          <div class="podcast-meta-author">
            ${e.author?`<span class="author-name">${e.author}</span>`:``}
          </div>
        </div>
      </div>
    `}};async function y(){let e=Math.round(Date.now()/1e3).toString();console.log(`C3QKX2H7EPFD6XKV4URY`),console.log(`rAh3a^QhQLYjhu#3bT7hz4m4ZY2rSfG5s$hSEwzQ`);let t=`C3QKX2H7EPFD6XKV4URYrAh3a^QhQLYjhu#3bT7hz4m4ZY2rSfG5s$hSEwzQ`+e,n=new TextEncoder().encode(t),r=await crypto.subtle.digest(`SHA-1`,n);return{"User-Agent":`podcast-player/1.0.0`,"X-Auth-Key":`C3QKX2H7EPFD6XKV4URY`,"X-Auth-Date":e,Authorization:[...new Uint8Array(r)].map(e=>e.toString(16).padStart(2,`0`)).join(``)}}function b(e){return{id:String(e?.id??``),title:e?.title||`Без названия`,author:e?.author||`Неизвестен`,coverUrl:e?.artwork||e?.image||``}}function x(e){let t=Number(e?.duration)||null;return{id:String(e?.id??``),title:e?.title||`Без названия`,duration:a(t),durationSec:t,pubDate:e?.datePublished?new Date(e.datePublished*1e3).toLocaleDateString(`ru-RU`):`—`,audioUrl:e?.enclosureUrl||``,coverUrl:e?.image||e?.feedImage||``,podcastId:String(e?.feedId??``)}}var S=`https://api.podcastindex.org/api/1.0`;async function C(e=20,t){let n=await y(),r=await fetch(`${S}/podcasts/trending?max=${e}`,{headers:n,signal:t});if(!r.ok)throw Error(`Failed to fetch trending podcasts`);return((await r.json()).feeds||[]).map(b)}async function w(e,t=20,n){let r=await y(),i=await fetch(`${S}/search/byterm?q=${encodeURIComponent(e)}&max=${t}`,{headers:r,signal:n});if(!i.ok)throw Error(`Search request failed`);return((await i.json()).feeds||[]).map(b)}async function T(e,t){let n=await y(),r=await fetch(`${S}/podcasts/byfeedid?id=${e}`,{headers:n,signal:t});if(!r.ok)throw Error(`Failed to fetch podcast details`);return b((await r.json()).feed)}async function E(e,t=50,n){let r=await y(),i=await fetch(`${S}/episodes/byfeedid?id=${e}&max=${t}`,{headers:r,signal:n});if(!i.ok)throw Error(`Failed to fetch episodes`);return((await i.json()).items||[]).map(x)}var D=class extends n{unsubscribe=null;playlistToggle=e=>{if(!e.target.closest(`.track-toggle-btn`))return;let t=this.props.episode.id,n=this.props.episode,r=this.props.podcastTitle,i=this.props.podcastAuthor,a=this.props.podcastCoverUrl;h(t)?m(t):p({episode:n,podcastTitle:r,podcastAuthor:i,podcastCoverUrl:a,addedAt:Date.now()}),this.updatePlaylistIcon()};updatePlaylistIcon(){let e=h(this.props.episode.id),t=this.element.querySelector(`.track-toggle-btn .icon`);t&&(t.className=e?`icon icon-check-mark`:`icon icon-plus`)}onPlayToggle=e=>{e.target.closest(`.track-toggle-btn`)||(i.getState().currEpisode?.id===this.props.episode.id?i.setState({isPlaying:!i.getState().isPlaying}):i.setState({currEpisode:this.props.episode,isPlaying:!0}))};constructor(e){super({tagName:`article`,className:`track-row`,props:e})}onMount(){this.updatePlaylistIcon(),this.syncWithPlayer(i.getState()),this.element.addEventListener(`click`,this.onPlayToggle),this.element.addEventListener(`click`,this.playlistToggle),this.unsubscribe=i.subscribe(e=>{this.syncWithPlayer(e)})}syncWithPlayer(e){let t=e.currEpisode?.id===this.props.episode.id;this.element.classList.toggle(`active-track`,t);let n=this.element.querySelector(`.num-text`),r=this.element.querySelector(`.num-play`);t?(n?.classList.add(`hidden`),r?.classList.remove(`hidden`),r?.classList.toggle(`icon-pause`,e.isPlaying),r?.classList.toggle(`icon-play`,!e.isPlaying)):(n?.classList.remove(`hidden`),r?.classList.add(`hidden`))}onUnmount(){this.element.removeEventListener(`click`,this.onPlayToggle),this.element.removeEventListener(`click`,this.playlistToggle),this.unsubscribe?.()}render(){let{episode:e,index:t}=this.props,n=this.props.podcastAuthor,r=this.props.podcastCoverUrl,i=e.coverUrl||r;return`
      <div class="track-num">
        <span class="num-text">${t+1}</span>
        <span class="icon icon-play num-play"></span>
      </div>
      <div class="track-info">
        <img class="track-cover" src="${i}" alt="" loading="lazy" />
        <div class="track-text">
          <h2 class="track-title">${e.title||`Без названия`}</h2>
          <p class="track-author">${n||``}</p>
        </div>
      </div>
      <div class="track-meta">
        <span class="track-date">${e.pubDate}</span>
        <button class="track-toggle-btn" title="Добавить в плейлист">
          <span class="icon icon-plus"></span>
        </button>
        <span class="track-duration">${e.duration||``}</span>
      </div>
    `}},O=class extends n{abortController=null;rows=[];constructor(e){super({tagName:`section`,className:`tracklist-container`,props:{feedId:e}}),this.state={episodes:[],isLoading:!0,error:null}}onMount(){this.fetchEpisodes(),this.element.addEventListener(`click`,e=>{e.target.closest(`.episode-list-retry-btn`)&&this.fetchEpisodes()})}onUnmount(){this.rows.forEach(e=>e.unmount()),this.rows=[],this.abortController?.abort()}async fetchEpisodes(){this.abortController&&this.abortController.abort(),this.abortController=new AbortController;try{this.setState({isLoading:!0});let e=await E(this.props.feedId,50,this.abortController.signal);this.setState({episodes:e,isLoading:!1})}catch(e){if(e instanceof Error&&e.name===`AbortError`)return;let t=e instanceof Error?e.message:`error when uploading`;this.setState({isLoading:!1,error:t})}}getHeaderHTML(){return`
      <div class="tracklist-header">
        <span class="header-num">#</span>
        <span class="header-title">Название</span>
        <span class="header-data">Опубликовано</span>
        <span class="header-time">
          <span class="icon icon-clock"></span>
        </span>
      </div>
      <hr class="tracklist-divider" />
    `}render(){let{episodes:e,isLoading:t,error:n}=this.state;return t?`
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status">
            <div class="spinner"></div>
            <span>Загрузка эпизодов...</span>
          </div>
        </div>
      `:n?`
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status episode-list-status--error">
            <p class="episode-list-error-message">Ошибка: ${n}</p>
            <button class="episode-list-retry-btn" type="button">Попробовать снова</button>
          </div>
        </div>
      `:e.length===0?`
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status">Нет эпизодов</div>
        </div>
      `:`
      ${this.getHeaderHTML()}
      <div class="tracklist-body"></div>
    `}afterRender(){if(this.state.isLoading||this.state.error||this.state.episodes.length===0)return;let e=this.element.querySelector(`.tracklist-body`);if(!e)return;this.rows.forEach(e=>e.unmount()),this.rows=[];let t=i.getState().currPodcast,n=t?.author||``,r=t?.title||``,a=t?.coverUrl||``;this.state.episodes.forEach((t,i)=>{let o=new D({episode:t,podcastAuthor:n,podcastTitle:r,podcastCoverUrl:a,index:i});o.mount(e),this.rows.push(o)})}},k=class extends n{hero=null;episodeList=null;constructor(e){super({tagName:`main`,className:`main-container`,props:e})}onMount(){let e=this.props.feedId,t=i.getPodcastById(e);t?this.mountComponents(t):T(e).then(e=>{i.setState({currPodcast:e}),this.mountComponents(e)}).catch(()=>{this.showError(`Не удалось загрузить подкаст`)})}onUnmount(){this.hero?.unmount(),this.hero=null,this.episodeList?.unmount(),this.episodeList=null}mountComponents(e){let t=this.element.querySelector(`#hero-slot`),n=this.element.querySelector(`#episode-list-slot`);t&&(this.hero=new v(e),this.hero.mount(t)),n&&(this.episodeList=new O(e.id),this.episodeList.mount(n))}showError(e){let t=this.element.querySelector(`#hero-slot`);t&&(t.innerHTML=`<p class="error-message">${e}</p>`)}render(){return`
      <div id="hero-slot"></div>
      <div class="container">
        <div id="episode-list-slot"></div>
      </div>
    `}},A=class extends n{unsubscribe=null;constructor(e){super({tagName:`article`,className:`track-row`,props:e})}onPlayToggle=e=>{let t=e.target;t.closest(`.track-toggle-btn`)||t.closest(`.track-podcast`)||(i.getState().currEpisode?.id===this.props.playlistItem.episode.id?i.setState({isPlaying:!i.getState().isPlaying}):i.setState({currEpisode:this.props.playlistItem.episode,isPlaying:!0}))};playlistToggle=e=>{if(!e.target.closest(`.track-toggle-btn`))return;let t=this.props.playlistItem.episode.id,n=this.props.playlistItem.episode,{podcastTitle:r,podcastAuthor:i,podcastCoverUrl:a}=this.props.playlistItem;h(t)?(m(t),this.props.onRemove?.(t)):p({episode:n,podcastTitle:r,podcastAuthor:i,podcastCoverUrl:a,addedAt:Date.now()}),this.updatePlaylistIcon()};updatePlaylistIcon(){let e=h(this.props.playlistItem.episode.id),t=this.element.querySelector(`.track-toggle-btn .icon`);t&&(t.className=e?`icon icon-check-mark`:`icon icon-plus`)}onPodcastClick=e=>{if(!e.target.closest(`.track-podcast`))return;let n=this.props.playlistItem.episode.podcastId;n&&t.navigate(`/details/${n}`)};onMount(){this.syncWithPlayer(i.getState()),this.element.addEventListener(`click`,this.onPlayToggle),this.element.addEventListener(`click`,this.playlistToggle),this.element.addEventListener(`click`,this.onPodcastClick),this.unsubscribe=i.subscribe(e=>{this.syncWithPlayer(e)})}syncWithPlayer(e){let t=e.currEpisode?.id===this.props.playlistItem.episode.id;this.element.classList.toggle(`active-track`,t);let n=this.element.querySelector(`.num-text`),r=this.element.querySelector(`.num-play`);t?(n?.classList.add(`hidden`),r?.classList.remove(`hidden`),r?.classList.toggle(`icon-pause`,e.isPlaying),r?.classList.toggle(`icon-play`,!e.isPlaying)):(n?.classList.remove(`hidden`),r?.classList.add(`hidden`))}onUnmount(){this.element.removeEventListener(`click`,this.onPlayToggle),this.element.removeEventListener(`click`,this.playlistToggle),this.element.removeEventListener(`click`,this.onPodcastClick),this.unsubscribe?.()}render(){let e=this.props.playlistItem.episode,t=this.props.playlistItem.podcastAuthor,n=this.props.playlistItem.podcastTitle,r=this.props.playlistItem.podcastCoverUrl,i=new Date(this.props.playlistItem.addedAt).toLocaleDateString(`ru-RU`),a=this.props.index,o=e.coverUrl||r;return`
      <div class="track-num">
        <span class="num-text">${a+1}</span>
        <span class="icon icon-play num-play"></span>
      </div>
      <div class="track-info">
        <img class="track-cover" src="${o}" alt="" loading="lazy" />
        <div class="track-text">
          <h2 class="track-title">${e.title||`Без названия`}</h2>
          <p class="track-author">${t||``}</p>
          <p class="track-podcast" data-podcast-id="${e.podcastId}">
            ${n||``}
          </p>
        </div>
      </div>
      <div class="track-meta">
        <span class="track-date">${i}</span>
        <button class="track-toggle-btn" title="Удалить из плейлиста">
          <span class="icon icon-check-mark"></span>
        </button>
        <span class="track-duration">${e.duration||``}</span>
      </div>
    `}},j=class extends n{rows=[];constructor(){super({tagName:`section`,className:`tracklist-container`}),this.state={playlistItems:[]}}onMount(){this.setState({playlistItems:f()})}onUnmount(){this.rows.forEach(e=>e.unmount()),this.rows=[]}getHeaderHTML(){return`
      <div class="tracklist-header">
        <span class="header-num">#</span>
        <span class="header-title">Название</span>
        <span class="header-data">Дата добавления</span>
        <span class="header-time">
          <span class="icon icon-clock"></span>
        </span>
      </div>
      <hr class="tracklist-divider" />
    `}render(){return this.state.playlistItems.length===0?`
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status">Нет эпизодов</div>
        </div>
      `:`
      ${this.getHeaderHTML()}
      <div class="tracklist-body"></div>
    `}afterRender(){if(this.state.playlistItems.length===0)return;let e=this.element.querySelector(`.tracklist-body`);e&&(this.rows.forEach(e=>e.unmount()),this.rows=[],this.state.playlistItems.forEach((t,n)=>{let r=new A({playlistItem:t,index:n,onRemove:e=>{m(e),this.setState({playlistItems:f()})}});r.mount(e),this.rows.push(r)}))}},M=class extends n{playlistList=null;constructor(){super({tagName:`main`,className:`main-container`})}onMount(){let e=this.element.querySelector(`#playlist-list-slot`);e&&(this.playlistList=new j,this.playlistList.mount(e))}onUnmount(){this.playlistList?.unmount(),this.playlistList=null}render(){return`
      <div class="container">
        <div id="playlist-list-slot"></div>
      </div>
    `}};function N(e,t=400){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>e.call(this,...r),t)}}var P=class extends n{constructor(e={}){super({tagName:`section`,className:`section-top`,props:e})}handlerInput=N(e=>{let t=e.target.value.trim(),n=new URL(window.location.href);t?n.searchParams.set(`q`,t):n.searchParams.delete(`q`),window.history.replaceState({},``,n.toString());let r=this.props.onSearch;typeof r==`function`&&r(t)});onMount(){let e=new URL(window.location.href).searchParams.get(`q`)||``,t=this.props.onSearch;typeof t==`function`&&t(e)}render(){return`
      <div class="title-block">
        <h1 class="main-title">Best Podcasts</h1>
      </div>

      <form class="search-wrapper" role="search" id="search-form">
        <span class="icon icon-magnifier search-icon"></span>
        <input
          type="search"
          class="search-input"
          id="search-input"
          placeholder="Search podcasts..."
          aria-label="Поиск подкастов" 
        />
      </form>
    `}afterRender(){let e=this.element.querySelector(`#search-form`),t=this.element.querySelector(`#search-input`);if(!e)throw Error(`нету #search-form`);if(!t)throw Error(`нету #search-input`);t.value=new URL(window.location.href).searchParams.get(`q`)||``,e.addEventListener(`submit`,e=>e.preventDefault()),t.addEventListener(`input`,this.handlerInput)}},F=class extends n{constructor(e){super({tagName:`article`,className:`card`,dataset:{id:e.id},props:e})}render(){let e=this.props;return`
      <div class="card-cover-wrapper">
        <img 
          class="card-img" 
          src="${e.coverUrl||``}" 
          alt="" 
          loading="lazy" 
        />
      </div>
      <div class="card-content">
        <h3 class="card-title">${e.title||`Название подкаста`}</h3>
        <p class="card-author">${e.author||`Автор подкаста`}</p>
      </div>
    `}},I=class extends n{abortController=null;cards=[];constructor(){super({tagName:`section`,className:`podcast-list-container`}),this.state={podcasts:[],isLoading:!0,error:null,currentQuery:``}}onMount(){this.element.addEventListener(`click`,e=>{let n=e.target.closest(`.card`);if(!(n&&n.dataset.id))return;let r=n.dataset.id,a=i.getPodcastById(r);i.setState({currPodcast:a}),t.navigate(`/details/${r}`)}),this.element.addEventListener(`click`,e=>{e.target.closest(`.podcast-list-retry-btn`)&&this.fetchPodcasts()})}onUnmount(){this.cards.forEach(e=>e.unmount()),this.cards=[],this.abortController?.abort()}async fetchPodcasts(e){this.abortController&&this.abortController.abort(),this.abortController=new AbortController;try{this.setState({isLoading:!0,currentQuery:e});let t=this.abortController.signal,n=e?await w(e,20,t):await C(20,t);this.setState({podcasts:n,isLoading:!1}),i.setState({podcasts:n})}catch(e){if(e instanceof Error&&e.name===`AbortError`)return;let t=e instanceof Error?e.message:`error when uploading`;this.setState({isLoading:!1,error:t})}}render(){let{isLoading:e,error:t,podcasts:n,currentQuery:r}=this.state;return e?`
        <div class="podcast-list-status">
          <div class="spinner"></div>
          <span>
            ${r?`Поиск "${r}"...`:`Загрузка...`}
          </span>
        </div>
      `:t?`
        <div class="podcast-list-status podcast-list-status--error">
          <p class="podcast-list-error-message">Ошибка: ${t}</p>
          <button class="podcast-list-retry-btn" type="button">Попробовать снова</button>
        </div>
      `:n.length===0?`
        <div class="podcast-list-status">
          ${r?`По запросу "${r}" ничего не найдено`:`Подкасты не найдены`}
        </div>
      `:`<div class="podcast-list"></div>`}afterRender(){let e=this.element.querySelector(`.podcast-list`);e&&(this.cards.forEach(e=>e.unmount()),this.cards=[],this.state.podcasts.forEach(t=>{let n=new F(t);n.mount(e),this.cards.push(n)}))}},L=class extends n{podcastList=null;searchSection=null;constructor(e={}){super({className:`container`,props:e})}render(){return`
      <div id="search-slot"></div>

      <div id="podcast-list-slot"></div>
    `}afterRender(){let e=this.element.querySelector(`#podcast-list-slot`);e&&(this.podcastList=new I,this.podcastList.mount(e));let t=this.element.querySelector(`#search-slot`);t&&(this.searchSection=new P({onSearch:e=>{this.podcastList?.fetchPodcasts(e)}}),this.searchSection.mount(t))}onUnmount(){this.podcastList?.unmount(),this.podcastList=null,this.searchSection?.unmount(),this.searchSection=null}},R=class extends n{render(){return`
      <div class="container not-found">
        <h1>404 - Страница не найдена</h1>
        <p>Запрошенный адрес не существует.</p>
        <a href="/" class="btn" data-link>Вернуться на главную</a>
      </div>
    `}};t.addLayout(`/`,_),t.addRoute(`/`,L),t.addRoute(`/details/:feedId`,k),t.addRoute(`/playlist`,M),t.addRoute(`/404`,R);