class AbrigoAnimais {
  constructor() {
    this.animals = {
      Rex:  { tipo: 'cão',    fav: ['RATO', 'BOLA'] },
      Mimi: { tipo: 'gato',   fav: ['BOLA', 'LASER'] },
      Fofo: { tipo: 'gato',   fav: ['BOLA', 'RATO', 'LASER'] },
      Zero: { tipo: 'gato',   fav: ['RATO', 'BOLA'] },
      Bola: { tipo: 'cão',    fav: ['CAIXA', 'NOVELO'] },
      Bebe: { tipo: 'cão',    fav: ['LASER', 'RATO', 'BOLA'] },
      Loco: { tipo: 'jabuti', fav: ['SKATE', 'RATO'] },
    };

    this.validToys = new Set(['RATO','BOLA','LASER','CAIXA','NOVELO','SKATE']);
    this.MAX_PETS_PER_PERSON = 3;
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const p1 = this.#parseCSV(brinquedosPessoa1);
    const p2 = this.#parseCSV(brinquedosPessoa2);
    const order = this.#parseCSV(ordemAnimais, true);

    // Valida brinquedos das duas pessoas
    if (this.#validateToys(p1).error) return { erro: 'Brinquedo inválido' };
    if (this.#validateToys(p2).error) return { erro: 'Brinquedo inválido' };

    // Valida animais
    if (this.#validateAnimals(order).error) return { erro: 'Animal inválido' };

    const adoptedBy = new Map();
    let countP1 = 0;
    let countP2 = 0;

    for (const name of order) {
      const info = this.animals[name];
      const fav = info.fav;

      const p1HasCompanion = countP1 >= 1;
      const p2HasCompanion = countP2 >= 1;

      const p1Match = this.#matches(name, fav, p1, p1HasCompanion);
      const p2Match = this.#matches(name, fav, p2, p2HasCompanion);

      let result = 'abrigo';

      if (p1Match && p2Match) {
        result = 'abrigo';
      } else if (p1Match && !p2Match) {
        if (countP1 < this.MAX_PETS_PER_PERSON) {
          result = 'pessoa 1';
          countP1++;
        }
      } else if (!p1Match && p2Match) {
        if (countP2 < this.MAX_PETS_PER_PERSON) {
          result = 'pessoa 2';
          countP2++;
        }
      }

      adoptedBy.set(name, result);
    }

    const lista = [...adoptedBy.keys()]
      .sort((a, b) => a.localeCompare(b))
      .map((animal) => `${animal} - ${adoptedBy.get(animal)}`);

    return { lista };
  }

  // Transforma string CSV em array
  #parseCSV(str, keepCase = false) {
    if (!str || !str.trim()) return [];
    return str
      .split(',')
      .map(s => keepCase ? s.trim() : s.trim().toUpperCase())
      .filter(s => s.length > 0);
  }

  // Verifica duplicados
  #hasDuplicates(arr) {
    const seen = new Set();
    for (const x of arr) {
      if (seen.has(x)) return true;
      seen.add(x);
    }
    return false;
  }

  // Valida brinquedos
  #validateToys(toysUpper) {
    for (const t of toysUpper) {
      if (!this.validToys.has(t)) return { error: true };
    }
    if (this.#hasDuplicates(toysUpper)) return { error: true };
    return { error: false };
  }

  // Valida animais
  #validateAnimals(animalNames) {
    for (const n of animalNames) {
      if (!this.animals[n]) return { error: true };
    }
    if (this.#hasDuplicates(animalNames)) return { error: true };
    return { error: false };
  }

  // Verifica se a pessoa tem os brinquedos corretos
  #matches(animalName, fav, personToysUpper, hasCompanionAlready) {
    if (animalName === 'Loco' && hasCompanionAlready) {
      return fav.every(ft => personToysUpper.includes(ft));
    }

    let i = 0;
    for (const toy of personToysUpper) {
      if (toy === fav[i]) i++;
      if (i === fav.length) return true;
    }
    return false;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
