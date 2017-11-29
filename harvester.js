var helper = require("creep_helper"); 

var harvester = {
    run: function(creep){
        //var src = creep.room.find(FIND_SOURCES)[0];
        var src = Game.getObjectById(helper.select_source(creep));
        
        if(creep.memory.full && creep.carry.energy == 0){
            creep.memory.full = false;
            creep.say('🔄 harvest');
        }
        
        if(!creep.memory.full && creep.carry.energy == creep.carryCapacity){
            creep.memory.full = true;
            creep.say('🚚 deliver');
        }
        
        if(creep.memory.full){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(struct){
                    return (struct.structureType == STRUCTURE_EXTENSION || struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_TOWER) && struct.energy < struct.energyCapacity;
                }
            });
            //FIXME Spawn priorisieren ?
            if(targets.length > 0){
                //creep.say('🚚 deliver');
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0],{visualizePathStyle: {stroke: '#1CEDDF'}});
                }
            }else{
                helper.random_move(creep);
            }            
        }
        else{
            helper.m_harvest(creep,src);
        }
    }
};


module.exports = harvester;