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
        //console.log("Start");
        var site = creep.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
        var src = creep.room.find(FIND_SOURCES)[0];
        if(creep.memory.full && creep.carry.energy == 0){
            creep.memory.full = false;
            console.log(creep.name + ": Inventory empty");
        }
        
        if(!creep.memory.full && creep.carry.energy == creep.carryCapacity){
            creep.memory.full = true;
            console.log(creep.name + ": Inventory full");
        }
        
        if(creep.memory.full){
            if(creep.build(site) == ERR_NOT_IN_RANGE){
                //console.log("Moving to Build Site");
                creep.moveTo(site);
            }            
        }else{
            helper.m_harvest(creep,src);      
        }
    }
};


module.exports = builder;