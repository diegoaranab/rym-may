import { TestBed } from '@angular/core/testing';
import { CourseService } from './services/course.service';
import { Course } from './models/course.model';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  it('should perform basic CRUD', () => {
    expect(service.findAll().length).toBe(0);

    const c: Course = {id: '1', nombre: 'n', descripcion: 'd', duracion: '1', precio: '$', imagen: ''};
    service.create(c);
    expect(service.findAll().length).toBe(1);

    service.update({...c, nombre: 'mod'});
    expect(service.findAll()[0].nombre).toBe('mod');

    service.remove('1');
    expect(service.findAll().length).toBe(0);
  });
});
