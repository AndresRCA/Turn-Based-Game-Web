//generates a whole number that is within the range of number_of_skills
function getNextInt(range: number): number {
	return Math.floor(Math.random() * range)  + 1;
}

export getNextInt;