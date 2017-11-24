/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep_helper');
 * mod.thing == 'a thing'; // true
 */

var directions = [
    TOP,
    TOP_RIGHT,
    RIGHT,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    TOP_LEFT
];

var random_move = function(creep){
    creep.say("⚙ Idling");
    creep.move(directions[_.random(0,7)]);
}

var move_energy = function(creep,action) {
    if(creep.carry.energy < creep.carryCapacity){
        var src = creep.room.find(FIND_SOURCES)[0];
        creep.say('🔄 harvest');
        if(creep.harvest(src) == ERR_NOT_IN_RANGE){
            creep.moveTo(src,{visualizePathStyle: {stroke: '#27C240'}});
        }
    }
    else{
        action();
    }
}

var m_harvest = function(creep,src){
    if(creep.harvest(src) == ERR_NOT_IN_RANGE){
        //console.log("Moving to source");
        creep.moveTo(src,{visualizePathStyle: {stroke: '#27C240'}});
    }
}


module.exports = {
    'move_energy': move_energy,
    'm_harvest': m_harvest,
    'random_move': random_move
};