<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()

function skip() {
  user.dismissFollowBanner()
  router.push('/create-team-name')
}

function followedAndContinue() {
  user.dismissFollowBanner()
  router.push('/create-team-name')
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center overflow-x-hidden">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-9">
          <div class="onboarding-card border border-white border-opacity-10 rounded-3 shadow-lg p-4 p-sm-5 d-flex flex-column justify-content-center align-items-center text-center" style="min-height: 52.5vh;">
      <div class="mx-auto my-4 my-md-5">
        <!-- Step indicator -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-safari-dark-blue/20 text-safari-dark-blue text-xs font-bold">✓</span>
          <span class="h-px w-8 bg-safari-dark-blue/30"></span>
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-safari-dark-blue/20 text-safari-dark-blue text-xs font-bold">✓</span>
          <span class="h-px w-8 bg-safari-dark-blue/30"></span>
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-safari-dark-blue text-white text-xs font-bold">3</span>
        </div>
        <p class="text-xs text-text-muted mb-6">Step 3 of 5 — Follow us</p>

        <h5 class="onboarding-heading font-display">
          Follow us to stay in the game
        </h5>
        <p class="onboarding-body">
          Get live match updates, exclusive content, and winner announcements directly on your favourite platform. You can skip this step and follow later.
        </p>

        <!-- Social follow buttons -->
        <div class="onboarding-ctas flex-wrap">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="onboarding-btn"
          >
            <svg class="w-7 h-7 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <div class="btn-label">
              <span class="btn-sub">Follow us on</span>
              <span class="btn-main">Instagram</span>
            </div>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            class="onboarding-btn bg-black! hover:bg-black/90!"
          >
            <svg class="w-7 h-7 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <div class="btn-label">
              <span class="btn-sub">Follow us on</span>
              <span class="btn-main">X (Twitter)</span>
            </div>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="onboarding-btn bg-[#1877F2]! hover:bg-[#1877F2]/90!"
          >
            <svg class="w-7 h-7 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <div class="btn-label">
              <span class="btn-sub">Follow us on</span>
              <span class="btn-main">Facebook</span>
            </div>
          </a>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            class="onboarding-btn"
            @click="followedAndContinue"
          >
            <div class="btn-label">
              <span class="btn-sub">I've followed</span>
              <span class="btn-main">Continue</span>
            </div>
          </button>
          <button
            type="button"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-text-secondary border border-border-default rounded-lg font-display font-bold hover:bg-white/5 transition cursor-pointer"
            @click="skip"
          >
            Skip for now
          </button>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
