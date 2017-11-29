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

var tower_code = require('tower');

var spawn_helper = require('spawn_creeps');

module.exports.loop = function () {
    console.log("=======> NEW TICK <========");
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Creep spawning
    spawn_helper.spawn(roles);
    
    
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
    var tower = Game.getObjectById('4eab0b298ee06df');
    tower_code.run(tower);
    
    //Report
    console.log("Energy Storage: " + Game.spawns['Spawn1'].room.energyAvailable + "/" + Game.spawns['Spawn1'].room.energyCapacityAvailable);
    console.log("Cost per design");
    for(design in spawn_helper.drone_designs){
        var sum = 0;
        for(part of spawn_helper.drone_designs[design]){
            sum = sum + BODYPART_COST[part];
            //console.log("Part: " + part + " cost: " + BODYPART_COST[part]);
        }
        console.log(design + ": " + sum);
    }
    console.log("=======> END TICK <========");

}