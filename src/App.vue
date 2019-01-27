<template>
  <div id="app">

    <section id="gameScreen" class="nes-container flex-parent">
      <pre v-show="!main_prompt_on">{{ background }}</pre> <!-- shows scenery and battle art -->
      <component v-show="main_prompt_on" :is="main_prompt_state"></component> <!-- can be: menu or map -->
      <BattleMenu v-show="isBattling" /> <!-- here goes the options -->
      <!-- newGamePrompt items go here -->
    </section>

    <section id="gameMessages" class="nes-container">
      <div class="nes-container is-rounded">
        <p>This is a message</p>
      </div>
    </section>

    <section id="control">
      <button class="nes-btn" type="button" @click="move(Control.UP)">Up</button>
      <button class="nes-btn" type="button" @click="move(Control.DOWN)">Down</button>
      <button class="nes-btn" type="button" @click="move(Control.LEFT)">Left</button>
      <button class="nes-btn" type="button" @click="move(Control.RIGHT)">Right</button>
      <button class="nes-btn" type="button" @click="changeState('Map')">Map</button>
      <button class="nes-btn" type="button" @click="changeState('Menu')">Menu</button>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Hero } from './classes/Hero'
import { Mage } from './classes/Mage'
import { Thief } from './classes/Thief'
import Art from './assets/ASCIIart';
import Events from './game_resources/events';
import Dialogue from './game_resources/dialogue';
import { createElement } from './game_resources/ordinary_functions';

import Map from './components/Map.vue';
import Menu from './components/Menu.vue';

/*
Plan: port the game from scratch, instead of a linear approach it will be handled with events,
make 3 main components with the only purpose of showing HTMLELement props
 */

enum Control { UP, DOWN, LEFT, RIGHT }

interface Game {
  player: Hero | Mage | Thief;
  area: string[][];
  row: number;
  column: number;
  isBattling: boolean;
  newGamePrompt: HTMLElement | null;
  main_prompt_state: string;
  main_prompt_on: boolean;
  main_prompt_message: string;
}

export default Vue.extend({
  name: 'app',
  data() {
    let data: Game = {
      player: new Hero(),
      area: [
        [ Art.Capital, Art.Forest ],
        [ Art.Grim_Reaper, Art.Dead_Tree ]
      ],
      row: 0,
      column: 0,
      isBattling: false,
      newGamePrompt: null, // maybe get rid of this, not sure if I can do killPromptChildren(newGamePrompt) in mounted
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
      if(this.newGamePrompt) {
        while(this.newGamePrompt.firstChild) {
          this.newGamePrompt.removeChild(this.newGamePrompt.firstChild);
        }
      }
    },
    changeState(newState: string): void {
      if(!this.isBattling) this.main_prompt_state = newState;
    },
    gameStart(): void {
      while(this.player.getHp() > 0) {
        this.background = this.area[this.row][this.column];
        /*------------Events that occur after you arrive somewhere------------------------------------------*/
            
        // events(this.player, this.area, this.row, this.column, this.dialogue);
      }
    },
    move(direction: Control): void {
      if(this.isBattling || this.main_prompt_on) return; // do nothing

      let row = this.row;
      let column = this.column;

      switch(direction) {
        case Control.UP:
          if(row > 0) {
            row--;
          }
          break;

        case Control.DOWN:
          if(row < 1) {
            row++;
          }
          break;

        case Control.LEFT:
          if(column > 0) {
            column--;
          }
          break;

        case Control.RIGHT:
          if(column < 1) {
            column ++;
          }
      }
      this.background = this.area[row][column]; //show new scenery
    }
  },
  components: {
    Map,
    Menu
  },
  mounted(): void {
    this.newGamePrompt = document.getElementById('gameScreen');
    let newGamePrompt = this.newGamePrompt;
    if(newGamePrompt) {
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
    }
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
