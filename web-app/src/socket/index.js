import io from './socket.io.js';
import config from 'src/config';

export default function( cb ){

	var socket = io( config['host'] );

	return 	socket ;
};