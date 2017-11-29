/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('fighter');
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
            creep.say('🔫 Patrol');
        }
        
        if(creep.memory.full){
            //search for enemies
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target){
                //move and attack
                if(creep.attack(target) == ERR_NOT_IN_RANGE){
                    console.log(creep.name + ": Attacking Enemy : " + target.id);
                    creep.say("🔫 Attack");
                    creep.moveTo(target);
                }
            }
            else{
                helper.random_move(creep);
            }            
        }else{
            helper.m_harvest(creep,src);
        }
        

    }
};

module.exports = role;