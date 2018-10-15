var PartyStatus = PartyStatus || (function() {
    'use strict';

    createStatusHandout = function() {
        var statusHandout = createObj('handout',{name: statusHandoutName});
        statusHandout.set('gmnotes', '<h3>Party Status</h3>');
        return statusHandout;
    },

    getStatusHandout = function() {
        var statusHandout = filterObjs(function(o){
            return ('handout' === o.get('type') && statusHandoutName === o.get('name') && false === o.get('archived'));
        })[0];
        
        if(statusHandout){
            return statusHandout;
        }
        return createStatusHandout();
    },

    handleInput = function(msg_orig){
        var args, 
            ps, 
            longtext, 
            msg = _.clone(msg_orig);

        if (msg.type !== "api" && !playerIsGM(msg.playerid)){
            return;
        }
        
        if(_.has(msg,'inlinerolls')){
			msg.content = _.chain(msg.inlinerolls)
				.reduce(function(m,v,k){
                    var ti=_.reduce(v.results.rolls,function(m2,v2){
                        if(_.has(v2,'table')){
                            m2.push(_.reduce(v2.results,function(m3,v3){
                                m3.push(v3.tableItem.name);
                                return m3;
                            },[]).join(', '));
                        }
                        return m2;
                    },[]).join(', ');
					m['$[['+k+']]']= (ti.length && ti) || v.results.total || 0;
					return m;
				},{})
				.reduce(function(m,v,k){
					return m.replace(k,v);
				},msg.content)
				.value();
        }
        
        args = msg.content.split(/\s/);

        switch(args.shift()) {
            case '!pstats':
            ps = getStatusHandout();
            ps.get('notes',function(n){
                if(!_.isNull(n)){
                    setTimeout(function(){
                        let text=n+'<br>'+bulletChar+' '+args.join(' ');
                        ps.set('notes',text);
                    },0);
                }
            });
            break;
        }
    },

    registerEventHandlers = function() {
        on('chat:message',handleInput);
    };

    return {
        RegisterEventHandlers: registerEventHandlers
    };

}());

on('ready',function() {
    'use strict';

    PartyStatus.RegisterEventHandlers();
});