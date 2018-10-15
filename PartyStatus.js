// Tasks: 1 - create a handout, 2 - add character details to handout

var createHandout = function(){
    statusHandout = createObj('handout', {
        name: 'Party Status'
    });
    statusHandout.set({
        gmnotes: '<h3>Party Status</h3>' && ' ' && getPlayers()
    });
    return statusHandout;
};

var getPlayers = function(){
    "use strict";
    return _.chain(filterObj((o)=>{
     return (o.get('type')==='attribute' &&
        o.get('name')==='player-name');
      }))
      .map((o)=>{return o.get('characterid');})
      .map((cid)=>{return getObj('character',cid);})
      .reject(_.isUndefined)
      .value();
  };

  var getStatuses = function(){
      //for player : players
        //get hp
        //get exhaustion
        
  }