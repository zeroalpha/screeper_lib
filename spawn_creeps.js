/*
 * This is the complete spawn logic
 */



var spawn_priority = ['harvester', 'upgrader', 'builder', 'repair', 'fighter'];

const BUILDER_LIMIT = 2;

var creep_limits = {
    'harvester': 7,
    'upgrader': 3,
    'builder': BUILDER_LIMIT,
    'repair': 0,
    'fighter': 1
};

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
    //console.log("Calculating Cost of : " + design);
    var sum = 0;
    for(part in design){
        sum = sum + BODYPART_COST[design[part]];
    }
    //console.log("Returning Cost : " + sum);
    return sum;
}

var create_drone_design = function(available_energy,drone_type){
    //console.log("CREATE  DRONE DESIGN ENERGY: " + available_energy + " TYPE:  " + drone_type);
    var design = Array.from(drone_designs['emergency']);
    //one carry+move per two works
    var remaining_energy = available_energy - Math.floor(calculate_design_cost(design)/100);
    //console.log("INITIAL ENERGY: " + remaining_energy);
    var seq = ['w','w','cm'];
    var i = 0;
    while(remaining_energy > 0){
        if(i >= seq.length){
            i = 0;
        }
        if(seq[i] == 'w'){
            if(drone_type == 'civilian'){
                design.push(WORK);
            }
            else{
                design.push(ATTACK);
            }
        }
        else{
            design.push(CARRY);
            design.push(MOVE);
        }
        i += 1;
        remaining_energy -= 1;
    }
    console.log("Drone Design (" + drone_type + ") cost: " + calculate_design_cost(design) + " ; Design: " + design);
    Memory.my_last_design = {};
    Memory.my_last_design.design = design;
    Memory.my_last_design.cost = calculate_design_cost(design);
    return design;
}

/*
 * Helper exports
 *
 */

var spawn = function(roles){
    //Creep spawning
    //Counting creeps per role
    var spawn = Game.spawns['Spawn1'];
    if(spawn.spawning){
        console.log('Currently spawning: ' + spawn.spawning.name);
    }
    else{
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
            //console.log('SPAWN ARGS: DESIGN : ' + drone_designs['emergency'] + ' | NAME: ' + role + '_' + Game.time + " | OPTS: " + {memory: {'role': role}});
            var rc = spawn.spawnCreep(drone_designs['emergency'], role + '_' + Game.time, {memory: {'role': role}});
            console.log("RC: " + rc);
        }
        
        //Check whether theres anything to build
        var build_sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
        creep_limits['builder'] = (build_sites.length == 0) ? 0 : BUILDER_LIMIT;
        //Spawning missing creeps
        //Building spawn Queue
        var spawn_queue = [];
        for(var i = 0; i<spawn_priority.length;i++){
            var role = spawn_priority[i];
            if(counts[role] < creep_limits[role]){
                //console.log("Spawning 1x " + role);
                //var r = spawn.spawnCreep(drone_designs[roles[role].design], role + '_' + Game.time, {memory: {'role': role}});
                //console.log("spawnCreep returned: " + r);
                spawn_queue.push(role);
            }
        }
        console.log("Spawn Queue: " + String(spawn_queue));
        if(spawn_queue.length > 0 && !spawn.spawning){
            var role = spawn_queue.shift();
            var spawn = spawn;
            console.log("Spawning 1x " + role);
            var cap = spawn.room.energyCapacityAvailable;
            var emergency_cost = calculate_design_cost(drone_designs['emergency']);
            var available_energy = Math.floor((cap - emergency_cost) / 100);
            console.log('CAP: ' + cap + ' | E_COST: ' + emergency_cost + ' = ENERGY: ' + available_energy);
            var drone_design = create_drone_design(available_energy, roles[role]['design']);
            if(calculate_design_cost(drone_design) <= (spawn.room.energyAvailable - emergency_cost)){
                var rc = spawn.spawnCreep(drone_design, role + '_' + Game.time, {memory: {'role': role}});
                console.log("spawnCreep returned: " + rc);    
            }
            
        }        
    }

}


module.exports = {
    'spawn': spawn,
    'drone_designs': drone_designs
};