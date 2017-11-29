/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('repair');
 * mod.thing == 'a thing'; // true
 */

var helper = require("creep_helper"); 

var role = {
    run: function(creep){
        var src = Game.getObjectById(helper.select_source(creep));
        
        if(creep.memory.full && creep.carry.energy == 0){
            creep.memory.full = false;
            creep.say('🔄 harvest');
        }
        
        if(!creep.memory.full && creep.carry.energy == creep.carryCapacity){
            creep.memory.full = true;
            creep.say('🔧 repair');
        }
        
        
        if(creep.memory.full){
            //find structure to repair
            var targets = creep.room.find(FIND_STRUCTURES,{
                filter: (struct) => struct.hits < struct.hitsMax
            });
            if(targets.length > 0){
                //sort by damage
                targets = _.sortBy(targets,function(e){return (e.hitsMax - e.hits)});
                var target = targets[targets.length - 1];
                if(creep.repair(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
            else{
                helper.random_move(creep);
            }            
        }
        else{
            helper.m_harvest(creep,src);
        }
    }
};

module.exports = role;