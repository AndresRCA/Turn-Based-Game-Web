<template>
	<section class="nes-container with-title">
		<h2 class="title">Battle Menu</h2>

		<!-- left side -->
		<article style="float: left;">
			<!-- only shows on MAIN -->
      <table class="nes-table is-bordered" v-show="state == 0"> <!-- check Menu enum -->
				<tbody>
					<tr>
						<td @click="chooseMove(1)">
							<strong v-show="choice == 1">*</strong>&nbsp;Hit
						</td>
						<td @click="chooseMove(2)">
							<strong v-show="choice == 2">*</strong>&nbsp;Use health potion
						</td>
					</tr>
					<tr>
						<td @click="chooseMove(3)">
							<strong v-show="choice == 3">*</strong>&nbsp;Skills
						</td>
						<td @click="chooseMove(4)">
							<strong v-show="choice == 4">*</strong>&nbsp;Use mp potion
						</td>
					</tr>
				</tbody>
			</table>
			<!-- only shows on SELECT -->
			<table class="nes-table is-bordered" v-show="state == 1"> <!-- check Menu enum -->
				<tbody>
					<tr>
						<!-- remember to render this dinamically according to the number of skills -->
						<td @click="chooseMove(1)">
							<strong v-show="choice == 1">*</strong>&nbsp;{{ skills[0].id }}.&nbsp;{{ skills[0].name }}&nbsp;(-{{ skills[0].mp_cost }} mp)
						</td>
						<td @click="chooseMove(2)">
							<strong v-show="choice == 2">*</strong>&nbsp;{{ skills[1].id }}.&nbsp;{{ skills[1].name }}&nbsp;(-{{ skills[1].mp_cost }} mp)
						</td>
					</tr>
					<tr>
						<td @click="chooseMove(3)">
							<strong v-show="choice == 3">*</strong>&nbsp;move 3
						</td>
						<td @click="chooseMove(4)">
							<strong v-show="choice == 4">*</strong>&nbsp;move 4
						</td>
					</tr>
				</tbody>
			</table>
		</article>

		<!-- right side -->
		<article style="float: right;">
			<p>
				HP: {{ this.$parent.$data.player.getHp() }}/{{ this.$parent.$data.player.getMax_hp() }}
				<progress class="nes-progress is-error" :value="this.$parent.$data.player.getHp()" :max="this.$parent.$data.player.getMax_hp()"></progress>
			</p>
			<p>
				MP: {{ this.$parent.$data.player.getMp() }}/{{ this.$parent.$data.player.getMax_mp() }}
				<progress class="nes-progress is-primary" :value="this.$parent.$data.player.getMp()" :max="this.$parent.$data.player.getMax_mp()"></progress>
			</p>
			<button class="nes-btn" type="button" v-show="state != 2" @click="((state == 0 && choice == 3) || state == 1)? goFurther() : fight()"> <!-- check Menu enum -->
				select
			</button>
			<button class="nes-btn" type="button" v-show="state == 2" @click="fight()"> <!-- check Menu enum -->
				sure?
			</button>
			<button class="nes-btn" type="button" v-show="state != 0" @click="goBack()"> <!-- check Menu enum -->
				go back
			</button>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import { PlayerStatus } from '../enums/Status';
import { getNextInt } from '../game_resources/ordinary_functions';
import { skill } from '../interfaces/skill';

enum Menu { MAIN, SELECTSKILL, CONFIRMATION }

interface BattleMenu {
	state: Menu;
	skills: skill[];
	choice: number;
}

