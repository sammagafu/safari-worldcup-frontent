<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()

const teamNameInput = ref(user.teamName || '')
const error = ref('')

function submit() {
  error.value = ''
  const name = (teamNameInput.value || '').trim()
  if (!name) {
    error.value = 'Please enter a team name.'
    return
  }
  user.setTeamName(name)
  router.push('/squad')
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-9">
          <div class="card border border-white border-opacity-10 shadow-lg" style="min-height: 52.5vh;">
            <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-center align-items-center text-center">
              <!-- Step indicator: 4 of 4 -->
              <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
                <span class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 32px; height: 32px;">✓</span>
                <span class="bg-primary bg-opacity-50 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 32px; height: 32px;">✓</span>
                <span class="bg-primary bg-opacity-50 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 32px; height: 32px;">✓</span>
                <span class="bg-primary bg-opacity-50 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white small fw-bold" style="width: 32px; height: 32px;">4</span>
              </div>
              <p class="small text-white text-opacity-70 text-uppercase mb-4">Step 4 — Create your team name</p>

              <h1 class="h4 fw-bold text-white mb-2">Name your team</h1>
              <p class="text-white text-opacity-85 mb-4">
                Choose a name for your fantasy team. You’ll add players in the next step.
              </p>

              <form @submit.prevent="submit">
                <div class="mb-4">
                  <label for="teamName" class="form-label">Team name</label>
                  <input
                    id="teamName"
                    v-model="teamNameInput"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="e.g. Safari Stars"
                    maxlength="50"
                    :class="{ 'is-invalid': error }"
                    @input="error = ''"
                  />
                </div>

                <div v-if="error" class="alert alert-danger py-2 mb-4 small" role="alert">
                  {{ error }}
                </div>

                <div class="d-flex justify-content-center pt-2">
                  <button type="submit" class="btn btn-primary btn-lg px-4 py-3 fw-bold w-100 w-sm-auto">
                    Create team name and continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
