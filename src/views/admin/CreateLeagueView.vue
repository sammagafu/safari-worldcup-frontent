<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeagueStore } from '@/stores/league'

const router = useRouter()
const leagueStore = useLeagueStore()
const name = ref('')
const error = ref('')

function submit() {
  error.value = ''
  const trimmed = name.value?.trim()
  if (!trimmed) {
    error.value = 'Please enter a league name.'
    return
  }
  const league = leagueStore.createLeague(trimmed)
  router.push(`/admin/leagues/${league.id}/share`)
}
</script>

<template>
  <div>
    <h1 class="h4 fw-bold text-white mb-2">Create League</h1>
    <p class="text-white text-opacity-80 mb-4">Create a new league and share the code with participants.</p>

    <div class="row">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card border border-white border-opacity-10">
          <div class="card-body p-4 p-sm-5">
            <form @submit.prevent="submit">
              <div class="mb-4">
                <label for="league-name" class="form-label">League name</label>
                <input
                  id="league-name"
                  v-model="name"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="e.g. Office League"
                  maxlength="50"
                  :class="{ 'is-invalid': error }"
                />
              </div>

              <div v-if="error" class="alert alert-danger py-2 small mb-4" role="alert">
                {{ error }}
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold py-3">
                Create & get share code
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
