/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

var role = {
    run: function(tower){
        //attack
        var next_hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(next_hostile){
            console.log(tower.id + ": Attacking => " + next_hostile.name);
            tower.attack(next_hostile);
        }
        //repair
        var next_repair = tower.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: (struct) => struct.hits < struct.hitsMax;
        });
        if(next_repair){
            console.log(tower.id + ": Repairing");
            tower.repair(next_repair);
        }
    }
};

module.exports = role;