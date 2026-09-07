import './style.css';
import { AppController } from './app/AppController.js';

window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
