//*For enemy AI return values: 0 means no mana, -1 means stat buff already used, -2 means the enemy ran out of mana for every skill,
//so it will use a physical attack,-7 means stat buff can't be used yet

//*For User: 0 means no mana, -1 means stat buff used (or healing effect), -2 means stat buff can't be used but wastes a turn nonetheless,
//-4 means wrong choice by user
export enum PlayerStatus { WRONG_CHOICE = -4, NO_BUFF = -2, BUFF_USED = -1, NO_MP = 0 }
export enum EnemyStatus { NO_BUFF = -7, NO_SKILL_MP = -2, BUFF_USED = -1, NO_MP = 0 }