<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const age = ref('')
const terms = ref(false)
const error = ref('')

function submit() {
  error.value = ''
  const ageNum = parseInt(age.value, 10)
  if (!age.value || isNaN(ageNum)) {
    error.value = 'Please enter your age.'
    return
  }
  if (ageNum < 21) {
    error.value = 'You must be 21 or older to participate.'
    return
  }
  if (!terms.value) {
    error.value = 'Please accept the Terms and Responsible Drinking policy.'
    return
  }
  user.setAgeVerified(true)
  user.setTermsAccepted(true)
  user.setLoggedIn(true)
  router.push('/')
}
</script>

<template>
  <div class="w-full bg-transparent px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
    <div class="max-w-md mx-auto">
    <div class="bg-surface-elevated border border-border-subtle rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
      <h1 class="text-xl sm:text-display-sm font-bold text-text-primary tracking-tight mb-3">
        Log in & join
      </h1>
      <p class="text-base text-text-secondary mb-8 sm:mb-10 leading-relaxed">
        Sign in with Facebook or Twitter, then verify your age and accept our policy to play.
      </p>
      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label for="age" class="block text-sm font-medium text-text-primary mb-1.5">
            Age (21+ required)
          </label>
          <input
            id="age"
            v-model="age"
            type="number"
            min="18"
            max="120"
            class="w-full rounded-lg border border-border-default px-3 py-3 sm:py-2.5 text-base text-text-primary placeholder-text-muted focus:border-safari-light-blue focus:ring-2 focus:ring-safari-light-blue/20 focus:outline-none transition min-h-12"
            placeholder="Your age"
          />
        </div>
        <label class="flex items-start gap-3 cursor-pointer min-h-11">
          <input
            v-model="terms"
            type="checkbox"
            class="mt-1 w-5 h-5 rounded border-border-default text-safari-dark-blue focus:ring-safari-light-blue shrink-0"
          />
          <span class="text-sm text-text-secondary pt-0.5">
            I accept the Terms & Conditions and Responsible Drinking policy.
          </span>
        </label>
        <p v-if="error" class="text-sm text-safari-red">{{ error }}</p>
        <button
          type="submit"
          class="w-full py-3.5 sm:py-3 rounded-lg text-sm font-medium bg-safari-red text-white hover:bg-safari-red/90 active:scale-[0.99] transition min-h-12 touch-manipulation"
        >
          Continue (demo)
        </button>
      </form>
      <p class="mt-5 sm:mt-6 text-xs sm:text-[13px] text-text-muted">
        This is a demo. Full flow will use Facebook/Twitter login and age verification.
      </p>
    </div>
    </div>
  </div>
</template>
