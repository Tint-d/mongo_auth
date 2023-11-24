// oop => error handling

// js base => prototype

class Person {
  //   #age;
  constructor(name) {
    this.name = name;
    this.age = 23;
  }
  introduce() {
    return "Person ....";
  }
}

class Human extends Person {
  constructor(name, gender) {
    super(name);
    // this.name = this.name;
    this.incomeGender = gender;
  }
  introduce() {
    return "Human...";
  }
}

const human = new Human("jhon", "male");
const person = new Person("Doe");
console.log(human.introduce());
console.log(person.introduce());

function Test(name) {
  //   const age = 23;
  this.age = 23;
  //   console.log(age);
  return `My name is ${name}`;
}

const test = new Test("Jhon");

// console.log(test.age);

const fruit = {
  one: 1,
  one: 2,
};
