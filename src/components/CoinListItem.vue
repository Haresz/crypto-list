<template>
  <ion-item lines="full" class="coin-item">
    <ion-label>
      <div class="coin-row">
        <div class="coin-column">
          <span class="caption">Rank</span>
          <span class="rank">{{ coin.rank }}</span>
        </div>

        <div class="coin-column name-column">
          <span class="name">{{ coin.name }}</span>
          <span class="symbol">{{ coin.symbol }}</span>
        </div>

        <div class="coin-column price-column">
          <span class="caption">USD</span>
          <span class="price">{{ coin.price_usd }}</span>
        </div>
      </div>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel } from '@ionic/vue';
import type { Coin } from '@/types/Coin';

// Data satu koin dikirim oleh Home.vue melalui prop.
defineProps<{ coin: Coin }>();
</script>

<style scoped>
.coin-item {
  --background: #fff3cd;
  --border-color: #e5d8a4;
  --min-height: 76px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
}

.coin-item ion-label {
  margin: 10px 0;
}

.coin-row {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.coin-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.caption {
  color: #7a6a2f;
  font-size: 11px;
  line-height: 1.2;
  text-transform: uppercase;
}

.rank,
.symbol,
.price {
  color: #24211a;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.name {
  overflow: hidden;
  color: #6f602c;
  font-size: 12px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-column {
  text-align: right;
}

.price {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
