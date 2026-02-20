<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()

const ageInput = ref('')
const termsChecked = ref(false)
const error = ref('')

function confirm() {
  error.value = ''
  const n = parseInt(ageInput.value, 10)
  if (!ageInput.value || isNaN(n)) {
    error.value = 'Please enter your age.'
    return
  }
  if (n < 18) {
    error.value = 'You must be 18 or older to participate.'
    return
  }
  if (!termsChecked.value) {
    error.value = 'Please accept the Terms and Responsible Drinking policy.'
    return
  }
  user.confirmAge()
  router.push('/follow')
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
                <span class="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 32px; height: 32px;">✓</span>
                <span class="bg-primary bg-opacity-50 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white small fw-bold" style="width: 32px; height: 32px;">2</span>
                <span class="bg-white bg-opacity-25 flex-grow-1" style="height: 2px; max-width: 40px;"></span>
                <span class="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-white text-opacity-60 small fw-bold" style="width: 32px; height: 32px;">3</span>
              </div>
              <p class="small text-white text-opacity-70 text-uppercase mb-4">Step 2 — Age &amp; Terms</p>

              <h1 class="h4 fw-bold text-white mb-2">Verify your age</h1>
              <p class="text-white text-opacity-85 mb-4">
                Safari Fantasy is only available to players aged 18 and over. Please confirm your age and agree to our Responsible Drinking policy.
              </p>

              <form @submit.prevent="confirm">
                <div class="mb-4">
                  <label for="age" class="form-label">Your age</label>
                  <input
                    id="age"
                    v-model="ageInput"
                    type="number"
                    min="18"
                    max="120"
                    class="form-control form-control-lg"
                    placeholder="e.g. 25"
                    :class="{ 'is-invalid': error }"
                  />
                </div>

                <div class="form-check mb-4">
                  <input
                    id="terms"
                    v-model="termsChecked"
                    type="checkbox"
                    class="form-check-input"
                    :class="{ 'is-invalid': error && !termsChecked }"
                  />
                  <label for="terms" class="form-check-label">
                    I confirm I am 18+ and I accept the
                    <span class="text-primary text-decoration-underline">Terms &amp; Conditions</span>
                    and
                    <span class="text-primary text-decoration-underline">Responsible Drinking Policy</span>.
                  </label>
                </div>

                <div v-if="error" class="alert alert-danger py-2 mb-4 small mb-0" role="alert">
                  {{ error }}
                </div>

                <div class="d-flex justify-content-center pt-2">
                  <button type="submit" class="btn btn-primary btn-lg px-4 py-3 fw-bold w-100 w-sm-auto">
                    Confirm and continue
                  </button>
                </div>
              </form>

              <p class="small text-center text-white text-opacity-50 mt-4 mb-0">
                Drink responsibly. This product is only for those who can legally consume alcohol in their country.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
