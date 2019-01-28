<template>
	<main class="nes-container with-title">
		<h2 class="title">Menu</h2>
		<p>
			HP: <progress class="nes-progress is-error" :value="this.$parent.player.getHp()" :max="this.$parent.player.getMax_hp()"></progress>
		</p>
		<p>
			MP: <progress class="nes-progress is-primary" :value="this.$parent.player.getMp()" :max="this.$parent.player.getMax_mp()"></progress>
		</p>
		<p>
			EXP: <progress class="nes-progress is-warning" :value="this.$parent.player.getExp()" :max="this.$parent.player.getMax_exp()"></progress>
		</p>
		<p>
			str: {{ this.$parent.$data.player.getStr() }}<br>
			def: {{ this.$parent.$data.player.getDef() }}<br>
			magic: {{ this.$parent.$data.player.getMagic() }}<br>
			skill: {{ this.$parent.$data.player.getSkill() }}<br>
			speed: {{ this.$parent.$data.player.getSpeed() }}<br>
		</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Menu'
});
</script>

<style>

</style>