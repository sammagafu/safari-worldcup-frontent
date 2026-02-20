<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const phone = ref(user.phoneNumber ?? '')
const error = ref('')
const success = ref(false)

function validatePhone(value) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

function submit() {
  error.value = ''
  success.value = false
  const trimmed = phone.value?.trim()
  if (!trimmed) {
    error.value = 'Please enter your phone number.'
    return
  }
  if (!validatePhone(trimmed)) {
    error.value = 'Please enter a valid phone number (9–15 digits).'
    return
  }
  user.setPhoneNumber(trimmed)
  success.value = true
}
</script>

<template>
  <div class="container py-4 py-md-5">
    <header class="mb-4 mb-md-5">
      <h1 class="h3 fw-bold text-white mb-2">Notifications</h1>
      <p class="text-white text-opacity-80 mb-0">
        Add your phone number to receive SMS when you win Man of the Match or a correct score prediction.
      </p>
    </header>

    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card border border-white border-opacity-10">
          <div class="card-body p-4 p-sm-5">
            <form @submit.prevent="submit">
              <div class="mb-4">
                <label for="phone" class="form-label">Phone number</label>
                <input
                  id="phone"
                  v-model="phone"
                  type="tel"
                  class="form-control form-control-lg"
                  placeholder="e.g. +255 712 345 678"
                  :class="{ 'is-invalid': error }"
                />
                <div class="form-text">
                  We'll send you a message when you win MOTM or predict the correct score.
                </div>
              </div>

              <div v-if="error" class="alert alert-danger py-2 small mb-4" role="alert">
                {{ error }}
              </div>
              <div v-if="success" class="alert alert-success py-2 small mb-4" role="alert">
                Phone number saved. You'll receive notifications when you win.
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold py-3">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
