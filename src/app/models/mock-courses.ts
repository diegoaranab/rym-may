import { Course } from './course.model';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    nombre: 'Extensiones de pestañas – Básico',
    descripcion: 'Aprende la técnica clásica para aplicar extensiones de pestañas con seguridad y precisión.',
    duracion: '2 días',
    precio: 'MX$\u00a03\u00a0500',
    imagen: 'https://picsum.photos/seed/pestanas/280/160'
  },
  {
    id: '2',
    nombre: 'Uñas acrílicas – Intermedio',
    descripcion: 'Perfecciona esculpido, limado y decoración bajo la guía de nuestras instructoras.',
    duracion: '3 días',
    precio: 'MX$\u00a04\u00a0200',
    imagen: 'https://picsum.photos/seed/unasin/280/160'
  },
  {
    id: '3',
    nombre: 'Nanoplastia capilar',
    descripcion: 'Certifícate en el alisado más avanzado de la línea Rym\u00a0May Nanoplastia\u00a095\u00a0%.',
    duracion: '1 día',
    precio: 'MX$\u00a05\u00a0800',
    imagen: 'https://picsum.photos/seed/nanoplastia/280/160'
  }
];
