import { PlayerInt } from '../interfaces/PlayerInt';
import { Mechanics } from '../interfaces/Mechanics';
import { skill } from '../interfaces/skill';
import { Player } from './Player';
import { PlayerStatus, EnemyStatus } from '../enums/Status';
import Characters from '../assets/characters';
import { getNextInt } from '../game_resources/ordinary_functions';

export class Thief extends Player implements PlayerInt, Mechanics {

    private speedUp_en: boolean = true;
    private steal_en: boolean = true;
    private doubleSlash_en: boolean;
    private strengthUp_en: boolean;

    constructor(max_hp = 25, max_mp = 23, str = 6, magic = 6, def = 3, skill = 2, speed = 3, lvl = 1) {
        super(Characters.Thief, max_hp, max_mp, str, magic, def, skill, speed, 2, lvl);        
        this.doubleSlash_en = false;
        this.strengthUp_en = false;
        //exp = 199;
        //max_exp = 100;

        this.speed_enhance = 2*(lvl - 1);        
        this.strength_enhance = 2*(lvl - 1);
        this.defense_enhance = 2*(lvl - 1);
    }

    public attack(): number{
        return this.str + 5;
    }

    /*  Enemy Phase: (isPlayer == false)
            Case 0: out of mana, try another magic skill attack normally.
            Case -7: The buff is up, can't use the skill so try another magic skill or attack normally.
            
            None of these happen and the buff is down
    
            Case -1: Can use the buff skill, nothing happens 
    */    
    /*
        Payer Phase: (isPlayer == true)
            Case 0: out of mana, print("not enough mana")
            Case -1: skill is used, nothing happens
            Case -2: skill is already used, nothing happens
    */
   
    protected howManySkills(): number{
        let number_of_total_skills: number = 0;
        if(this.speedUp_en) number_of_total_skills++;
        if(this.steal_en) number_of_total_skills++;
        if(this.doubleSlash_en) number_of_total_skills++;
        if(this.strengthUp_en) number_of_total_skills++;
        return number_of_total_skills;
    }

    private speedUp(isPlayer: boolean): number {
        let mp = this.mp;
        if(isPlayer){            
            if(!this.speed_up){
                if(mp < 6){
                    return PlayerStatus.NO_MP;
                }else{
                    this.mp = (mp - 6 <= 0)? 0 : mp - 6;
                    this.addSpeedBuff();
                    console.log("Speed up (+"+this.speed_buff+")!");
                    return PlayerStatus.BUFF_USED;
                }
            }else{
                console.log("You already used it, wait "+this.speed_buff+" turn(s).");
                return PlayerStatus.NO_BUFF;
            }           
        }else{           
            if(this.speed_up){
                return EnemyStatus.NO_BUFF;
            }else{
                if(mp < 6){
                    return EnemyStatus.NO_MP;
                }else{
                    this.mp = (mp - 6 <= 0)? 0 : mp - 6;
                    this.addSpeedBuff();
                    console.log("Speed up (+"+this.speed_buff+")!");
                    this.speed_up = true;
                    return EnemyStatus.BUFF_USED;
                }
            }         
        }
    }

    private steal(enemy_def: number): number {
        let mp = this.mp;
        if(mp < 5){
            return PlayerStatus.NO_MP;
        }else{
            this.mp = (mp - 5 <= 0)? 0 : mp - 5;
            let health_taken: number = Math.floor( (((this.str+this.magic)/2) + 4 - enemy_def)/2 ); //health taken is equal to half of the damage dealt, including magic
            if(health_taken < 0) health_taken = 0; //just in case the enemy defense is greater
            this.hp = ((this.hp + health_taken) > this.max_hp)? this.max_hp : this.hp + health_taken;
            console.log("+"+health_taken+" Health taken!");
            return (this.str+this.magic/2) + 4 - enemy_def;
        }
    }

    private doubleSlash(enemy_def: number): number {
        let mp = this.mp;
        if(mp < 8){
            return PlayerStatus.NO_MP;
        }else{
            this.mp = (mp - 8 <= 0)? 0 : mp - 8;
            let total_damage: number = 0 ;
            for(let i = 0; i < 2; i++){
                let bonus_damage: number = getNextInt(4);
                total_damage += this.str + bonus_damage - enemy_def;
            }
            return total_damage;
        }
    }

