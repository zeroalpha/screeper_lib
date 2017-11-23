/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep_helper');
 * mod.thing == 'a thing'; // true
 */

var move_energy = function(creep,action) {
    if(creep.carry.energy < creep.carryCapacity){
        var src = creep.room.find(FIND_SOURCES)[0];
        creep.say('🔄 harvest');
        if(creep.harvest(src) == ERR_NOT_IN_RANGE){
            creep.moveTo(src);
        }
    }
    else{
        action();
    }
}

var m_harvest = function(creep,src){
    if(creep.harvest(src) == ERR_NOT_IN_RANGE){
        //console.log("Moving to source");
        creep.moveTo(src);
    }
}


module.exports = {
    'move_energy': move_energy,
    'm_harvest': m_harvest
};