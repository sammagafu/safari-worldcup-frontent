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

              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
                <button type="button" class="btn btn-dark border border-white border-opacity-25 d-flex align-items-center justify-content-center gap-2 py-3 px-4" @click="loginWith('twitter')">
                  <svg style="width: 28px; height: 28px;" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span class="text-start">
                    <span class="d-block small text-white text-opacity-70">Sign in with</span>
                    <span class="d-block fw-bold">X (Twitter)</span>
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
