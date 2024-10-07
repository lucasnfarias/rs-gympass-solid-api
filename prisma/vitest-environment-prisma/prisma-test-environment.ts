import type { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Executed!')

    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
  transformMode: 'ssr',
}