export default Vue.extend({
  name: 'BattleMenu',
  data() {
  	let data: BattleMenu = {
  		state: Menu.MAIN,
  		skills: this.$parent.$data.player.getSkills(),
  		choice: 1
  	};
  	return data;
  },
  methods: {
  	chooseMove(choice: number): void {
  		this.choice = choice;
  	},
  	goFurther(): void {  		
			switch(this.state) {
  			case Menu.MAIN:
  				this.changeState(Menu.SELECTSKILL);
  				break;

  			case Menu.SELECTSKILL:
  				this.changeState(Menu.CONFIRMATION);
  				break;

  			case Menu.CONFIRMATION: break; // can't go further than this
  		}
  	},
  	goBack() {
  		switch(this.state) {
  			case Menu.CONFIRMATION:
  				this.changeState(Menu.SELECTSKILL);
  				break;

  			case Menu.SELECTSKILL:
  				this.changeState(Menu.MAIN); // can't go further than this
  		}
  	},
  	changeState(newState: Menu): void {
  		this.state = newState;
  	},
  	fight(): void {
  		this.playerTurn();
			if(this.enemyIsDead()) {
				this.battleIsOver();
			}
			else {
				this.enemyTurn();
				this.playerIsDead() && this.gameOver();
			}
			this.changeState(Menu.MAIN);
		},
		playerTurn(): void {
			let player = this.$parent.$data.player;
  		let enemy = this.$parent.$data.enemy;

  		if(this.state == Menu.MAIN) {
  			switch(this.choice) {
  				case 1:
  					if(getNextInt(3) != 0) { // change this
		          if((player.attack() - enemy.getDef()) >= 0) {
	              console.log("You dealt "+(player.attack() - enemy.getDef())+" damage!");
	              this.$parent.$data.enemy.setHp(enemy.getHp() - (player.attack() - enemy.getDef()));
	          	}
	          }	
		        else {
		        	console.log("Your attack missed!")
	        	}
	        	break;

	        case 2:
	        	this.drinkHpPotion();
	        	break;

	        case 4:
	        	this.drinkMpPotion();
	        	break;
	  		}
	  	}
	  	else { // a skill was used
				let damage = player.skills(this.choice, enemy.getDef(), true);
				if(damage == PlayerStatus.WRONG_CHOICE) { // change skills, this would never happen
          console.log("You entered a wrong number");
	      }
	      else if(damage == PlayerStatus.NO_MP) {
          console.log("Not enough mana.");
	      }
	      else if(damage != PlayerStatus.BUFF_USED && damage != PlayerStatus.NO_BUFF) {
          console.log("You dealt "+damage+" special damage!");
          this.$parent.$data.enemy.setHp(enemy.getHp() - damage);
	      }
	      else {
	      	console.log("Status skill was used.");
	      }
			}
		},
		enemyTurn(): void {
			let player = this.$parent.$data.player;
  		let enemy = this.$parent.$data.enemy;

			console.log("Enemy Turn: ");
			switch(getNextInt(2)) { // check this later
				case 0:
  				console.log("The enemy missed his attack, Now's your chance!");
  				break;

				case 1:
  				if((enemy.attack() - player.getDef()) < 0) {
  					console.log("The enemy dealt 0 damage!");
  				}
  				else {
  					this.$parent.$data.player.setHp(player.getHp() - (enemy.attack() - player.getDef()));
  					console.log("The enemy dealt "+(enemy.attack() - player.getDef())+" damage!");
  				}
  				break;

				case 2:
  				if(enemy.getNumber_of_skills() > 0) {
  					let enemy_choice: number = getNextInt(enemy.getNumber_of_skills());

  					let damage = enemy.testChance(enemy_choice,player.getDef());
  					if(damage != -1) {
  						if(damage == -2) {
  							if((enemy.attack() - player.getDef()) < 0) {
  								console.log("The enemy dealt 0 damage!");
  							}
  							else {
  								this.$parent.$data.player.setHp(player.getHp() - (enemy.attack() - player.getDef()));
  								console.log("The enemy dealt "+(enemy.attack() - player.getDef())+" damage!");
  							}
  						}
  						else {
  							if(damage <= 0) {
  								console.log("The enemy dealt 0 special damage!");
  							}
  							else {
  								this.$parent.$data.player.setHp(player.getHp() - damage);
  								console.log("The enemy dealt "+damage+" special damage!");
  							}
  						}
  					}
  				}
  				else {
  					if((enemy.attack() - player.getDef()) <= 0) {
  						console.log("The enemy dealt 0 damage!");
  					}
  					else {
  						this.$parent.$data.player.setHp(player.getHp() - (enemy.attack() - player.getDef()));
  						console.log("The enemy dealt "+(enemy.attack() - player.getDef())+" damage!");
  					}
  				}
			}
		},
		drinkHpPotion(): void {
  		this.$parent.$data.player.hpPotion();
  		console.log("+5 hp recovered");
  	},
  	drinkMpPotion(): void {
  		this.$parent.$data.player.mpPotion();
  		console.log("+5 mp recovered");
  	},
  	playerIsDead(): boolean {
  		return this.$parent.$data.player.getHp() <= 0;
  	},
  	enemyIsDead(): boolean {
  		return this.$parent.$data.enemy.getHp() <= 0;
  	},
  	gameOver(): void {
			console.log('you died');
			this.changeState(Menu.MAIN); // go back to the main menu
			this.$parent.$data.isBattling = false;
		},
  	battleIsOver(): void {
  		let parent = this.$parent.$data;
  		let player = parent.player;
  		let enemy = parent.enemy

  		parent.battle_background = '';
			console.log("You have killed the enemy!\n");
			this.$parent.$data.player.deBuff();

			if((player.getExp() + enemy.getExp()) >= player.getMax_exp()) {
				let last_exp_capacity: number = player.getMax_exp();

				console.log("Exp: "+player.getExp()+" (+"+enemy.getExp()+")");
				this.$parent.$data.player.setExp(player.getExp() + enemy.getExp());
				//Should I ditch the current exp: *exp/max_exp* and just leave it as current exp: *exp*?
				console.log("Current Exp: "+(player.getExp() - last_exp_capacity)+"/"+(last_exp_capacity + player.newMaxExp())+"\n");

				this.$parent.$data.player.lvlUp();

				this.$parent.$data.player.setExp(player.getExp() - last_exp_capacity);
				console.log("Next to level up: "+(player.getMax_exp() - player.getExp())+"\n");
			}
			else {
				console.log("Exp: "+player.getExp()+" (+"+enemy.getExp()+")");                   
				this.$parent.$data.player.setExp(player.getExp() + enemy.getExp());
				//Should I ditch the current exp: *exp/max_exp* and just leave it as current exp: *exp*?
				console.log("Current Exp: "+player.getExp()+"/"+player.getMax_exp());
				console.log("Next to level up: "+(player.getMax_exp() - player.getExp())+"\n");
			}

			parent.isBattling = false;
  	}
  }
});
</script>

<style scoped>
section article:first-child {
	width: 40%;
}

section article:last-child {
	width: 60%
}

button {
	margin: 0 20px;
}
</style>