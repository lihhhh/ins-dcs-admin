const context = require.context('./', false, /\.vue$/);
const result = [];

context.keys().map((item) => {
    var name = item.replace(/^\.\/(.*).vue$/, '$1');
    
	var cpt = function (r) {
		return require.ensure([], function () {
            var dir = item.replace('.', '');
			return require(`@/components/coms${dir}`);
		})
	};


	result.push({
		name: name,
		component: cpt,
	})
});

// 全局注册组件
export default {
    install:function(Vue){
        result.map(it=>{
            Vue.component(it.name,it.component);
        })
    }
}