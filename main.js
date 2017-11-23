var roles = {
    'harvester': require('harvester'),
    'upgrader': require('upgrader'),
    'builder': require('builder')
};

var creep_limits = {
    'harvester': 1,
    'upgrader': 1,
    'builder': 1
};

module.exports.loop = function () {
    
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
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], role + String(counts[role]), {memory: {'role': role}})
        }
    }
    
    //Creep role logic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(typeof roles[creep.memory.role] != "undefined"){
            roles[creep.memory.role].run(creep);
        }
    }

}