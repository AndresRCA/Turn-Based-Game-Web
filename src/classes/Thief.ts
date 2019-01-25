// package Clases;

// public class Thief extends Player{
    
//     private boolean speedUp = true;
//     private boolean steal = true;
//     private boolean doubleSlash;
//     private boolean strengthUp;
    
//     public Thief(){ //65 points
//         image = Assets.Thief;
//         max_hp = 22;    
//         hp = max_hp;
//         max_mp = 23;
//         mp = max_mp;
//         str = 6;
//         def = 3;
//         magic = 6;
//         skill = 2;
//         speed = 3;
//         exp = 0;
//         max_exp = 100;
//         lvl = 1;
        
//         doubleSlash = false;
//         strengthUp = false;
//         number_of_skills = howManySkills();
        
//         speed_up = false;
//         speed_buff = 0;
//         speed_enhance = 0;
//         strength_up = false;
//         strength_buff = 0;
//         strength_enhance = 0;
//         defense_up = false;
//         defense_buff = 0;
//         defense_enhance = 0;
//         slow_heal_up = false;
//     }
    
//     public Thief(int max_hp, int max_mp, int str, int def, int magic, int skill, int speed){
//         image = Assets.Thief;
//         this.max_hp = max_hp;    
//         this.hp = max_hp;
//         this.max_mp = max_mp;
//         this.mp = max_mp;
//         this.str = str;
//         this.def = def;
//         this.magic = magic;
//         this.skill = skill;
//         this.speed = speed;
//         exp = 199;
//         max_exp = 100;
//         lvl = 2;
        
//         doubleSlash = lvl >= 3;
//         strengthUp = lvl >= 4;
//         number_of_skills = howManySkills();
        
//         speed_up = false;
//         speed_buff = 0;
//         speed_enhance = 2*(lvl - 1);
//         strength_up = false;
//         strength_buff = 0;
//         strength_enhance = 2*(lvl - 1);
//         defense_up = false;
//         defense_buff = 0;
//         defense_enhance = 2*(lvl - 1);
//     }
    
//     @Override
//     public int attack(){
//         return str + 5;
//     }    
    
//     /*  Enemy Phase: (isPlayer == false)
//             Case 0: out of mana, try another magic skill attack normally.
//             Case -7: The buff is up, can't use the skill so try another magic skill or attack normally.
            
//             None of these happen and the buff is down
    
//             Case -1: Can use the buff skill, nothing happens 
//     */    
//     /*
//         Payer Phase: (isPlayer == true)
//             Case 0: out of mana, print("not enough mana")
//             Case -1: skill is used, nothing happens
//             Case -2: skill is already used, nothing happens
//     */
    
//     @Override
//     protected int howManySkills(){
//         int number_of_total_skills = 0;
//         if(speedUp) number_of_total_skills++;
//         if(steal) number_of_total_skills++;
//         if(doubleSlash) number_of_total_skills++;
//         if(strengthUp) number_of_total_skills++;
//         return number_of_total_skills;
//     }
    
//     private int speedUp(boolean isPlayer){
//         if(isPlayer){            
//             if(!speed_up){
//                 if(mp < 6){
//                     return 0;
//                 }else{
//                     mp = (mp - 6 <= 0)? 0 : mp - 6;
//                     addSpeedBuff();
//                     System.out.println("Speed up (+"+speed_buff+")!");
//                     return -1;
//                 }
//             }else{
//                 System.out.println("You already used it, wait "+speed_buff+" turn(s).");
//                 return -2;
//             }           
//         }else{           
//             if(speed_up){
//                 return -7;
//             }else{
//                 if(mp < 6){
//                     return 0;
//                 }else{
//                     mp = (mp - 6 <= 0)? 0 : mp - 6;
//                     addSpeedBuff();
//                     System.out.println("Speed up (+"+speed_buff+")!");
//                     speed_up = true;
//                     return -1;
//                 }
//             }         
//         }
//     }

//     private int steal(int enemy_def){
//         if(mp < 5){
//             return 0;
//         }else{
//             mp = (mp - 5 <= 0)? 0 : mp - 5;
//             int health_taken = (((str+magic)/2) + 4 - enemy_def)/2; //health taken is equal to half of the damage dealt, including magic
//             if(health_taken < 0) health_taken = 0; //just in case the enemy defense is greater
//             hp = ((hp + health_taken) > max_hp)? max_hp : hp + health_taken;
//             System.out.println("+"+health_taken+" Health taken!");
//             return (str+magic/2) + 4 - enemy_def;
//         }
//     }
    
//     private int doubleSlash(int enemy_def){
//         if(mp < 8){
//             return 0;
//         }else{
//             mp = (mp - 8 <= 0)? 0 : mp - 8;
//             int total_damage = 0 ;
//             for(int i = 0; i < 2; i++){
//                 int bonus_damage = rand.nextInt(4) + 1;
//                 total_damage += str + bonus_damage - enemy_def;
//             }
//             return total_damage;
//         }
//     }
    
