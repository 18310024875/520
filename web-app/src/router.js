import messageList from 'components/messageList/messageList';
import peopleList from 'components/peopleList/peopleList';
import storyList from 'components/storyList/storyList';
import mine from 'components/mine/mine';


export default {
	defaultUrl:'/messageList',
	onchange:(n,o)=>{
		
	},
	routes:[
		{
			path:'messageList',
			option:messageList
		},
		{
			path:'peopleList',
			option:peopleList
		},
		{
			path:'storyList',
			option:storyList
		},
		{
			path:'mine',
			option:mine
		},
	]
}