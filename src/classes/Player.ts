import { Unit } from './Unit';

export abstract class Player extends Unit {
	protected max_exp: number;

	constructor(image: string, max_hp: number, max_mp: number, str: number, magic: number, def: number, skill: number, speed: number, number_of_skills: number, lvl = 1) {
		super(image, max_hp, max_mp, str, magic, def, skill, speed, number_of_skills, lvl);
		this.max_exp = 100; // starting max_exp at lvl 1
		if(lvl) { // if lvl is higher than 1
			this.max_exp += this.newMaxExp()*(lvl - 1);
		}
	}

	public hpPotion(): void {
        console.log("+5 hp recovered");
        this.hp = (this.hp + 5 >= this.max_hp)? this.max_hp : this.hp + 5;
    }
   
    public mpPotion(): void {
        console.log("+5 mp recovered");
        this.mp = (this.mp + 5 >= this.max_mp)? this.max_mp : this.mp + 5;
    }
    
    public newMaxExp(): number {
        return this.max_exp*3/2;
    }

    public getMax_exp(): number {
        return this.max_exp;
    }

    protected abstract howManySkills(): number;
}