import { TicketList } from './TicketList.js';

const root = document.getElementById('app');
const list = new TicketList(root);
list.init();