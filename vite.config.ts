import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{rollupOptions:{output:{manualChunks(id){if(id.includes('grammar-bank.json'))return 'exercises';}}}}});
