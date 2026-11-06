const browserHost = window.location.hostname;
const apiHost = browserHost === '127.0.0.1' ? 'localhost' : browserHost;

export const API_BASE_URL = `http://${apiHost}:8081/APIEscolaDuartina`;
