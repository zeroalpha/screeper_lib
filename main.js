var roles = {
    'harvester': {code: require('harvester'),design: 'civilian'},
    'upgrader': {code: require('upgrader'),design: 'civilian'},
    'builder': {code: require('builder'), design: 'civilian'},
    'fighter': {code: require('fighter'), design: 'military'}
};

var creep_limits = {
    'harvester': 2,
    'upgrader': 1,
    'builder': 3,
    'fighter': 1
};

var drone_designs = {
    'civilian': [WORK,WORK,CARRY,MOVE],
    'military': [ATTACK,ATTACK,MOVE,MOVE]
};

module.exports.loop = function () {
    console.log("=======> NEW TICK <========");
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Creep spawning
    //Counting creeps per role
    var counts = {};
    for(var role in roles){
        //counts[role] = Game.creeps.filter(function(creep) {return creep.memory.role == role}).length
        counts[role] = 0;
        for(var creep in Game.creeps){
            if(Game.creeps[creep].memory.role == role){
                counts[role] = counts[role] + 1;
            }
        }
    }
    Memory.my_counts = counts;
    //Spawning missing creeps
    for(var role in roles){
        if(counts[role] < creep_limits[role]){
            console.log("Spawning 1x " + role);
            Game.spawns['Spawn1'].spawnCreep(drone_designs[roles[role].design], role + String(counts[role]), {memory: {'role': role}});
        }
    }
    
    //Creep role logic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        if(typeof roles[role] != "undefined"){
            console.log("Running logic for: " + creep.name + " => " + role);
            roles[role].code.run(creep);
        }
    }
    console.log("=======> END TICK <========");

}