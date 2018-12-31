
var word = require('../lib/word.js');
module.exports = {

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
    
}