//     private int strengthUp(boolean isPlayer){
//         if(isPlayer){            
//             if(!strength_up){
//                 if(mp < 6){
//                     return 0;
//                 }else{
//                     mp = (mp - 6 <= 0)? 0 : mp - 6;
//                     addStrengthBuff();
//                     System.out.println("Strength up (+"+strength_buff+")!");
//                     strength_up = true;
//                     return -1;
//                 }
//             }else{
//                 System.out.println("You already used it, wait "+strength_buff+" turn(s).");
//                 return -2;
//             }           
//         }else{           
//             if(strength_up){
//                 return -7;
//             }else{
//                 if(mp < 6){
//                     return 0;
//                 }else{
//                     mp = (mp - 6 <= 0)? 0 : mp - 6;
//                     addStrengthBuff();
//                     System.out.println("Strength up (+"+strength_buff+")!");
//                     strength_up = true;
//                     return -1;
//                 }
//             }         
//         }
//     }
    
//     @Override
//     public void printSkills(){
//         System.out.println("1.Speed up (-6 mana)      2.Steal (-5 mana)");
//         if(doubleSlash){
//             System.out.println("3.Double Slash (-8 mana)  ");
//         }
//         if(strengthUp){
//             System.out.print("4.Strength Up (-6 mana)");
//         }
//     }
    
//     /**
//      * This function is used as a way for the program to interpret the choice and outcome of the skills that 
//      * a character possesses.
//      * @param choice Choice made by the user. 
//      * <br>
//      * @param enemy_def Needed for damage calculations for cases where an attack skill depends on it.
//      * <br>
//      * @param isPlayer Boolean value needed for testing the outcome of a choice made by the user (passed onto skills inside). 
//      *            Use false for testing and use true for use.
//      * <br>
//      * @return <p>A unique number for two situations, an attack skill and a status effect skill. Since 
//      * a <b>status effect</b> skill modifies the properties of a character and doesn't deal damage like an attack skill, 
//      * these two have to be separated for the <b>battle phase</b> outcome.</p>
//      *         <h3>What it returns:</h3>
//      *          <ul>
//      *              <li><b style="color:#42a0ce">-7</b>: if the choice made is the status effect skill</li>
//      *              <li><b style="color:#42a0ce">*-{-1}</b>: (everything else except -1), if the choice made is the attack skill</li>
//      *              <li><b style="color:#42a0ce">-1</b>: if the user makes a wrong choice</li>
//      *          </ul>
//      */
//     @Override
//     public int skills(int choice, int enemy_def, boolean isPlayer){
//         if(choice == 1){
//             return speedUp(isPlayer);
//         }else if(choice  == 2){
//             return steal(enemy_def);
//         }else if(doubleSlash && choice == 3){
//             return doubleSlash(enemy_def);
//         }else if(strengthUp && choice == 4){
//             return strengthUp(isPlayer);
//         }else return -4;
//     }
    
//     @Override
//     public void lvlUp(){ //18 points distributed
//         System.out.println("Level up!");
        
//         int new_hp = rand.nextInt(4) + 1;
//         System.out.println("Max HP: "+max_hp+" +"+new_hp);
//         max_hp += new_hp;
//         hp += new_hp;
        
//         int new_mp = rand.nextInt(4) + 1;
//         System.out.println("Max MP: "+max_mp+" +"+new_mp);
//         max_mp += new_mp;
//         mp += new_mp;
        
//         int new_str = rand.nextInt(2) + 1;
//         System.out.println("Strenght: "+str+" +"+new_str);
//         str += new_str;
        
//         int new_def = rand.nextInt(2) + 1;
//         System.out.println("Defence: "+def+" +"+new_def);
//         def += new_def;
        
//         int new_magic = rand.nextInt(2) + 1;
//         System.out.println("Magic: "+magic+" +"+new_magic);
//         magic += new_magic;
        
//         int new_skill = rand.nextInt(2) + 1;
//         System.out.println("Skill: "+skill+" +"+new_skill);
//         skill += new_skill;
        
//         int new_speed = rand.nextInt(2) + 1;
//         System.out.println("Speed: "+speed+" +"+new_speed);
//         speed += new_speed;
        
//         speed_enhance += 2;
        
//         lvl++;
        
//         max_exp += newMaxExp();
        
//         System.out.println("");
//         if(lvl == 3){
//             doubleSlash = true;
//             System.out.println("New skill learned!!: Double Slash");
//         }
//         if(lvl == 4){
//             strengthUp = true;
//             System.out.println("New skill learned!!: Strength Up");
//         }
//     }
    
//     @Override
//     public void imprimir(){
//         System.out.println("Thief stats: HP: "+hp+"/"+max_hp+"         Strenght: "+str);
//         System.out.println("Lvl "+lvl+"        MP: "+mp+"/"+max_mp+"         Magic: "+magic+"\n");
//     }
// }
