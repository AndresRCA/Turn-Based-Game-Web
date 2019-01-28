import { PlayerInt } from '../interfaces/PlayerInt';
import { Mechanics } from '../interfaces/Mechanics';
import { skill } from '../interfaces/skill';
import { Player } from './Player';
import { PlayerStatus, EnemyStatus } from '../enums/Status';
import Characters from '../assets/characters';
import { getNextInt } from '../game_resources/ordinary_functions';

export class Hero extends Player implements PlayerInt, Mechanics {
	private wish_en: boolean = true;
    private crush_en: boolean = true;
    private strengthUp_en: boolean;
    private judgement_en: boolean;

    constructor(){
    	//image, max_hp, max_mp, str, magic, def, skill, speed, number_of_skills, lvl? = null
    	super(Characters.Hero, 25, 17, 7, 5, 4, 4, 3, 2);     
        this.strengthUp_en = false;
        this.judgement_en = false;      
    }

    //implemented
    public attack(): number{
        return this.str + 7;
    }

    //from abstract
    protected howManySkills(): number {
    	return this.number_of_skills;
    }

    private wish(isPlayer: boolean): number {
    	let mp = this.mp;
    	let hp = this.hp;
    	let max_hp = this.max_hp;

        if(isPlayer) {
            if(mp < 9) {
                return PlayerStatus.NO_MP;
            }
            else {
                this.mp = (mp - 9 <= 0)? 0 : mp - 9;
                this.hp = max_hp;
                console.log("Heavens above have granted your celestial wish.");
                return PlayerStatus.BUFF_USED;
            }    
        }
        else { // Enemy is "true", Player is "false"
        	if(mp < 6) {
        		return EnemyStatus.NO_MP;
        	}
        	else {
        		this.mp = (mp - 6 <= 0)? 0 : mp - 6;
	            this.hp = max_hp;
	            console.log("Heavens above have granted your celestial wish.");
	            return EnemyStatus.BUFF_USED;
        	}
        }
    }
    
    private crush(): number {
    	let mp = this.mp;

        if(mp < 4) {
            return 0;
        }
        else {
            this.mp = (mp - 4 <= 0)? 0 : mp - 4;
            return this.magic + 6;
        }
    }
    
    private strengthUp(isPlayer: boolean): number {
        return 0;
    }
    
    private judgement(): number {
        return 0;
    }
    
    // prepare for some spooky recursion + bad argument naming (recursion_stopper)
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
    
    //implemented
    public getSkills(): skill[] {
        let skills: skill[] = [];
        if(this.wish_en) skills.push({ id: 1, name: 'Wish', mp_cost: 9 });
        if(this.crush_en) skills.push({ id: 2, name: 'Crush', mp_cost: 4 });        
        if(this.strengthUp_en) skills.push({ id: 3, name: 'Strength Up', mp_cost: 6 });
        if(this.judgement_en) skills.push({ id: 4, name: 'Judgement', mp_cost: 10 });
        return skills;
    }
    
    /**
     * This function is used as a way for the program to interpret the choice and outcome of the skills that 
     * a character possesses.
     * @param choice Choice made by the user. 
     * <br>
     * @param enemy_def Needed for damage calculations for cases where an attack skill depends on it.
     * <br>
     * @param isPlayer Boolean value needed for testing the outcome of a choice made by the user (passed onto skills inside). 
     *            Use false for testing and use true for use.
     * <br>
     * @return <p>A unique number for two situations, an attack skill and a status effect skill. Since 
     * a <b>status effect</b> skill modifies the properties of a character and doesn't deal damage like an attack skill, 
     * these two have to be separated for the <b>battle phase</b> outcome.</p>
     *         <h3>What it returns:</h3>
     *          <ul>
     *              <li><b style="color:#42a0ce">-7</b>: if the choice made is the status effect skill</li>
     *              <li><b style="color:#42a0ce">*-{-1}</b>: (everything else except -1), if the choice made is the attack skill</li>
     *              <li><b style="color:#42a0ce">-1</b>: if the user makes a wrong choice</li>
     *          </ul>
     */ 
    //implemented
    public skills(choice: number, enemy_def: number, isPlayer: boolean): number {
    	switch(choice) {
    		case 1: 
    			return this.wish(isPlayer);
    		case 2: 
    			return this.crush(); //returns damage
    		case 3:
    			if(this.strengthUp_en) {
    				return this.strengthUp(isPlayer);
    			}
    			return PlayerStatus.WRONG_CHOICE; //returns a wrong choice
    		case 4:
    			if(this.judgement_en) {
    				return this.judgement();
    			}
    			return PlayerStatus.WRONG_CHOICE; //returns a wrong choice
    		default:
    			return PlayerStatus.WRONG_CHOICE;
    	}
    }

    //implemented
    public lvlUp(): void { //18 points distributed
        console.log("Level up!");
        
        let new_hp: number = getNextInt(6);
        console.log("Max HP: "+this.max_hp+" +"+new_hp);
        this.max_hp += new_hp;
        this.hp += new_hp;
        
        let new_mp: number = getNextInt(3);
        console.log("Max MP: "+this.max_mp+" +"+new_mp);
        this.max_mp += new_mp;
        this.mp += new_mp;
        
        let new_str: number = getNextInt(3);
        console.log("Strenght: "+this.str+" +"+new_str);
        this.str += new_str;
        
        let new_def: number = getNextInt(2);
        console.log("Defence: "+this.def+" +"+new_def);
        this.def += new_def;
        
        let new_magic: number = getNextInt(2);
        console.log("Magic: "+this.magic+" +"+new_magic);
        this.magic += new_magic;
        
        let new_skill: number = getNextInt(1);
        console.log("Skill: "+this.skill+" +"+new_skill);
        this.skill += new_skill;
        
        let new_speed: number = getNextInt(1);
        console.log("Speed: "+this.speed+" +"+new_speed);
        this.speed += new_speed;
        
        this.lvl++;
        this.max_exp += this.newMaxExp();
        
        console.log("");
        if(this.lvl == 3) {
            this.strengthUp_en = true;
            console.log("New skill learned!!: Strength Up");
        }
        if(this.lvl == 4) {
            this.judgement_en = true;
            console.log("New skill learned!!: Judgement");
        }
    }
    
    //implemented
	public printStats(): void {
		console.log("Hero stats: HP: "+this.hp+"/"+this.max_hp+"         Strenght: "+this.str);
		console.log("Lvl "+this.lvl+"       MP: "+this.mp+"/"+this.max_mp+"         Magic: "+this.magic+"\n");
	}
}