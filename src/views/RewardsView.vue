<script setup>
import { ref } from 'vue'

const rewards = ref([
  { id: 1, type: 'MOTM', description: 'Correct Man of the Match prediction', status: 'Available', bar: null },
  { id: 2, type: 'Weekly', description: 'Top 10 national this week', status: 'Redeemed', bar: 'Bar Alpha' },
])
</script>

<template>
  <div class="container py-4 py-md-5">
    <header class="mb-5 mb-md-5">
      <h1 class="h3 fw-bold text-white mb-1">Rewards</h1>
      <p class="text-white text-opacity-80 mb-0">
        Redeem your vouchers at partner bars. Scan the bar's QR to join their league or redeem. 21+ only.
      </p>
    </header>

    <div class="card mb-5 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover table-dark mb-0" aria-label="Your rewards">
          <thead>
            <tr>
              <th class="border-white border-opacity-10 px-3 py-3 small fw-semibold">Type</th>
              <th class="border-white border-opacity-10 px-3 py-3 small fw-semibold">Description</th>
              <th class="border-white border-opacity-10 px-3 py-3 small fw-semibold">Status</th>
              <th class="border-white border-opacity-10 px-3 py-3 small fw-semibold">Redeemed at</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rewards" :key="r.id">
              <td class="px-3 py-3 small fw-medium text-white">{{ r.type }}</td>
              <td class="px-3 py-3 small text-white text-opacity-85">{{ r.description }}</td>
              <td class="px-3 py-3">
                <span
                  class="badge px-2 py-1 small"
                  :class="r.status === 'Redeemed' ? 'bg-dark text-white' : 'bg-danger'"
                >
                  {{ r.status }}
                </span>
              </td>
              <td class="px-3 py-3 small text-white text-opacity-85">{{ r.bar || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card border border-white border-opacity-10">
      <div class="card-body p-4 p-md-5">
        <h2 class="h6 fw-bold text-white mb-4">How to redeem</h2>
        <ol class="text-white text-opacity-85 small mb-0 ps-3">
          <li class="mb-2">Get your reward code after winning (MOTM, weekly, or grand).</li>
          <li class="mb-2">Visit a partner bar and show your code.</li>
          <li class="mb-2">Bar scans your code; backend verifies and marks as redeemed.</li>
          <li>Single use only. Play responsibly. 21+.</li>
        </ol>
      </div>
    </div>
  </div>
</template>
