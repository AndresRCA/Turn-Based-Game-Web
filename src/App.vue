<template>
  <div id="app">

    <section id="gameScreen" class="nes-container">
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
import art from './assets/ASCIIart';

export default Vue.extend({
  name: 'app',
  data: () => {
    return {
      background: '',
      player: {}
    }
  },
  mounted() {
    this.background = art.Capital;
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
