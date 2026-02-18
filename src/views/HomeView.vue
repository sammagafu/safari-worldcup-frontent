<script setup>
import { RouterLink } from 'vue-router'
import bgMobo from '@/assets/bg/bg-mobo.jpg'
import bgWeb from '@/assets/bg/bg-web.jpg'
</script>

<template>
  <div class="w-full overflow-x-hidden px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
    <!-- Hero: background cover full width, top-aligned -->
    <section class="relative w-full min-h-[75vh] min-h-[75dvh] rounded-xl sm:rounded-2xl overflow-hidden" aria-labelledby="hero-heading">
      <!-- Background: cover, full width of section, top-aligned -->
      <div
        class="absolute inset-0 bg-cover bg-top bg-no-repeat md:hidden"
        :style="{ backgroundImage: `url(${bgMobo})` }"
        aria-hidden="true"
      />
      <div
        class="absolute inset-0 bg-cover bg-top bg-no-repeat hidden md:block"
        :style="{ backgroundImage: `url(${bgWeb})` }"
        aria-hidden="true"
      />
      <div class="container relative z-10 mx-auto pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16">
        <div class="pt-8 sm:pt-12 md:pt-14 text-center">
          <div class="mx-auto mb-8 sm:mb-10">
            <h2 id="hero-heading" class="text-2xl sm:text-3xl md:text-4xl lg:text-8xl lg:leading-normal mb-4 sm:mb-5 font-bold text-text-primary px-1">
              Compete. Win. Celebrate.
            </h2>
            <p class="text-base sm:text-lg text-text-secondary leading-relaxed px-2 pb-8">
              The World Cup happens once every four years.
              Don’t just watch it — be part of it
            </p>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5">
            <RouterLink
              to="/squad"
              class="btn-primary hover-up-2 w-full sm:w-auto min-h-12 inline-flex items-center justify-center px-6"
            >
              Build my squad
            </RouterLink>
            <RouterLink
              to="/leaderboard"
              class="btn-white hover-up-2 w-full sm:w-auto min-h-12 inline-flex items-center justify-center px-6"
            >
              View leaderboard
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard / app preview -->
    <section class="w-full mt-10 sm:mt-14 md:mt-20 mb-8 sm:mb-10" aria-labelledby="dashboard-heading">
      <div class="container mx-auto">
        <h2 id="dashboard-heading" class="sr-only">Your fantasy dashboard</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-2xl mx-auto">
          <RouterLink
            to="/squad"
            class="group rounded-xl border border-border-subtle p-6 sm:p-7 text-center transition hover:border-safari-light-blue hover:-translate-y-0.5"
          >
            <div class="flex justify-center mb-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-safari-light-blue/10 text-safari-light-blue group-hover:bg-safari-light-blue/20 transition">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
            </div>
            <div class="text-text-primary font-bold text-base">Build your Squad</div>
            <div class="text-text-muted text-sm mt-1">15 players · 100M</div>
          </RouterLink>
          <RouterLink
            to="/leaderboard"
            class="group rounded-xl border border-border-subtle p-6 sm:p-7 text-center transition hover:border-safari-light-blue hover:-translate-y-0.5"
          >
            <div class="flex justify-center mb-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-safari-light-blue/10 text-safari-light-blue group-hover:bg-safari-light-blue/20 transition">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </span>
            </div>
            <div class="text-text-primary font-bold text-base">Leaderboard</div>
            <div class="text-text-muted text-sm mt-1">National & bars</div>
          </RouterLink>
          <RouterLink
            to="/rewards"
            class="group rounded-xl border border-border-subtle p-6 sm:p-7 text-center transition hover:border-safari-light-blue hover:-translate-y-0.5"
          >
            <div class="flex justify-center mb-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-safari-light-blue/10 text-safari-light-blue group-hover:bg-safari-light-blue/20 transition">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
              </span>
            </div>
            <div class="text-text-primary font-bold text-base">Rewards</div>
            <div class="text-text-muted text-sm mt-1">Redeem at partners</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="w-full pt-8 sm:pt-10 pb-12 sm:pb-20" aria-labelledby="stats-heading">
      <div class="container mx-auto">
        <h2 id="stats-heading" class="sr-only">Platform stats</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 lg:justify-items-center">
          <div class="hover-up-5 flex items-center gap-4 sm:gap-5 py-4 sm:py-5 max-w-52 lg:max-w-none min-w-0">
            <div class="flex justify-center items-center border border-border-subtle text-safari-light-blue rounded-xl h-12 w-12 sm:h-14 sm:w-14 shrink-0">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="min-w-0">
              <span class="text-lg sm:text-2xl font-bold text-text-primary">+150</span>
              <p class="text-sm sm:text-base text-text-muted">Partner bars</p>
            </div>
          </div>
          <div class="hover-up-5 flex items-center gap-4 sm:gap-5 py-4 sm:py-5 max-w-52 lg:max-w-none min-w-0">
            <div class="flex justify-center items-center border border-border-subtle text-safari-light-blue rounded-xl h-12 w-12 sm:h-14 sm:w-14 shrink-0">
              <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <span class="text-lg sm:text-2xl font-bold text-text-primary">+32</span>
              <p class="text-sm sm:text-base text-text-muted">Matchdays</p>
            </div>
          </div>
          <div class="hover-up-5 flex items-center gap-4 sm:gap-5 py-4 sm:py-5 max-w-52 lg:max-w-none min-w-0">
            <div class="flex justify-center items-center border border-border-subtle text-safari-light-blue rounded-xl h-12 w-12 sm:h-14 sm:w-14 shrink-0">
              <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div class="min-w-0">
              <span class="text-lg sm:text-2xl font-bold text-text-primary">+500</span>
              <p class="text-sm sm:text-base text-text-muted">Rewards won</p>
            </div>
          </div>
          <div class="hover-up-5 flex items-center gap-4 sm:gap-5 py-4 sm:py-5 max-w-52 lg:max-w-none min-w-0">
            <div class="flex justify-center items-center border border-border-subtle text-safari-light-blue rounded-xl h-12 w-12 sm:h-14 sm:w-14 shrink-0">
              <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="min-w-0">
              <span class="text-lg sm:text-2xl font-bold text-text-primary">+58k</span>
              <p class="text-sm sm:text-base text-text-muted">Active players</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key features -->
    <section id="key-features" class="w-full pt-14 pb-20 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28" aria-labelledby="how-it-works-heading">
      <div class="container mx-auto">
        <h2 id="how-it-works-heading" class="text-xl sm:text-2xl font-bold text-text-primary text-center mb-8 sm:mb-10">How it works</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div
            v-for="card in [
              { title: 'Pick your squad', body: '15 players, 100M budget. 1 GK, 4 DEF, 4 MID, 2 FWD + 4 bench.' },
              { title: 'Compete & predict', body: 'Set captain, use chips, predict Man of the Match. Points every matchday.' },
              { title: 'Win rewards', body: 'Climb the leaderboard. Redeem vouchers at partner bars. 21+ only.' },
            ]"
            :key="card.title"
            class="border border-border-subtle rounded-xl p-6 sm:p-8 transition hover:border-border-default"
          >
            <h3 class="text-lg font-bold text-text-primary mb-3">{{ card.title }}</h3>
            <p class="text-base text-text-secondary leading-relaxed">{{ card.body }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
