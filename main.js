/**
 * TODO:
 * - implement fallback designs (small harvester)
 * - vary designs on available energ y?
 * - setup static selection for sources to harvest
 * 
 * - Switch Builder spawn logic to use global Game.constructionSites
 * 
**/


var roles = {
    'harvester': {code: require('harvester'),design: 'civilian'},
    'upgrader': {code: require('upgrader'),design: 'civilian'},
    'builder': {code: require('builder'), design: 'civilian'},
    'repair': {code: require('repair'), design: 'civilian'},
    'fighter': {code: require('fighter'), design: 'military'}
};

var spawn_priority = ['harvester', 'upgrader', 'builder', 'repair', 'fighter'];

var creep_limits = {
    'harvester': 6,
    'upgrader': 3,
    'builder': 4,
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

var tower_code = require('tower');

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
        //console.log("Counted creeps with role: " + role + " : " + counts[role]);
    }
    Memory.my_counts = counts;
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
        var r = Game.spawns['Spawn1'].spawnCreep(drone_designs[roles[role].design], role + '_' + Game.time, {memory: {'role': role}});
        console.log("spawnCreep returned: " + r);
    }

    
    
    //Creep role logic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        if(typeof roles[role] != "undefined"){
            //console.log("Running logic for: " + creep.name + " => " + role);
            roles[role].code.run(creep);
        }
    }
    //Tower Logic
    for(var spawn in Game.spawns){
        var tower = Game.spawns[spawn].room.find(FIND_MY_STRUCTURES,{filter: (struct) => struct.structureType == STRUCTURE_TOWER});
    }
    
    //Report
    console.log("Energy Storage: " + Game.spawns['Spawn1'].room.energyAvailable + "/" + Game.spawns['Spawn1'].room.energyCapacityAvailable);
    console.log("Cost per design");
    for(design in drone_designs){
        var sum = 0;
        for(part of drone_designs[design]){
            sum = sum + BODYPART_COST[part];
            //console.log("Part: " + part + " cost: " + BODYPART_COST[part]);
        }
        console.log(design + ": " + sum);
    }
    console.log("=======> END TICK <========");

}