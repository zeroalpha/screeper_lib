/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder');
 * mod.thing == 'a thing'; // true
 */
 
var helper = require("creep_helper"); 

var builder = {
    run: function(creep){
        //select site with highest progress
        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        var site = _.sortBy(sites,'progress')[sites.length - 1];
        //var sources = creep.room.find(FIND_SOURCES);
        //var src = sources[(_.random(0,sources.length - 1))];
        var src = Game.getObjectById(helper.select_source(creep));
        
        if(!site){
            helper.random_move(creep);
        }
        
        if(creep.memory.full && creep.carry.energy == 0){
            creep.memory.full = false;
            //console.log(creep.name + ": Inventory empty");
            creep.say('🔄 harvest');
        }
        
        if(!creep.memory.full && creep.carry.energy == creep.carryCapacity){
            creep.memory.full = true;
            //console.log(creep.name + ": Inventory full");
            creep.say('🚧 build');
        }
        
        if(creep.memory.full){
            if(creep.build(site) == ERR_NOT_IN_RANGE){
                //console.log("Moving to Build Site");
                creep.moveTo(site,{visualizePathStyle: {stroke: '#0055ff'}});
            }            
        }else{
            helper.m_harvest(creep,src);      
        }
    }
};


module.exports = builder;