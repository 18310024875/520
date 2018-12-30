import main from 'components/main/main';
import roomList from 'components/main-room-list/main-room-list';
import addressBook from 'components/main-address-book/main-address-book';
import addressBookFriends from 'components/main-address-book-friends/main-address-book-friends';
import addressBookGroups from 'components/main-address-book-groups/main-address-book-groups';

import discoverList from 'components/main-discover-list/main-discover-list';
// import mine from 'components/main-mine/main-mine';
// import activeRoom from 'components/activeRoom/activeRoom';

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
					path:'addressBook',
					option:addressBook,
					children:[
						{
							path:'friends',
							option:addressBookFriends,
						},
						{
							path:'groups',
							option:addressBookGroups,							
						}
					]
				},
				{
					path:'discoverList',
					option:discoverList
				},
				// {
				// 	path:'mine',
				// 	option:mine
				// },
			]
		},
		// {
		// 	path:'activeRoom',
		// 	option:activeRoom
		// },
	]
}