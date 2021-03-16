const x : any = 42;     // x is any type
const y : number | string = 'Hello';    // y is number or string

interface Duck {
    name: string;
    numLegs: number;
    makeSound: (sound : string) => void;
}

export const duck1: Duck = {
    name: 'Huey',
    numLegs: 2,
    makeSound: (sound : any) => console.log(sound)
}