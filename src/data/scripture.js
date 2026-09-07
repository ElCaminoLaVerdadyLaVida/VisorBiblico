// Fuente: Reina-Valera 1909 (RV1909), de dominio público — confirmado por
// Project Gutenberg ("Public domain in the USA"), el archivo de copyright
// de Debian para sword-text-sparv ("not copyrighted... Public Domain") y
// Wikisource. Texto cotejado entre es.wikisource.org/wiki/Biblia_Reina-
// Valera_1909/Marcos/4 y ebible.org/spaRV1909/MRK04.htm — coinciden.
//
// Se citan solo los versículos 35, 37, 38, 39 y 41 (se omiten 36 y 40),
// igual que en la selección original de este proyecto.
//
// "stage" reemplaza los tiempos fijos inventados de la versión anterior:
// ahora la escena y el ambiente sonoro cambian según qué versículo se
// está narrando de verdad, no según un cronómetro adivinado.

export const SCRIPTURE_REFERENCE = 'Marcos 4:35-41 (Reina-Valera 1909, dominio público)';

export const SCRIPTURE_PERICOPE = [
  {
    verse: 35,
    text: 'Y les dijo aquel día cuando fué tarde: Pasemos de la otra parte.',
    stage: 'storm-building',
  },
  {
    verse: 37,
    text: 'Y se levantó una grande tempestad de viento, y echaba las olas en el barco, de tal manera que ya se henchía.',
    stage: 'storm-peak',
  },
  {
    verse: 38,
    text: 'Y él estaba en la popa, durmiendo sobre un cabezal, y le despertaron, y le dicen: ¿Maestro, no tienes cuidado que perecemos?',
    stage: 'storm-peak',
  },
  {
    verse: 39,
    text: 'Y levantándose, increpó al viento, y dijo á la mar: Calla, enmudece. Y cesó el viento, y fué hecha grande bonanza.',
    stage: 'command',
  },
  {
    verse: 41,
    text: 'Y temieron con gran temor, y decían el uno al otro. ¿Quién es éste, que aun el viento y la mar le obedecen?',
    stage: 'calm',
  },
];
