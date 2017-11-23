var helper = require("creep_helper"); 
/*
var harvester = {
    run: function(creep){
        if(creep.carry.energy < creep.carryCapacity){
            var src = creep.room.find(FIND_SOURCES)[0];
            if(creep.harvest(src) == ERR_NOT_IN_RANGE){
                creep.moveTo(src);
            }
        }
        else{
            var spwn = Game.spawns['Spawn1'];
            if(creep.transfer(spwn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(spwn);
            }
        }
    }
};
*/
var harvester = {
    run: function(creep){
        helper.move_energy(creep,function(){
            var spwn = Game.spawns['Spawn1'];
            if(creep.transfer(spwn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(spwn);
            }           
        });
    }
};


module.exports = harvester;