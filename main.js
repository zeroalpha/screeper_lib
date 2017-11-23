var roles = {
    'harvester': {code: require('harvester'),design: 'civilian'},
    'upgrader': {code: require('upgrader'),design: 'civilian'},
    'builder': {code: require('builder'), design: 'civilian'},
    'fighter': {code: require('fighter'), design: 'military'}
};

var spawn_priority = ['harvester', 'upgrader', 'builder', 'fighter'];

var creep_limits = {
    'harvester': 3,
    'upgrader': 2,
    'builder': 4,
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
        counts[role] = 0;
        for(var creep in Game.creeps){
            if(Game.creeps[creep].memory.role == role){
                counts[role] = counts[role] + 1;
            }
        }
        console.log("Counted creeps with role: " + role + " : " + counts[role]);
    }
    Memory.my_counts = counts;
    //Spawning missing creeps
    //for(var role of spawn_priority){
    //_.each(spawn_priority,function(e,i,list){
    for(var i = 0; i<spawn_priority.length;i++){
        var role = spawn_priority[i];
        if(counts[role] < creep_limits[role]){
            console.log("Spawning 1x " + role);
            var r = Game.spawns['Spawn1'].spawnCreep(drone_designs[roles[role].design], role + Game.time, {memory: {'role': role}});
            console.log("spawnCreep returned: " + r);
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