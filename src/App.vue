<template>
  <div id="app">

    <section id="gameScreen" class="nes-container flex-parent">
      <pre v-show="!main_prompt_on && !isBattling">{{ background }}</pre> <!-- shows scenery art -->
      <pre v-show="isBattling">{{ battle_background }}</pre> <!-- shows battle art -->
      <component v-show="main_prompt_on" :is="main_prompt_state"></component> <!-- can be: menu or map -->
      <BattleMenu v-if="isBattling" /> <!-- here goes the options -->
      <!-- newGamePrompt items go here -->
    </section>

    <section id="gameMessages" class="nes-container">
      <div class="nes-container is-rounded">
        <p>This is a message</p>
      </div>
    </section>

    <section id="control">
      <button class="nes-btn" type="button" @click="move(0)">Up</button>
      <button class="nes-btn" type="button" @click="move(1)">Down</button>
      <button class="nes-btn" type="button" @click="move(2)">Left</button>
      <button class="nes-btn" type="button" @click="move(3)">Right</button>
      <button class="nes-btn" :class="{'is-disabled': isBattling}" type="button" @click="changePromptState('Map')">Map</button>
      <button class="nes-btn" :class="{'is-disabled': isBattling}" type="button" @click="changePromptState('Menu')">Menu</button>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Hero } from './classes/Hero';
import { Mage } from './classes/Mage';
import { Thief } from './classes/Thief';
import { Monster } from './classes/Monster';
import Characters from './assets/characters';
import Monsters from './assets/monsters';
import Art from './assets/ASCIIart';
import Events from './game_resources/events';
import Dialogue from './game_resources/dialogue';
import { getNextInt, createElement } from './game_resources/ordinary_functions';

import Map from './components/Map.vue';
import Menu from './components/Menu.vue';
import BattleMenu from './components/BattleMenu.vue';

/*
Plan: port the game from scratch, instead of a linear approach it will be handled with events,
make 3 main components with the only purpose of showing HTMLELement props
 */

enum Control { UP, DOWN, LEFT, RIGHT }

interface Game {
  player: Hero | Mage | Thief;
  enemy: Monster | Hero | Mage | Thief;
  area: string[][];
  row: number;
  column: number;
  isBattling: boolean;
  battle_background: string;
  newGamePrompt: HTMLElement;
  main_prompt_state: string;
  main_prompt_on: boolean;
  main_prompt_message: string;
}

