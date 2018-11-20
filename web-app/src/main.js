import Com from 'com';


// 发布订阅
var eventproxy = require('eventproxy');
var $evtbus = new eventproxy();
	$evtbus.off = $evtbus.removeListener ;

	Com.component.prototype.$evtbus = $evtbus ;

var a = {
	template:'<h1> {{this.list}}{{this.name}}</h1>',
	mounted(){
		console.log(1,this)
	},
	shouldUpdate(){
		return false
	},
	updated(){
		alert(9)
	}
};
import router from './router.js';
window.App= new Com({
	router: router ,
	components:{
		a 
	},
	data(){
		return {
			list: [1,2,3,{name:1,age:'xiaoaming'}],
			name:'kkkk'
		}
	},
	template: `<div >
					<a :name="this.name" :list="this.list">
						<h1>
							h1h1h1
							<h2>
								h2h2h2
								<h3> h3h3h </h3>
							</h2>
						</h1>
					</a>

					<h1 :kk="this.list" v-for="(v,k) in this.list" @click="this.click('1',2,v,k,k+'1')">
						{{v}}
					</h1>
					<!--<router-view></router-view>-->
				</div>`,
	created(){
		
	},
	mounted(){
		console.log(this)
	}
}).$mount('#app');









