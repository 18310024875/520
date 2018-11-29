import main from 'components/main/main';
import roomList from 'components/main-roomList/main-roomList';
import manList from 'components/main-manList/main-manList';
import discoverList from 'components/main-discoverList/main-discoverList';
import mine from 'components/main-mine/main-mine';
import activeRoom from 'components/activeRoom/activeRoom';

export default {
	defaultUrl:'/main/roomList',
	onchange:(n,o)=>{
		
	},
	routes:[
		{
			path:'main',
			option:main,
			children:[
				{
					path:'roomList',
					option:roomList
				},
				{
					path:'manList',
					option:manList
				},
				{
					path:'discoverList',
					option:discoverList
				},
				{
					path:'mine',
					option:mine
				},
			]
		},
		{
			path:'activeRoom',
			option:activeRoom
		},
	]
}