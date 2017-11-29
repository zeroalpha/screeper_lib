/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep_helper');
 * mod.thing == 'a thing'; // true
 */
 
/*
 * Helpers Helper
 *
 */
 
var calculate_design_cost = function(design){
    var sum = 0;
    for(part in design){
        sum += BODYPART_COST[part];
    }
    return sum;
}
 
/*
 * Helper exports
 *
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
        var sources = creep.room.find(FIND_SOURCES);
        var src = sources[(_.random(0,sources.length - 1))];
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

var select_source = function(creep){
    if(creep.memory.source_id){
        return creep.memory.source_id;
    }
    else{
        //count current creeps per source
        var sources = creep.room.find(FIND_SOURCES)
        var counts = {'undefined': 0};
        for(src in sources){
            counts[sources[src].id] = 0;
        }
        for(cr in Game.creeps){
            console.log("Counting source for : " + cr);
            //counts[Game.creeps[cr].memory.source] = counts[Game.creeps[cr].memory.source] + 1;
            var src_id = Game.creeps[cr].memory.source_id;
            counts[src_id] = counts[src_id] + 1;
        }
        Memory.my_source_counts = counts;
        delete counts['undefined'];
        //select lowest count
        counts = _.map(counts,function(value,index,list){
            console.log("SELECT: " + index + " : " + value);
            return [value,index];
        });
        var lowest = _.sortBy(counts,function(value){
            return value[0];
        })[0];
        creep.memory.source_id = lowest[1];
        return creep.memory.source_id;
    }
}

var create_design = function(){
    
}


module.exports = {
    'move_energy': move_energy,
    'm_harvest': m_harvest,
    'random_move': random_move,
    'select_source': select_source
};