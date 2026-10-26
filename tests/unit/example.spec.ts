import { flushPromises, mount } from '@vue/test-utils'
import type { App } from 'vue'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Home from '@/views/Home.vue'

const coins = [
  { rank: 1, name: 'Bitcoin', symbol: 'BTC', price_usd: '80197.56' },
  { rank: 2, name: 'Ethereum', symbol: 'ETH', price_usd: '2331.92' },
]

const axiosMock = {
  get: vi.fn(),
}

// Plugin pengganti VueAxios agar unit test tidak melakukan request jaringan.
const axiosPlugin = {
  install(app: App) {
    app.config.globalProperties.axios = axiosMock as any
  },
}

const mountHome = () =>
  mount(Home, {
    global: {
      plugins: [axiosPlugin],
    },
  })

describe('Home.vue', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    axiosMock.get.mockReset()
    axiosMock.get.mockResolvedValue({ data: { data: coins } })
  })

  test('menampilkan data koin dari API', async () => {
    const wrapper = mountHome()
    await flushPromises()

    expect(axiosMock.get).toHaveBeenCalledWith('https://api.coinlore.net/api/tickers/')
    expect(wrapper.text()).toContain('Bitcoin')
    expect(wrapper.text()).toContain('BTC')
    expect(wrapper.text()).toContain('80197.56')
  })

  test('tombol Refresh mengambil ulang data', async () => {
    const wrapper = mountHome()
    await flushPromises()

    await wrapper.get('.refresh-button').trigger('click')
    await flushPromises()

    expect(axiosMock.get).toHaveBeenCalledTimes(2)
  })

  test('menampilkan pesan error saat request gagal', async () => {
    axiosMock.get.mockRejectedValueOnce(new Error('Network Error'))
    const wrapper = mountHome()
    await flushPromises()

    expect(wrapper.text()).toContain('Gagal memuat data cryptocurrency')
  })
})
