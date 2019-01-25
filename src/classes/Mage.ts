import { PlayerInt } from '../interfaces/PlayerInt';
import { Mechanics } from '../interfaces/Mechanics';
import { Player } from './Player';
import { PlayerStatus, EnemyStatus } from '../enums/Status';
import Characters from '../assets/characters';

//generates a whole number that is within the range of number_of_skills
function getNextInt(range: number): number {
	return Math.floor(Math.random() * range)  + 1;
}

export class Mage extends Player implements PlayerInt, Mechanics {
	//make a burning effect in deBuffGradually() and a healing effect.

	private defenseUp_en: boolean = true;
	private lighting_en: boolean = true;
	private slowHeal_en: boolean;
	private fireBlow_en: boolean;

	constructor() {
		super(Characters.Mage, 19, 27, 3, 8, 2, 2, 4, 2);
		this.slowHeal_en = false;
		this.fireBlow_en = false;
		this.slow_heal_buff = 2; // not sure if this actually changes
		// defense_buff may be missing
	}

	public attack(): number {
        return this.str + 2;
    }

    protected howManySkills(): number {
    	let number_of_total_skills: number = 0;
        if(this.defenseUp_en) number_of_total_skills++;
        if(this.lighting_en) number_of_total_skills++;
        if(this.slowHeal_en) number_of_total_skills++;
        if(this.fireBlow_en) number_of_total_skills++;
        return number_of_total_skills;
    }

    private defenseUp(isPlayer: boolean): number {
    	let mp = this.mp;
        if(isPlayer){            
            if(!this.defense_up){
                if(mp < 9){
                    return PlayerStatus.NO_MP;
                }else{
                    this.mp = (mp - 9 <= 0)? 0 : mp - 9;
                    this.addDefenseBuff();
                    console.log("Defense up (+"+this.defense_buff+")!");
                    this.defense_up = true;
                    return PlayerStatus.BUFF_USED;
                }
            }else{
                console.log("You already used it, wait "+this.defense_buff+" turn(s).");
                return PlayerStatus.NO_BUFF;
            }           
        }else{           
            if(this.defense_up){
                return EnemyStatus.NO_BUFF;
            }else{
                if(mp < 9){
                    return EnemyStatus.NO_MP;
                }else{
                    this.mp = (mp - 9 <= 0)? 0 : mp - 9;
                    this.addDefenseBuff();
                    console.log("Defense up (+"+this.defense_buff+")!");
                    return EnemyStatus.BUFF_USED;
                }
            }         
        }
    }

    private lighting(): number {
    	let mp = this.mp;
        if(mp < 7){
            return PlayerStatus.NO_MP;
        }
        else{
            this.mp = (mp - 7 <= 0)? 0 : mp - 7;
            return this.magic + 8;
        }  
    }

    private slowHeal(isPlayer: boolean): number {
    	let mp = this.mp;
        if(isPlayer){
            if(!this.slow_heal_up){
                if(mp < 5){
                    return PlayerStatus.NO_MP;
                }else{
                    this.mp = (mp - 5 <= 0)? 0 : mp - 5;
                    this.addSlowHeal();
                    console.log("+2 hp for 5 turns.");
                    return PlayerStatus.BUFF_USED;
                }
            }else{
                console.log("You already used it, wait "+this.slow_heal_duration+" turn(s).");
                return PlayerStatus.NO_BUFF;
            }
        }else{
            if(this.slow_heal_up){
                return EnemyStatus.NO_BUFF;
            }else{
                if(mp < 5){
                    return EnemyStatus.NO_MP;
                }else{
                    this.mp = (mp - 5 <= 0)? 0 : mp - 5;
                    this.addSlowHeal();
                    console.log("+2 hp for 5 turns.");
                    return EnemyStatus.BUFF_USED;
                }
            }
        }    
    }

    private fireBlow(): number { //How do I transfer a status effect?
        return 0;
    }

    public printSkills(): void {
        console.log("1.Defense up (-9 mana)    2.Lighting (-7 mana)");
        if(this.slowHeal_en){
            console.log("3.Slow Heal (-5 mana)     ");
        }
        if(this.fireBlow_en){
            console.log("4.Fire Blow (-10 mana)");
        }
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
    public skills(choice: number, enemy_def: number, isPlayer: boolean): number {
    	switch(choice) {
    		case 1: 
    			return this.defenseUp(isPlayer);
    		case 2: 
    			return this.lighting(); //returns damage
    		case 3:
    			if(this.slowHeal_en) {
    				return this.slowHeal(isPlayer);
    			}
    			return PlayerStatus.WRONG_CHOICE; //returns a wrong choice
    		case 4:
    			if(this.fireBlow_en) {
    				return this.fireBlow();
    			}
    			return PlayerStatus.WRONG_CHOICE; //returns a wrong choice
    		default:
    			return PlayerStatus.WRONG_CHOICE;
    	}
    }

    public lvlUp(): void { //18 points distributed
        console.log("Level up!");
        
        let new_hp: number = getNextInt(3);
        console.log("Max HP: "+this.max_hp+" +"+new_hp);
        this.max_hp += new_hp;
        this.hp += new_hp;
        
        let new_mp: number = getNextInt(6);
        console.log("Max MP: "+this.max_mp+" +"+new_mp);
        this.max_mp += new_mp;
        this.mp += new_mp;
        
        let new_str: number = getNextInt(1);
        console.log("Strenght: "+this.str+" +"+new_str);
        this.str += new_str;
        
        let new_def: number = getNextInt(1);
        console.log("Defence: "+this.def+" +"+new_def);
        this.def += new_def;
        
        let new_magic: number = getNextInt(3);
        console.log("Magic: "+this.magic+" +"+new_magic);
        this.magic += new_magic;
        
        let new_skill: number = getNextInt(2);
        console.log("Skill: "+this.skill+" +"+new_skill);
        this.skill += new_skill;
        
        let new_speed: number = getNextInt(2);
        console.log("Speed: "+this.speed+" +"+new_speed);
        this.speed += new_speed;
        
        this.defense_enhance += 2;
        
        this.lvl++;
        this.max_exp += this.newMaxExp();
        
        console.log("");
        if(this.lvl == 3){
            this.slowHeal_en = true;
            console.log("New skill learned!!: Slow Heal");
        }
        if(this.lvl == 4){
            this.fireBlow_en = true;
            console.log("New skill learned!!: Fire Blow");
        }
    }

    public printStats(): void {
        console.log("Mage stats: HP: "+this.hp+"/"+this.max_hp+"         Strenght: "+this.str);
        console.log("Lvl "+this.lvl+"       MP: "+this.mp+"/"+this.max_mp+"         Magic: "+this.magic+"\n");
    }
}
