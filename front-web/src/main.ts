import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'

createApp(App)
	.use(ElementPlus)
	.mount('#app')
