import { Hero } from '../classes/Hero'
import { Mage } from '../classes/Mage'
import { Thief } from '../classes/Thief'
import Art from '../assets/ASCIIart';
import Events from './events';
import Dialogue from './dialogue';
import { getNextInt } from './ordinary_functions';

function dialogue(dialogue: string[], start: number, end: number): void {
	// gameMessages goes here
}

function events(player: Hero | Mage | Thief, area: string[][], row: number, column: number, dialogue: string[]): void {
	if(Events.Capital_Dialogue && (area[row][column] === Art.Capital)) {
		Events.Capital_Dialogue = false;                 
		dialogue(dialogue, 0, 2);
	}

	//Random generated encounter
	if(Events.ready_to_fight/*just for now && (getNextInt(1) == 1)*/ && (area[row][column] === Art.Forest)){
		battlePhase(player, new Monster(Art.Bug, 20, 0, 3, 0, 1, 0, 0, 0, getNextInt(2)+1, 0));
		console.log(area[row][column]); //this is to show the map after the battle is over, instead of just the options
	}
	//Random generated encounter
	if(!Events.Dead_Tree_Dialogue && !Events.Last_Boss_Fight && Events.ready_to_fight && (getNextInt(1) == 1) && (area[row][column] === Art.Dead_Tree)){
		battlePhase(player,new Monster(Art.Head, 27, 0, 7, 0, 3, 0, 0, 0, getNextInt(4)+3, 1));
		console.log(area[row][column]);
	}

	if(Events.Dead_Tree_Dialogue && (area[row][column] === Art.Dead_Tree)){
		Events.Dead_Tree_Dialogue = false;
		Events.Return_to_Capital = true;
	    
		dialogue(dialogue,2,5);

		//Dead_Tree fight here
		battlePhase(player, new Monster(Art.Head, 27, 0, 7, 0, 3, 0, 0, 0, 4, 1));
		console.log(area[row][column]);
		    
		dialogue(dialogue,5,8);
	}

	if(Events.Return_to_Capital && (area[row][column] === Art.Capital)){
		Events.Return_to_Capital = false;
		/*There used to be a puzzle here but it's very stupid so I don't think I'll add it*/
		/*Scanner input = new Scanner(System.in);
		boolean puzzle_not_solved = true;
		String options;
		    
		dialogue(dialogue,8,12);
		   
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
		        dialogue(dialogue,12,13);
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

	if(Events.Last_Boss_Fight && (area[row][column] === Art.Dead_Tree)) {
		Events.Last_Boss_Fight = false;
		//Enemy object here, I'll make it a thief
		let boss: Thief = new Thief(54, 30, 10, 5, 11, 4, 15, 2); // for now there is no exp reward
		battlePhase(player, boss);
		console.log(area[row][column]);
	}
}

export events;