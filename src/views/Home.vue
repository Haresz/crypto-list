<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import CoinListItem from '@/components/CoinListItem.vue';
import type { Coin } from '@/types/Coin';

const API_URL = 'https://api.coinlore.net/api/tickers/';

export default defineComponent({
  name: 'HomeView',
  components: {
    CoinListItem,
    IonButton,
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  },
  data() {
    return {
      coins: [] as Coin[],
      loading: true,
      error: '',
    };
  },
  mounted() {
    // Muat data pertama kali setelah komponen terpasang.
    this.refresh();
  },
  methods: {
    async refresh(): Promise<void> {
      this.loading = true;
      this.error = '';

      try {
        // Axios tersedia sebagai this.axios melalui plugin VueAxios di main.ts.
        const response = await this.axios.get<{ data: Coin[] }>(API_URL);
        this.coins = response.data.data;
      } catch (error) {
        console.error('Gagal mengambil data cryptocurrency:', error);
        this.error =
          'Gagal memuat data cryptocurrency. Periksa koneksi internet, lalu tekan Refresh.';
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Cryptocurrency</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-button
          class="refresh-button"
          expand="block"
          color="primary"
          :disabled="loading"
          @click="refresh"
        >
          Refresh
        </ion-button>
      </div>

      <div v-if="loading" class="ion-padding ion-text-center status">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Memuat data cryptocurrency...</p>
      </div>

      <div v-else-if="error" class="ion-padding status" role="alert">
        <ion-text color="danger">
          <p>{{ error }}</p>
        </ion-text>
      </div>

      <ion-list v-else class="coin-list">
        <CoinListItem v-for="coin in coins" :key="coin.rank" :coin="coin" />
      </ion-list>
    </ion-content>
  </ion-page>
</template>



<style scoped>
.status {
  color: var(--ion-color-medium);
}

.status p {
  margin: 8px 0 0;
}

.coin-list {
  padding-bottom: 16px;
}
</style>
