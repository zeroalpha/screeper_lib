var helper = require("creep_helper"); 

var upgrader = {
    run: function(creep){
        //console.log("Start");
        var ctrl = creep.room.controller;
        var src = Game.getObjectById(helper.select_source(creep));
        if(creep.memory.full && creep.carry.energy == 0){
            creep.memory.full = false;
            //console.log(creep.name + ": Inventory empty");
            creep.say('🔄 harvest');
        }
        
        if(!creep.memory.full && creep.carry.energy == creep.carryCapacity){
            creep.memory.full = true;
            //console.log(creep.name + ": Inventory full");
            creep.say('🔧 upgrade');
        }
        
        if(creep.memory.full){
            if(creep.upgradeController(ctrl) == ERR_NOT_IN_RANGE){
                //console.log("Moving to Controller");
                creep.moveTo(ctrl);
            }            
        }else{
            helper.m_harvest(creep,src);       
        }
    }
};


module.exports = upgrader;
