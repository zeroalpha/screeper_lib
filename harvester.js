var helper = require("creep_helper"); 

var delivery_order = [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER];

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
        
        var worked = false;
        if(creep.memory.full){
            //console.log("DELIVERY START : worked = " + worked);
            for(target in delivery_order){
                var target_type = delivery_order[target];
                var targets = creep.room.find(FIND_STRUCTURES,{filter: function(v){
                    //console.log('FILTER: ' + v.energy + ' :: ' + v.energyCapacity);
                    return v.structureType == target_type && v.energy < v.energyCapacity;
                }});
                //console.log('HARVESTER TARGETS (' + target_type + '): ' + targets);
                
                if(!worked && targets.length > 0){
                    //creep.say('🚚 deliver');
                    //console.log("DELIVER TO : " + targets);
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(targets[0],{visualizePathStyle: {stroke: '#1CEDDF'}});
                    }
                    worked = true;
                }           
            }
            if(!worked){
                helper.random_move(creep);
            }
        }
        else{
            helper.m_harvest(creep,src);
        }
    }
};


module.exports = harvester;