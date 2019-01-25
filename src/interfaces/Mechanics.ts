export interface Mechanics {
	printStats(): void;
	attack(): number;
	skills(choice: number, enemy_def: number, isPlayer: boolean): number;
}