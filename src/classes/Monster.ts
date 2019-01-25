import { Mechanics } from '../interfaces/Mechanics';
import { Unit } from './Unit';
import { EnemyStatus } from '../enums/Status';
import Monsters from '../assets/monsters';
import { getNextInt } from '../game_resources/ordinary_functions';

export class Monster extends Unit implements Mechanics {
    
    private id: number;
    
    // (String image, int id, int lvl, int max_hp, int max_mp, int str, int magic, int def, int number_of_skills)
    constructor(image: string, max_hp: number, max_mp: number, str: number, magic: number, def: number, skill: number, speed: number, number_of_skills: number, lvl: number, id: number) {
    	super(image, max_hp, max_mp, str, magic, def, skill, speed, number_of_skills, lvl);
    	this.id = id;

    	this.exp = 34 + 13*((lvl * 3)/2);
    }
    
    public getId(): number {
        return this.id;
    }
    
    public attack(): number {
    	let lvl = this.lvl;
    	let str = this.str;
        if(lvl <= 2) return str + 3;
        else if(lvl > 2 && lvl < 6) return str + 5;
        else return str + 7; //meanwhile, this will stay like this
    }
    
    public skills(choice: number, enemy_def: number, key: boolean): number {
        if(this.image === Monsters.Boss) {
            if(choice  == 1) {
                return this.reality(); //returns damage
            }
            else return -4; //this could be impossible, for now I control the input range of the AI
        }
        else return EnemyStatus.NO_SKILL_MP; //normal attack in testChance    
    }
    
    public reality(): number {
    	let mp = this.mp;
        if(mp < 13){
            return EnemyStatus.NO_MP;
        }
        else{
            this.mp = (mp - 13 <= 0)? 0 : mp - 13;
            return this.magic + 10;
        }    
    }
    
    public magicAttack(): boolean { //my boolean answer for can he use a skill? (I wish the min mp required wouldn't depend on a value given by the programmer because he knows the minimum required)
        return (this.mp >= 13);
    }
    
    public testChance(skill: number, enemy_def: number, recursion_stopper?: number): number {        
        let recursion_limit: number = recursion_stopper || 0;
        if(recursion_limit >= 15) {
        	return EnemyStatus.NO_SKILL_MP;
        }

        let damage: number = this.skills(skill,enemy_def,false);
        if(damage != EnemyStatus.NO_MP && damage != EnemyStatus.NO_BUFF && damage != EnemyStatus.BUFF_USED) { // checks every non-attack skill and no mana situations (order: no mana, status effect can't be used, status effect already used)
            return damage; // An attack skill was used, I think
        }
        else if(damage == EnemyStatus.NO_MP || damage == EnemyStatus.NO_BUFF) {
            let chance: number = getNextInt(this.number_of_skills);
            this.testChance(chance,enemy_def,++recursion_limit); // try another skill
        }
        else if(damage == EnemyStatus.BUFF_USED) {
            return EnemyStatus.BUFF_USED; // reference for when effect is applied
        }
        return EnemyStatus.NO_SKILL_MP; // it will never return this
    }

    public printStats(): void {
        console.log("Monster stats: HP: "+this.hp+"/"+this.max_hp+"         Strenght: "+this.str);
        console.log("Lvl "+this.lvl+"          MP: "+this.mp+"/"+this.max_mp+"         Magic: "+this.magic+"\n");
    }
}
