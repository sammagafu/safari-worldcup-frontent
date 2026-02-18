<script setup>
import { ref } from 'vue'

const rewards = ref([
  { id: 1, type: 'MOTM', description: 'Correct Man of the Match prediction', status: 'Available', bar: null },
  { id: 2, type: 'Weekly', description: 'Top 10 national this week', status: 'Redeemed', bar: 'Bar Alpha' },
])
</script>

<template>
  <div class="w-full min-w-0 bg-transparent px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
    <header class="mb-8 sm:mb-10">
      <h1 class="text-xl sm:text-display-sm font-bold text-text-primary tracking-tight mb-2">
        Rewards
      </h1>
      <p class="text-base text-text-secondary leading-relaxed">
        Redeem your vouchers at partner bars. Scan the bar’s QR to join their league or redeem. 21+ only.
      </p>
    </header>

    <section class="rounded-lg border border-border-subtle bg-surface-elevated overflow-x-auto mb-10 sm:mb-12" aria-label="Your rewards">
      <table class="w-full text-left min-w-80">
        <thead>
          <tr class="bg-safari-dark-blue text-white">
            <th class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-3xs font-semibold">Type</th>
            <th class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-3xs font-semibold">Description</th>
            <th class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-3xs font-semibold">Status</th>
            <th class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-3xs font-semibold">Redeemed at</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in rewards"
            :key="r.id"
            class="border-t border-border-subtle hover:bg-surface transition"
          >
            <td class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-[14px] font-medium text-text-primary">{{ r.type }}</td>
            <td class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-[14px] text-text-secondary">{{ r.description }}</td>
            <td class="px-4 sm:px-5 py-3 sm:py-4">
              <span
                class="inline-block px-2.5 py-1 rounded text-2.5xs sm:text-xs font-medium"
                :class="r.status === 'Redeemed'
                  ? 'bg-safari-dark-blue/10 text-safari-dark-blue'
                  : 'bg-safari-red/10 text-safari-red'"
              >
                {{ r.status }}
              </span>
            </td>
            <td class="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-[14px] text-text-secondary">{{ r.bar || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="rounded-lg border border-border-subtle bg-surface-elevated p-6 sm:p-8 md:p-10" aria-label="How to redeem">
      <h2 class="text-sm sm:text-base font-semibold text-text-primary mb-4">How to redeem</h2>
      <ol class="list-decimal list-inside text-sm text-text-secondary space-y-3">
        <li>Get your reward code after winning (MOTM, weekly, or grand).</li>
        <li>Visit a partner bar and show your code.</li>
        <li>Bar scans your code; backend verifies and marks as redeemed.</li>
        <li>Single use only. Play responsibly. 21+.</li>
      </ol>
    </section>
  </div>
</template>
