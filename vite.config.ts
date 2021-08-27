import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default {
  plugins: [vue()],
  define:{
    'process.env':{}
  },
  server:{
	  host:'0.0.0.0',
    strictPort:true,
	  proxy: {
	    '/ecolab': {
	      target: 'http://192.168.90.11:9001',
	      changeOrigin: true,
	      rewrite: (path:string) => path.replace(/^\/ecolab/, '')
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
 
}


