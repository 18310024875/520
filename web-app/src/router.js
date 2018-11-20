// 必须挂载跟组件 等于跟组件不许存在 router-view ;

// import project from 'components/project/project';
// import projectType from 'components/project-type/project-type';

// export default [
// 	{
// 		path:  'projectType',
// 		option: projectType
// 	}
// ]





// 必须挂载跟组件 等于跟组件不许存在 router-view ;

var ok1 = {
	template:`<div><h1>ok1</h1> <router-view></router-view>router-view </div>`,
	mounted(){
		this.$router.listener[this.id]=(a,b)=>{
			console.log('999',a,b)
		}
	},
	destroyed(){
		this.$router.listener[this.id]=null ;
	}
} 
var ok2 = {
	template:`<div>ok2</div>`,
	mounted(){
		this.$router.listener[this.id]=(a,b)=>{
			console.log('999',a,b)
		}
	},
	destroyed(){
		this.$router.listener[this.id]=null ;
	}
}
var son1={
	template:`<div>son1</div>`
}
var son2={
	template:`<div>son2</div>`
}


export default {
	defaultUrl:'/ok1/son1',
	listener:{},
	onchange(n,o){
		for(var k in this.listener){
			this.listener[k]&&this.listener[k]( n , o );
		}
	},
	routes:[
		{
			path:'ok1',
			option:ok1,
			children:[
				{
					path:'son1',
					option:son1
				},
				{
					path:'son2',
					option:son2
				}
			]
		},
		{
			path:'ok2',
			option:ok2
		},
	]
}