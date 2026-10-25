import {defineConfig} from 'vite';
export default defineConfig({server:{host:'0.0.0.0',proxy:{'/api':{target:'http://app:3000',changeOrigin:true},'/health':{target:'http://app:3000',changeOrigin:true}}}});
