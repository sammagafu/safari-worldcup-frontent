<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeagueStore } from '@/stores/league'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const leagueStore = useLeagueStore()
const userStore = useUserStore()
const code = ref('')
const error = ref('')
const success = ref(false)

function submit() {
  error.value = ''
  success.value = false
  const trimmed = code.value?.trim().toUpperCase()
  if (!trimmed) {
    error.value = 'Please enter the league share code.'
    return
  }
  const league = leagueStore.leagueByCode(trimmed)
  if (!league) {
    error.value = 'Invalid code. Please check and try again.'
    return
  }
  const userId = userStore.isLoggedIn ? 'me' : `guest-${Date.now()}`
  leagueStore.joinLeague(trimmed, userId)
  success.value = true
  setTimeout(() => router.push('/leaderboard'), 1500)
}
</script>

<template>
  <div class="container py-4 py-md-5">
    <header class="mb-4 mb-md-5">
      <h1 class="h3 fw-bold text-white mb-2">Join League</h1>
      <p class="text-white text-opacity-80 mb-0">
        Enter the share code from your league admin to join.
      </p>
    </header>

    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card border border-white border-opacity-10">
          <div class="card-body p-4 p-sm-5">
            <form @submit.prevent="submit">
              <div class="mb-4">
                <label for="share-code" class="form-label">Share code</label>
                <input
                  id="share-code"
                  v-model="code"
                  type="text"
                  class="form-control form-control-lg text-uppercase"
                  style="letter-spacing: 0.15em; font-variant-numeric: tabular-nums;"
                  placeholder="e.g. ABC123"
                  maxlength="10"
                  :class="{ 'is-invalid': error }"
                />
              </div>

              <div v-if="error" class="alert alert-danger py-2 small mb-4" role="alert">
                {{ error }}
              </div>
              <div v-if="success" class="alert alert-success py-2 small mb-4" role="alert">
                You've joined the league! Redirecting...
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 fw-bold py-3"
                :disabled="success"
              >
                Join league
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
