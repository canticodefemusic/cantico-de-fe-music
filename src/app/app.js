import { bootstrapCanticoApp } from '../bootstrap/bootstrap.js';

document.addEventListener('DOMContentLoaded', async () => {
  await bootstrapCanticoApp({
    rootSelector: '#app',
    environment: 'production'
  });
});
