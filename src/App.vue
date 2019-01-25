<template>
  <div id="app">

    <section id="gameScreen" class="nes-container">
        <article id="mainPrompt" v-show="main_prompt_on" class="nes-container has-title"></article>
        <pre>{{ background }}</pre>
    </section>

    <section id="gameMessages" class="nes-container">
      <div class="nes-container is-rounded">
        <p>This is a message</p>
      </div>
    </section>

    <section id="control"></section>

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

interface Game {
  background: string;
  player: Hero | Mage | Thief;
  area: string[][];
  row: number;
  column: number;
  mainPrompt: HTMLElement | null;
  main_prompt_on: boolean;
  main_prompt_message: string;
}

export default Vue.extend({
  name: 'app',
  data() {
    let data: Game = {
      background: '',
      player: new Hero(),
      area: [
        [ Art.Capital, Art.Forest ],
        [ Art.Grim_Reaper, Art.Dead_Tree ]
      ],
      row: 0,
      column: 0,
      mainPrompt: null,
      main_prompt_on: false,
      main_prompt_message: ''
    };
    return data;
  },
  methods: {
    promptOn(): void {
      this.main_prompt_on = true;
    },
    promptOff(): void {
      this.main_prompt_on = false;
    },
    killPromptChildren(): void {
      if(this.mainPrompt) {
        while(this.mainPrompt.firstChild) {
          this.mainPrompt.removeChild(this.mainPrompt.firstChild);
        }
      }
    },
    gameStart(): void {
      while(player.getHp() > 0) {
        this.background = this.area[row][column];
        /*------------Events that occur after you arrive somewhere------------------------------------------*/
            
        events(this.player, this.area, this.row, this.column, this.dialogue);
      }
    }
  },
  mounted(): void {
    this.mainPrompt = document.getElementById('mainPrompt');
    let mainPrompt = this.mainPrompt;
    if(mainPrompt) {
      let par: HTMLElement = createElement('p', { content: 'Choose your class:' });
      mainPrompt.appendChild(par);

      let hero_btn: HTMLElement = createElement('button', { content: 'Hero', classes: ['nes-btn'] });
      hero_btn.setAttribute('type', 'button');
      hero_btn.onclick = () => {
        this.player = new Hero();
        this.promptOff();
        this.killPromptChildren();
        this.gameStart();
      };

      let mage_btn: HTMLElement = createElement('button', { content: 'Mage', classes: ['nes-btn'] });
      mage_btn.setAttribute('type', 'button');
      mage_btn.onclick = () => {
        this.player = new Mage();
        this.promptOff();
        this.killPromptChildren();
        this.gameStart();
      };

      let thief_btn: HTMLElement = createElement('button', { content: 'Thief', classes: ['nes-btn'] });
      thief_btn.setAttribute('type', 'button');
      thief_btn.onclick = () => {
        this.player = new Thief();
        this.promptOff();
        this.killPromptChildren();
        this.gameStart();
      };

      mainPrompt.appendChild(hero_btn);
      mainPrompt.appendChild(mage_btn)
      mainPrompt.appendChild(thief_btn)
    }

    this.promptOn(); // raise the curtain

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

#gameMessages {
  margin: 0 auto;
  height: 200px;
  width: 720px;
}

#gameMessages p {
  font-size: 8px;
}
</style>
