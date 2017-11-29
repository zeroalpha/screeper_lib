/*
 * This is the complete spawn logic
 */



var spawn_priority = ['harvester', 'upgrader', 'builder', 'repair', 'fighter'];

var creep_limits = {
    'harvester': 6,
    'upgrader': 3,
    'builder': 3,
    'repair': 2,
    'fighter': 1
};

const BUILDER_LIMIT = 3;

var drone_designs = {
    //'civilian': [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    'civilian': [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    'military': [ATTACK,ATTACK,MOVE,MOVE],
    'emergency': [WORK,CARRY,MOVE]
};

/*
 * Helpers Helper
 *
 */
 
var calculate_design_cost = function(design){
    var sum = 0;
    for(part in design){
        sum += BODYPART_COST[part];
    }
    return sum;
}

var create_drone_design = function(available_energy){
    
}

/*
 * Helper exports
 *
 */

var spawn = function(roles){
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
        console.log("Counted creeps with role: " + role + " : " + counts[role] + "/" + creep_limits[role]);
    }
    Memory.my_creep_counts = counts;
    
    //Harvester Special Case
    if(counts['harvester'] == 0){
        console.log("SPAWNING EMERGENCY HARVESTER");
        var role = 'harvester';
        var rc = Game.spawns['Spawn1'].spawnCreep(drone_designs['emergency'], role + '_' + Game.time, {memory: {'role': role}});
        console.log("RC: " + rc);
    }
    
    //Check whether theres anything to build
    var build_sites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
    creep_limits['builder'] = (build_sites.length == 0) ? 0 : BUILDER_LIMIT;
    //Spawning missing creeps
    //Building spawn Queue
    var spawn_queue = [];
    for(var i = 0; i<spawn_priority.length;i++){
        var role = spawn_priority[i];
        if(counts[role] < creep_limits[role]){
            //console.log("Spawning 1x " + role);
            //var r = Game.spawns['Spawn1'].spawnCreep(drone_designs[roles[role].design], role + '_' + Game.time, {memory: {'role': role}});
            //console.log("spawnCreep returned: " + r);
            spawn_queue.push(role);
        }
    }
    console.log("Spawn Queue: " + String(spawn_queue));
    if(spawn_queue.length > 0 && !Game.spawns['Spawn1'].spawning){
        var role = spawn_queue.shift();
        console.log("Spawning 1x " + role);
        var rc = Game.spawns['Spawn1'].spawnCreep(drone_designs[roles[role].design], role + '_' + Game.time, {memory: {'role': role}});
        console.log("spawnCreep returned: " + rc);
    }
}




module.exports = {
    'spawn': spawn,
    'drone_designs': drone_designs
};