import { skill } from './skill';

export interface PlayerInt {
	lvlUp(): void;
	getSkills(): skill[];
}