var helper = require("creep_helper"); 

var harvester = {
    run: function(creep){
        helper.move_energy(creep,function(){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(struct){
                    return (struct.structureType == STRUCTURE_EXTENSION || struct.structureType == STRUCTURE_SPAWN) && struct.energy < struct.energyCapacity;
                }
            });
            //FIXME Spawn priorisieren ?
            if(targets.length > 0){
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0]);
                }
            }
        });
    }
};


module.exports = harvester;