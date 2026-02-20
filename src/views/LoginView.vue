<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()

function loginWith(provider) {
  user.setLoggedIn(true)
  // If user already has a team, take them to their team result view
  if (user.teamName) {
    router.push('/my-team')
  } else {
    router.push('/verify-age')
  }
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-9">
          <div class="card border border-white border-opacity-10 shadow-lg" style="min-height: 52.5vh;">
            <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-center align-items-center text-center">
              <!-- Step indicator -->
              <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
                <span class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white small fw-bold" style="width: 32px; height: 32px;">1</span>
                <span class="bg-white bg-opacity-25 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-white text-opacity-60 small fw-bold" style="width: 32px; height: 32px;">2</span>
                <span class="bg-white bg-opacity-25 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-white text-opacity-60 small fw-bold" style="width: 32px; height: 32px;">3</span>
              </div>
              <p class="small text-white text-opacity-70 text-uppercase tracking-wide mb-4">Step 1 — Sign up</p>

              <h1 class="h4 fw-bold text-white mb-2">
                Join Safari Fantasy
              </h1>
              <p class="text-white text-opacity-85 mb-4">
                Sign in to build your squad, make predictions, and compete for rewards at partner bars.
              </p>

              <div class="d-flex flex-column flex-sm-row flex-wrap gap-3 justify-content-center mb-4">
                <button type="button" class="btn btn-dark border border-white border-opacity-25 d-flex align-items-center justify-content-center gap-2 py-3 px-4" @click="loginWith('facebook')">
                  <svg style="width: 28px; height: 28px;" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span class="text-start">
                    <span class="d-block small text-white text-opacity-70">Sign in with</span>
                    <span class="d-block fw-bold">Facebook</span>
                  </span>
                </button>
                <button type="button" class="btn btn-dark border border-white border-opacity-25 d-flex align-items-center justify-content-center gap-2 py-3 px-4" @click="loginWith('twitter')">
                  <svg style="width: 28px; height: 28px;" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span class="text-start">
                    <span class="d-block small text-white text-opacity-70">Sign in with</span>
                    <span class="d-block fw-bold">X (Twitter)</span>
                  </span>
                </button>
                <button type="button" class="btn btn-dark border border-white border-opacity-25 d-flex align-items-center justify-content-center gap-2 py-3 px-4" @click="loginWith('google')">
                  <svg style="width: 28px; height: 28px;" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span class="text-start">
                    <span class="d-block small text-white text-opacity-70">Sign in with</span>
                    <span class="d-block fw-bold">Gmail</span>
                  </span>
                </button>
                <button type="button" class="btn btn-dark border border-white border-opacity-25 d-flex align-items-center justify-content-center gap-2 py-3 px-4" @click="loginWith('apple')">
                  <svg style="width: 28px; height: 28px;" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-1.18 1.35-2.15 2.7-3.45 3.94zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span class="text-start">
                    <span class="d-block small text-white text-opacity-70">Sign in with</span>
                    <span class="d-block fw-bold">Apple</span>
                  </span>
                </button>
              </div>

              <hr class="border-white border-opacity-25 my-4" />
              <p class="small text-white text-opacity-80 text-center">
                By continuing you agree to our <span class="text-decoration-underline">Terms & Conditions</span> and confirm you are 18+. Drink responsibly.
              </p>
              <p class="small text-center text-white text-opacity-50 mt-3 mb-0">
                Demo mode — no real authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
