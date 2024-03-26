import {Person} from './person.model';

describe('Test for person', ()=>{
  let person: Person;

  beforeEach(()=>{
    person = new Person('Lina','Velásquez',24,56.5,1.60)
  })
  it('atributos',()=>{
    expect(person.name).toEqual('Lina');
    expect(person.age).toEqual(24);
  })

  describe('Test for calcIMC',()=>{
    it('should return a string:down', ()=>{
      person.weight =40;
      person.height = 1.65;

      const rta = person.calcIMC();

      expect(rta).toEqual('Down')
    })


    it('should return a string:normal', ()=>{
      person.weight =58;
      person.height = 1.65;

      const rta = person.calcIMC();

      expect(rta).toEqual('Normal')
    })

    it('should return a string:OverWeight', ()=>{
      person.weight =70;
      person.height = 1.65;

      const rta = person.calcIMC();

      expect(rta).toEqual('OverWeight')
    })

    it('should return a string:OverWeight level 1', ()=>{
      person.weight =76;
      person.height = 1.65;

      const rta = person.calcIMC();

      expect(rta).toEqual('OverWeight level 1')
    })

    it('should return a string:OverWeight level 3', ()=>{
      person.weight =111;
      person.height = 1.65;

      const rta = person.calcIMC();

      expect(rta).toEqual('OverWeight level 3')
    })

  })


})
