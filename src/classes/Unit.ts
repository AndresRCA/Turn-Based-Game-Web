export abstract class Unit {
    protected image: string;
    protected max_hp: number;
    protected max_mp: number;
    protected hp: number;
    protected mp: number;
    protected str: number;
    protected magic: number;
    protected def: number;
    protected skill: number;
    protected speed: number;
    protected exp: number;
    protected lvl: number;
    protected number_of_skills: number;
    
    protected defense_up: boolean;
    protected defense_buff: number;
    protected defense_enhance: number;
    protected speed_up: boolean;
    protected speed_buff: number;
    protected speed_enhance: number;
    protected strength_up: boolean;
    protected strength_buff: number;
    protected strength_enhance: number;
    
    protected slow_heal_up: boolean;
    protected slow_heal_buff: number;
    protected slow_heal_supplied: number;
    protected slow_heal_duration: number;

    constructor(image: string, max_hp: number, max_mp: number, str: number, magic: number, def: number, skill: number, speed: number, number_of_skills: number, lvl: number) {
        this.image = image;
        this.max_hp = max_hp;
        this.max_mp = max_mp;
        this.hp = max_hp;
        this.mp = max_mp;
        this.str = str;
        this.magic = magic;
        this.def = def;
        this.skill = skill;
        this.speed = speed;
        this.exp = 0;
        this.number_of_skills = number_of_skills;
        this.lvl = lvl;


        this.defense_up = false;
        this.defense_buff = 0;
        this.defense_enhance = 0;
        this.speed_up = false;
        this.speed_buff = 0;
        this.speed_enhance = 0;
        this.strength_up = false;
        this.strength_buff = 0;
        this.strength_enhance = 0;       
        this.slow_heal_up = false;
        this.slow_heal_buff = 0;
        this.slow_heal_supplied = 0;
        this.slow_heal_duration = 0;
    }

    public getImage(): string {
        return this.image;
    }

    public getHp(): number {
        return this.hp;
    }

    public getMp(): number {
        return this.mp;
    }

    public getStr(): number {
        return this.str;
    }

    public getMagic(): number {
        return this.magic;
    }

    public getDef(): number {
        return this.def;
    }

    public getSkill(): number {
        return this.skill;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getExp(): number {
        return this.exp;
    }

    public getLvl(): number {
        return this.lvl;
    }

    public getMax_hp(): number {
        return this.max_hp;
    }

    public getMax_mp(): number {
        return this.max_mp;
    }

    public getNumber_of_skills(): number {
        return this.number_of_skills;
    }

    public setHp(hp: number): void {
        this.hp = hp;
    }

    public setMp(mp: number): void {
        this.mp = mp;
    }

   	public setStr(str: number): void {
        this.str = str;
    }

	public setDef(def: number): void {
        this.def = def;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public setExp(exp: number): void {
        this.exp = exp;
    }

	public setLvl(lvl: number): void {
        this.lvl = lvl;
    }
    
    protected addSpeedBuff(): void {
        this.speed_up = true;
        this.speed_buff = (this.lvl + 6) + this.speed_enhance;
        this.speed += this.speed_buff;
    }
    
    protected addDefenseBuff(): void {
        this.defense_up = true;
        this.defense_buff = (this.lvl + 4) + this.defense_enhance;
        this.def += this.defense_buff;
    }
    
    protected addStrengthBuff(): void {
        this.strength_up = true;
        this.strength_buff = (this.lvl + 4) + this.strength_enhance;
        this.str += this.strength_buff;
    }
    
    protected addSlowHeal(): void {
        this.slow_heal_up = true;
        this.slow_heal_duration = 5;
        this.slow_heal_supplied = this.slow_heal_buff; //I'm keeping this here because this value may differ at some point between classes
    }
    
    public deBuffGradually(): void {
        if((this.defense_buff - this.defense_enhance) > 0 && this.defense_up){
            this.def--;
            this.defense_buff--;
            if((this.defense_buff - this.defense_enhance) <= 0) this.defense_up = false;
        }
        
        if((this.strength_buff - this.strength_enhance) > 0 && this.strength_up){
            this.str--;
            this.strength_buff--;
            if((this.strength_buff - this.strength_enhance) <= 0) this.strength_up = false;
        }
        
        if((this.speed_buff - this.speed_enhance) > 0 && this.speed_up){
            this.speed--;
            this.speed_buff--;
            if((this.speed_buff - this.speed_enhance) <= 0) this.speed_up = false;
        }
        
        if(this.slow_heal_up){
            if(this.hp < this.max_hp){
                this.hp += this.slow_heal_supplied;
                if(this.hp > this.max_hp){
                    this.hp = this.max_hp;
                }
            }
            this.slow_heal_duration--;
            if(this.slow_heal_duration <= 0){
                this.slow_heal_up = false;
            }
        }
    }
    
    public deBuff(): void {
        this.defense_up = false;
        this.def -= this.defense_buff;
        this.defense_buff = 0;
        
        this.speed_up = false;
        this.speed -= this.speed_buff;
        this.speed_buff = 0;
        
        this.strength_up = false;
        this.str -= this.strength_buff;
        this.strength_buff = 0;
        
        this.slow_heal_up = false;
        this.slow_heal_duration = 0;
    }
}
