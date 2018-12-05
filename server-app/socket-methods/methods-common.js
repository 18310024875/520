
var word = require('../lib/word.js');
module.exports = {

    getTime(){
        return (new Date()).getTime()-500 + parseInt(Math.random(1)*1000) ;
    },

    parseArrayMakeWordObj( arr=[] , key='name' ){
        var obj = {"A":[],"B":[],"C":[],"D":[],"E":[],"F":[],"G":[],"H":[],"I":[],"J":[],"K":[],"L":[],"M":[],"N":[],"O":[],"P":[],"Q":[],"R":[],"S":[],"T":[],"U":[],"V":[],"W":[],"X":[],"Y":[],"Z":[],"#":[]};
        arr.map( item=>{
            let str = item[key] ;
            let wd = word(str) ;
            let k = (wd[0]).toLocaleUpperCase();
            obj[k] ? obj[k].push(item) : obj['#'].push(item)
        });
        return obj ;
    },

    split_s(str=''){
        return str.split(',').filter(v=>v);
    },

    
}