    private strengthUp(isPlayer: boolean): number {
        let mp = this.mp;
        if(isPlayer){            
            if(!this.strength_up){
                if(mp < 6){
                    return PlayerStatus.NO_MP;
                }else{
                    this.mp = (mp - 6 <= 0)? 0 : mp - 6;
                    this.addStrengthBuff();
                    console.log("Strength up (+"+this.strength_buff+")!");
                    this.strength_up = true;
                    return PlayerStatus.BUFF_USED;
                }
            }else{
                console.log("You already used it, wait "+this.strength_buff+" turn(s).");
                return PlayerStatus.NO_BUFF;
            }           
        }else{           
            if(this.strength_up){
                return EnemyStatus.NO_BUFF;
            }else{
                if(mp < 6){
                    return EnemyStatus.NO_MP;
                }else{
                    this.mp = (mp - 6 <= 0)? 0 : mp - 6;
                    this.addStrengthBuff();
                    console.log("Strength up (+"+this.strength_buff+")!");
                    this.strength_up = true;
                    return EnemyStatus.BUFF_USED;
                }
            }         
        }
    }

    public testChance(skill: number, enemy_def: number, recursion_stopper?: number): number {        
        let recursion_limit: number = recursion_stopper || 0;
        if(recursion_limit >= 15) {
            return EnemyStatus.NO_SKILL_MP;
        }

        let damage: number = this.skills(skill,enemy_def,false);
        if(damage != EnemyStatus.NO_MP && damage != EnemyStatus.NO_BUFF && damage != EnemyStatus.BUFF_USED) { // checks every non-attack skill and no mana situations (order: no mana, status effect can't be used, status effect already used)
            return damage; // An attack skill was used, I think
        }else if(damage == EnemyStatus.NO_MP || damage == EnemyStatus.NO_BUFF){
            let chance: number = getNextInt(this.number_of_skills);
            this.testChance(chance,enemy_def,++recursion_limit); // try another skill
        }else if(damage == EnemyStatus.BUFF_USED){
            return EnemyStatus.BUFF_USED; // reference for when effect is applied
        }
        return EnemyStatus.NO_SKILL_MP; // it will never return this
    }
    
    public getSkills(): skill[] {
        let skills: skill[] = [];
        if(this.speedUp_en) skills.push({ id: 1, name: 'Speed Up', mp_cost: 6 });
        if(this.steal_en) skills.push({ id: 2, name: 'Steal', mp_cost: 5 });
        if(this.doubleSlash_en) skills.push({ id: 3, name: 'Double Slash', mp_cost: 8 });
        if(this.strengthUp_en) skills.push({ id: 4, name: 'Strength Up', mp_cost: 6 });
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
    public skills(choice: number, enemy_def: number, isPlayer: boolean): number {
        switch(choice) {
            case 1: 
                return this.speedUp(isPlayer);
            case 2: 
                return this.steal(enemy_def);
            case 3:
                if(this.doubleSlash_en) {
                    return this.doubleSlash(enemy_def);
                }
                return PlayerStatus.WRONG_CHOICE; //returns a wrong choice
            case 4:
                if(this.strengthUp_en) {
                    return this.strengthUp(isPlayer);
                }
                return PlayerStatus.WRONG_CHOICE; //returns a wrong choice
            default:
                return PlayerStatus.WRONG_CHOICE;
        }
    }

    public lvlUp(): void { //18 points distributed
        console.log("Level up!");
        
        let new_hp: number = getNextInt(4);
        console.log("Max HP: "+this.max_hp+" +"+new_hp);
        this.max_hp += new_hp;
        this.hp += new_hp;
        
        let new_mp: number = getNextInt(4);
        console.log("Max MP: "+this.max_mp+" +"+new_mp);
        this.max_mp += new_mp;
        this.mp += new_mp;
        
        let new_str: number = getNextInt(2);
        console.log("Strenght: "+this.str+" +"+new_str);
        this.str += new_str;
        
        let new_def: number = getNextInt(2);
        console.log("Defence: "+this.def+" +"+new_def);
        this.def += new_def;
        
        let new_magic: number = getNextInt(2);
        console.log("Magic: "+this.magic+" +"+new_magic);
        this.magic += new_magic;
        
        let new_skill: number = getNextInt(2);
        console.log("Skill: "+this.skill+" +"+new_skill);
        this.skill += new_skill;
        
        let new_speed: number = getNextInt(2);
        console.log("Speed: "+this.speed+" +"+new_speed);
        this.speed += new_speed;
        
        this.speed_enhance += 2;
        
        this.lvl++;
        this.max_exp += this.newMaxExp();
        
        console.log("");
        if(this.lvl == 3){
            this.doubleSlash_en = true;
            console.log("New skill learned!!: Double Slash");
        }
        if(this.lvl == 4){
            this.strengthUp_en = true;
            console.log("New skill learned!!: Strength Up");
        }
    }
    
    public printStats(): void {
        console.log("Thief stats: HP: "+this.hp+"/"+this.max_hp+"         Strenght: "+this.str);
        console.log("Lvl "+this.lvl+"        MP: "+this.mp+"/"+this.max_mp+"         Magic: "+this.magic+"\n");
    }
}