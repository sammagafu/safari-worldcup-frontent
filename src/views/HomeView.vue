<script setup>
import { RouterLink } from 'vue-router'
import bgMobo from '@/assets/bg/bg-mobo.jpg'
import bgWeb from '@/assets/bg/bg-web.jpg'
</script>

<template>
  <div class="container px-4 py-5 py-md-5">
    <!-- Hero -->
    <section class="position-relative rounded-3 overflow-hidden mb-5 mb-md-5" style="min-height: 75vh;" aria-labelledby="hero-heading">
      <div
        class="position-absolute top-0 start-0 w-100 h-100 bg cover d-md-none"
        :style="{ backgroundImage: `url(${bgMobo})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
        aria-hidden="true"
      />
      <div
        class="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block"
        :style="{ backgroundImage: `url(${bgWeb})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
        aria-hidden="true"
      />
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75" style="background: linear-gradient(180deg, rgba(13,11,92,0.85) 0%, rgba(13,11,92,0.6) 50%, rgba(13,11,92,0.9) 100%);" aria-hidden="true" />
      <div class="position-relative z-1 container text-center py-5 py-md-5">
        <h2 id="hero-heading" class="display-4 display-lg-1 fw-bold text-white mb-3 mb-md-4">
          Compete. Win. Celebrate.
        </h2>
        <p class="lead text-white text-opacity-90 mb-4 mb-md-5 px-2">
          The World Cup happens once every four years.
          Don't just watch it — be part of it
        </p>
        <div class="d-flex flex-column flex-sm-row flex-wrap justify-content-center gap-3">
          <RouterLink to="/squad" class="btn btn-primary btn-lg px-4 py-3">
            Build a squad
          </RouterLink>
          <RouterLink to="/leaderboard" class="btn btn-outline-light btn-lg px-4 py-3">
            View leaderboard
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Dashboard preview -->
    <section class="card border border-white border-opacity-10 mb-5 py-4 py-md-5 px-4" aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" class="visually-hidden">Your fantasy dashboard</h2>
      <div class="row g-4 g-md-4">
        <div class="col-12 col-sm-6 col-lg-4">
          <RouterLink to="/squad" class="card border border-white border-opacity-10 text-decoration-none text-white h-100 transition-all">
            <div class="card-body text-center py-4">
              <div class="rounded-2 bg-primary bg-opacity-25 d-inline-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px;">
                <svg class="text-white" style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 class="h6 fw-bold mb-1">Build your Squad</h3>
              <p class="small text-white text-opacity-70 mb-0">15 players · 100M</p>
            </div>
          </RouterLink>
        </div>
        <div class="col-12 col-sm-6 col-lg-4">
          <RouterLink to="/leaderboard" class="card border border-white border-opacity-10 text-decoration-none text-white h-100">
            <div class="card-body text-center py-4">
              <div class="rounded-2 bg-primary bg-opacity-25 d-inline-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px;">
                <svg class="text-white" style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 class="h6 fw-bold mb-1">Leaderboard</h3>
              <p class="small text-white text-opacity-70 mb-0">National & bars</p>
            </div>
          </RouterLink>
        </div>
        <div class="col-12 col-sm-6 col-lg-4">
          <RouterLink to="/rewards" class="card border border-white border-opacity-10 text-decoration-none text-white h-100">
            <div class="card-body text-center py-4">
              <div class="rounded-2 bg-primary bg-opacity-25 d-inline-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px;">
                <svg class="text-white" style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
              </div>
              <h3 class="h6 fw-bold mb-1">Rewards</h3>
              <p class="small text-white text-opacity-70 mb-0">Redeem at partners</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-4 py-md-5" aria-labelledby="stats-heading">
      <h2 id="stats-heading" class="visually-hidden">Platform stats</h2>
      <div class="row g-4 justify-content-center text-center">
        <div class="col-6 col-lg-3">
          <div class="d-flex align-items-center gap-3 justify-content-center">
            <div class="rounded-2 border border-white border-opacity-25 d-flex align-items-center justify-content-center text-white" style="width: 56px; height: 56px;">
              <svg style="width: 28px; height: 28px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div class="text-start">
              <span class="display-6 fw-bold text-white">+150</span>
              <p class="small text-white text-opacity-70 mb-0">Partner bars</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="d-flex align-items-center gap-3 justify-content-center">
            <div class="rounded-2 border border-white border-opacity-25 d-flex align-items-center justify-content-center text-white" style="width: 56px; height: 56px;">
              <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div class="text-start">
              <span class="display-6 fw-bold text-white">+32</span>
              <p class="small text-white text-opacity-70 mb-0">Matchdays</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="d-flex align-items-center gap-3 justify-content-center">
            <div class="rounded-2 border border-white border-opacity-25 d-flex align-items-center justify-content-center text-white" style="width: 56px; height: 56px;">
              <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <div class="text-start">
              <span class="display-6 fw-bold text-white">+500</span>
              <p class="small text-white text-opacity-70 mb-0">Rewards won</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="d-flex align-items-center gap-3 justify-content-center">
            <div class="rounded-2 border border-white border-opacity-25 d-flex align-items-center justify-content-center text-white" style="width: 56px; height: 56px;">
              <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div class="text-start">
              <span class="display-6 fw-bold text-white">+58k</span>
              <p class="small text-white text-opacity-70 mb-0">Active players</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-5" id="key-features" aria-labelledby="how-it-works-heading">
      <h2 id="how-it-works-heading" class="h4 fw-bold text-white text-center mb-4 mb-md-5">How it works</h2>
      <div class="row g-4">
        <div v-for="card in [
          { title: 'Pick your squad', body: '15 players, 100M budget. 1 GK, 4 DEF, 4 MID, 2 FWD + 4 bench.' },
          { title: 'Compete & predict', body: 'Set captain, use chips, predict Man of the Match. Points every matchday.' },
          { title: 'Win rewards', body: 'Climb the leaderboard. Redeem vouchers at partner bars. 21+ only.' },
        ]" :key="card.title" class="col-12 col-md-6 col-lg-4">
          <div class="card border border-white border-opacity-10 h-100">
            <div class="card-body">
              <h3 class="h6 fw-bold text-white mb-2">{{ card.title }}</h3>
              <p class="text-white text-opacity-85 small mb-0">{{ card.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card:hover {
  border-color: rgba(26, 82, 255, 0.4) !important;
}
@media (min-width: 992px) {
  .display-lg-1 { font-size: calc(1.625rem + 4.5vw); }
}
</style>