export default Vue.extend({
  name: 'app',
  data() {
    let data: Game = {
      player: new Hero(),
      enemy: new Monster('', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      area: [
        [ Art.Capital, Art.Forest ],
        [ Art.Grim_Reaper, Art.Dead_Tree ]
      ],
      row: 0,
      column: 0,
      isBattling: false,
      battle_background: '',
      newGamePrompt: document.createElement('div'),
      main_prompt_state: '',
      main_prompt_on: false,
      main_prompt_message: ''
    };
    return data;
  },
  computed: {
    background(): string {
      return this.area[this.row][this.column];
    }
  },
  methods: {
    promptOn(): void {
      this.main_prompt_on = true;
    },
    promptOff(): void {
      this.main_prompt_on = false;
    },
    killPromptChildren(): void {
      if(this.newGamePrompt.parentNode) this.newGamePrompt.parentNode.removeChild(this.newGamePrompt);
    },
    changePromptState(newState: string): void {
      if(!this.isBattling) { // someone could eliminate the is-disabled class
        if(this.main_prompt_on && this.main_prompt_state == newState) {
          this.main_prompt_on = false; // a toggle to close the prompt
        }
        else {
          this.main_prompt_on = true;
          this.main_prompt_state = newState;
        }
      }
    },
    gameStart(): void {
      this.background = this.area[this.row][this.column];
      /*------------Events that occur after you arrive somewhere------------------------------------------*/
          
      // events(this.player, this.area, this.row, this.column, this.dialogue);
    },
    events(): void {
      let player = this.player;
      let area = this.area;
      let row = this.row;
      let column = this.column;
      
      if(Events.Capital_Dialogue && area[row][column] === Art.Capital) {
        Events.Capital_Dialogue = false;                 
        //dialogue(dialogue, 0, 2);
      }

      //Random generated encounter
      if(Events.ready_to_fight/*just for now && (getNextInt(1) == 1)*/ && area[row][column] === Art.Forest) {
        this.battle_background = Monsters.Bug;
        this.isBattling = true;
        this.enemy = new Monster(Monsters.Bug, 20, 0, 3, 0, 1, 0, 0, 0, getNextInt(2)+1, 0); // incoming enemy
      }
      //Random generated encounter
      if(!Events.Dead_Tree_Dialogue && !Events.Last_Boss_Fight && Events.ready_to_fight && getNextInt(1) == 1 && area[row][column] === Art.Dead_Tree) {
        this.battle_background = Monsters.Head;
        this.isBattling = true;
        this.enemy = new Monster(Monsters.Head, 27, 0, 7, 0, 3, 0, 0, 0, getNextInt(4)+3, 1); // incoming enemy
      }

      if(Events.Dead_Tree_Dialogue && area[row][column] === Art.Dead_Tree) {
        Events.Dead_Tree_Dialogue = false;
        Events.Return_to_Capital = true;
          
        //dialogue(dialogue,2,5);

        //Dead_Tree fight here
        this.battle_background = Monsters.Head;
        this.isBattling = true;
        this.enemy = new Monster(Monsters.Head, 27, 0, 7, 0, 3, 0, 0, 0, 4, 1); // incoming enemy
            
        //dialogue(dialogue,5,8);
      }

      if(Events.Return_to_Capital && area[row][column] === Art.Capital) {
        Events.Return_to_Capital = false;
        /*There used to be a puzzle here but it's very stupid so I don't think I'll add it*/
        /*Scanner input = new Scanner(System.in);
        boolean puzzle_not_solved = true;
        String options;
            
        //dialogue(dialogue,8,12);
           
        while(puzzle_not_solved){
            boolean first = false, second = false, third = false;
            console.log("Enter your keys (separate them with spaces)");
            options = input.nextLine();
            String[] keys;
            Pattern pattern = Pattern.compile("\\s");
            Matcher matcher = pattern.matcher(options);
            if(matcher.find()){
                keys = options.split(" ");
                    
                for(int i = 0; i < keys.length; i++){
                    if(keys[i] != null){
                        switch (keys[i]){
                            case "1":
                                first = true;
                                break;
                            case "2":
                                second = true;
                                break;
                            case "3":
                                third = true;
                                break;
                        }
                    }    
                }
                
                puzzle(first,second,third); 
                //dialogue(dialogue,12,13);
                console.log("Enter your answer (separate with spaces)");
                options = input.nextLine();
                String[] answer;
                matcher = pattern.matcher(options);
                    
                if(matcher.find()){
                    answer = options.split(" ");
                    if(answer.length == 4){
                        if(("star" === answer[0]) && ("moon" === answer[1]) && ("sun" === answer[2]) && ("dust" === answer[3])){
                            puzzle_not_solved = false;
                        }else console.log("You may have entered the wrong order, try again.");
                    }else console.log("You either answered with too much words or too few.");
                }else{console.log("Your answer doesn't contain spaces.");}
                    
            }else{console.log("Wrong pick, the keys contains spaces.");}
        }*/
        Events.Last_Boss_Fight = true;
        console.log(area[row][column]);
        console.log("There used to be a puzzle here but now there isn't, anyway head to the Dead Tree.");
      }

      if(Events.Last_Boss_Fight && area[row][column] === Art.Dead_Tree) {
        Events.Last_Boss_Fight = false;
        //Enemy object here, I'll make it a thief
        this.battle_background = Characters.Thief;
        this.isBattling = true;
        this.enemy = new Thief(54, 30, 10, 5, 11, 4, 15, 2); // for now there is no exp reward
      }
    },
    move(direction: Control): void {
      if(this.isBattling || this.main_prompt_on) return; // do nothing

      let row = this.row;
      let column = this.column;

      switch(direction) {
        case Control.UP:
          if(row > 0) {
            this.row--;
            this.events(); //events that occur after moving somewhere (includes changing the background)
          }
          break;

        case Control.DOWN:
          if(row < 1) {
            this.row++;
            this.events(); //events that occur after moving somewhere (includes changing the background)
          }
          break;

        case Control.LEFT:
          if(column > 0) {
            this.column--;
            this.events(); //events that occur after moving somewhere (includes changing the background)
          }
          break;

        case Control.RIGHT:
          if(column < 1) {
            this.column ++;
            this.events(); //events that occur after moving somewhere (includes changing the background)
          }
      }
    }
  },
  components: {
    Map,
    Menu,
    BattleMenu
  },
  mounted(): void {
    let newGamePrompt = this.newGamePrompt;

    let par: HTMLElement = createElement('p', { content: 'Choose your class:' });
    newGamePrompt.appendChild(par);

    let hero_btn: HTMLElement = createElement('button', { content: 'Hero', classes: ['nes-btn'] });
    hero_btn.setAttribute('type', 'button');
    hero_btn.onclick = () => {
      this.player = new Hero();
      this.killPromptChildren();
      this.gameStart();
    };

    let mage_btn: HTMLElement = createElement('button', { content: 'Mage', classes: ['nes-btn'] });
    mage_btn.setAttribute('type', 'button');
    mage_btn.onclick = () => {
      this.player = new Mage();
      this.killPromptChildren(); // maybe make this a generic function that accepts an HTMLElement and does its thing
      this.gameStart();
    };

    let thief_btn: HTMLElement = createElement('button', { content: 'Thief', classes: ['nes-btn'] });
    thief_btn.setAttribute('type', 'button');
    thief_btn.onclick = () => {
      this.player = new Thief();
      this.killPromptChildren();
      this.gameStart();
    };

    newGamePrompt.appendChild(hero_btn);
    newGamePrompt.appendChild(mage_btn)
    newGamePrompt.appendChild(thief_btn)

    let gameScreen: HTMLElement | null = document.getElementById('gameScreen');
    if(gameScreen) gameScreen.appendChild(newGamePrompt);
  }
});
</script>

<style>
@import '~nes.css/css/nes.min.css';

html, body, pre, code, kbd, samp {
    font-family: 'Press Start 2P', cursive;
}

#gameScreen {
  margin: 0 auto;
  height: 650px;
  width: 90%;
  font-size: 12px;
}

#gameScreen .flex-parent {
  display: flex;
  flex-direction: row;
  align-content: center;
}

#gameMessages {
  margin: 0 auto;
  height: 200px;
  width: 720px;
}

#gameMessages p {
  font-size: 8px;
}

#control > button {
  margin: 0 10px;
}
</style>
