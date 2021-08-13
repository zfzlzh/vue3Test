import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
	  proxy: {
	    '/ecolab': {
	      target: 'http://192.168.90.11:9001',
	      changeOrigin: true,
	      rewrite: path => path.replace(/^\/ecolab/, '')
	    }
	  }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
	  "~":resolve(__dirname, "static")
    },
  },
  css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./static/css/global.scss";`
        }
      }
    }
  
 
})

