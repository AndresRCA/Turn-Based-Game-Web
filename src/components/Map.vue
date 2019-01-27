<template>
	<main class="nes-container with-title">
		<h2 class="title">Map</h2>
		<table class="nes-table is-bordered is-centered">
			<tbody>
				<tr>
					<td>{{ position[0][0] }}</td>
					<td>{{ position[0][1] }}</td>
				</tr>
				<tr>
					<td>{{ position[1][0] }}</td>
					<td>{{ position[1][1] }}</td>
				</tr>
			</tbody>
		</table>
	</main>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Map',
  computed: {
  	position() {
  		let row = this.$parent.$data.row;
  		let column = this.$parent.$data.column;
  		let position = [
  			['o', 'o'],
  			['o', 'o']
  		];
  		position[row][column] = 'x'; // where the player is
  		return position;
  	}
  }
});
</script>

<style>

</style>