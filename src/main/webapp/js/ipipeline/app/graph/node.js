var ComponentNode = jClass({
	init : function(id, component, hosts) {
		this.id = id;
		this.component = component;
		this.action = null;
		this.params = new Array();
		this.hosts = new Array();
		if (verifyParam(component) && component.actions.length > 0) {
			this.action = component.actions[0];
			for ( var i in component.actions[0].params) {
				var p = component.actions[0].params[i];
				this.params.push({
					key : p.paramKey,
					value : p.defaultValue
				});
			}
		}
		if (verifyParam(hosts) && hosts.length > 0) {
			for ( var i in hosts) {
				this.hosts.push(hosts[i]);
			}
		}
	},

	getId : function() {
		return this.id;
	},

	getComponent : function() {
		return this.component;
	},

	getAction : function() {
		return this.action;
	},

	setAction : function(actionId) {
		for ( var i in this.component.actions) {
			if (this.component.actions[i].id == actionId) {
				this.action = this.component.actions[i];
				this.params = [];
				for ( var i in this.action.params) {
					var p = this.action.params[i];
					this.params.push({
						key : p.paramKey,
						value : p.defaultValue
					});
				}
			}
		}
	},

	setParams : function(params) {
		this.params = params;
	},

	getHosts : function() {
		return this.hosts;
	},

	setHosts : function(hosts) {
		this.hosts = hosts;
	}
});

/**
 * 从模板创建ContainerNode
 * */
var templateNode = jClass({
    init : function(nodeId, stepName, displayName, stageName, xPos, yPos, params){
        this.nodeId = nodeId;
        this.stepName = stepName;

        // JSON对象的改深拷贝
        this.params = JSON.parse(JSON.stringify(params));
        console.log("Params: " + JSON.stringify(this.params));

        this.displayName = displayName;
        this.stageName = stageName;

        this.nodeStatus = "CREATED";
        this.xPos=xPos;
        this.yPos=yPos;
    },

    getStepName: function() {
        return this.stepName;
    },
    getDisplayName : function(){
        return this.displayName;
    },
    getStatus :function(){
        return this.status;
    },
    getStageName : function(){
        return this.stageName;
    },
});


// 我的思考:组件列表,拖拽后,编排的是容器实例,所以设计为容器节点
// 这个函数是在已经存在container的情况下, 只须将该node还原即可
var ContainerNode = jClass(ComponentNode, {
	init : function(id, component, hosts, name, port, initCount, maxCount,
			status, containerId) {
		this.base.init.apply(this, [ id, component, hosts ]);
		this.name = name;
		this.port = port;
		this.initCount = initCount;
		this.maxCount = maxCount;
		this.status = status;
		this.containerId = verifyParam(containerId) ? containerId : -1;
		this.templates = new Array();
		this.attributes = new Array();
	},
	
			
		 
	getTemplates: function(){
		return this.templates;
	},
	
	setTemplates: function(templates){
		this.templates = templates;
	},
	
	getAttribtues: function(){
		return this.attributes;
	},
	
	setAttributes: function(attributes){
		this.attributes = attributes;
	},

	getName : function() {
		return this.name;
	},

	setName : function(name) {
		this.name = name;
	},

	getPort : function() {
		return this.port;
	},

	setPort : function(port) {
		this.port = port;
	},

	getInitCount : function() {
		return this.initCount;
	},

	setInitCount : function(initCount) {
		this.initCount = initCount;
	},

	getMaxCount : function() {
		return this.maxCount;
	},

	setMaxCount : function(maxCount) {
		this.maxCount = maxCount;
	},

	getStatus : function() {
		return this.status;
	},

	setStatus : function(status) {
		this.status = status;
	},

	getContainerId : function() {
		return this.containerId;
	},

	setContainerId : function(containerId) {
		this.containerId = containerId;
	}
});

var ContainerInstanceNode = jClass(ComponentNode, {
	init : function(id, name, port, status, instanceId, containerId) {
		this.base.init.apply(this, [ id, null, null ]);
		this.name = name;
		this.port = port;
		this.status = status;
		this.instanceId = instanceId;
		this.containerId = verifyParam(containerId) ? containerId : -1;
	},

	getName : function() {
		return this.name;
	},

	setName : function(name) {
		this.name = name;
	},

	getPort : function() {
		return this.port;
	},

	setPort : function(port) {
		this.port = port;
	},

	getStatus : function() {
		return this.status;
	},

	setStatus : function(status) {
		this.status = status;
	},
	
	getInstanceId : function() {
		return this.instanceId;
	},

	setInstanceId : function(instanceId) {
		this.instanceId = instanceId;
	},

	getContainerId : function() {
		return this.containerId;
	},

	setContainerId : function(containerId) {
		this.containerId = containerId;
	}
});


var KV = jClass({
	init : function(name, value) {
		this.name=name;
		this.value=value;
	},
	getName : function() {
		return this.Name;
	},
	getValue : function(){
		return this.value;
	}
});
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}

var RunningStep = jClass({
    init : function (nodeId, nodeName, nodeDisplayName, nodeStageName, nodeParams, nodeStatus, xPos, yPos) {
        this.nodeId = nodeId;
        this.stepName = nodeName;
        this.displayName = nodeDisplayName;
        this.stageName = nodeStageName;
        this.params = nodeParams;
        this.nodeStatus = nodeStatus;
        this.xPos = xPos;
        this.yPos = yPos;

        // 存的是链接到该节点的节点信息, 目前暂时只支持单点, 串行
        this.dependency = new Map();
    },

    getStepName: function() {
        return this.stepName;
    },
    getDisplayName : function(){
        return this.displayName;
    },
    getStatus :function(){
        return this.status;
    },
    getStageName : function(){
        return this.stageName;
    },

});

// TODO : Container不存在, 通过nodeId和提供的ActionId创建新的node
var ContainerNode = jClass({
	// componentId合法,说明是新建,不合法,说明是前端传来的情况
	init : function(nodeId, componentId) {
		if(verifyParam(componentId)){

			console.log("新建Node对象:" + nodeId + ":" + componentId);
			this.componentId = componentId;
			this.nodeId = nodeId;

			// 获取选中的Action
			var component = appPanel.cachedComponents.get(componentId);
			console.log("新建component对象" + JSON.stringify(component));

			// var deployment=component.deployment;
			// console.log("新建node对象:" + deployment);
            //
			// var tempSpec=deployment.spec.template.spec;
			// var tempSpecContainer=tempSpec.containers[0];

			//获取镜像地址
			// this.image=tempSpecContainer.image;

			//获取环境变量信息
			//this.offsetMap=new Map();
			// for(var i in tempSpecContainer.env){
			// 	var item=new KV(tempSpecContainer.env[i].name,tempSpecContainer.env[i].value);
			// 	this.envs.push(item);
			// }
			//获取环境变量的
			// this.containerPort=tempSpecContainer.ports[0].containerPort;
			// this.nodePort=randomNum(30000,32767);

			this.stepName = JSON.parse(JSON.stringify(component.stepName));
			console.log("stepName: " + this.stepName);

			// JSON对象的改深拷贝
			this.params = JSON.parse(JSON.stringify(component.params));
            console.log("Params: " + JSON.stringify(this.params));

			for(var i in this.params){
				// 给每个参数都加上paramValue属性
				this.params[i].paramValue = "";
			}

			this.displayName = "";
			this.stageName = "";

			this.nodeStatus = "CREATED";
			this.xPos="";
			this.yPos="";

			// 存的是链接到该节点的节点信息, 目前暂时只支持单点, 串行
			this.dependency = new Map();

		// TODO: 将来从已执行的build中恢复step
		} else {
			console.log("从container恢复Node对象:" + JSON.stringify(nodeId));
			var container=nodeId;
			this.componentId=container.chart.id;
			this.nodeId = container.nodeId;
			this.envs = new Array();
			//---------------------
			//获取组件模板信息
			var deployment=container.deployment;
			
			var tempSpec=deployment.spec.template.spec;
			var tempSpecContainer=tempSpec.containers[0];
			//获取镜像地址
			this.image=tempSpecContainer.image;
			//获取环境变量信息
			//this.offsetMap=new Map();
			for(var i in tempSpecContainer.env){
				var item=new KV(tempSpecContainer.env[i].name,tempSpecContainer.env[i].value);
				this.envs.push(item);
			}
			//获取环境变量的
			this.containerPort=tempSpecContainer.ports[0].containerPort;
			this.nodePort=randomNum(30000,32767);
			var service=container.service;
			this.serviceName=service.spec.ports[0].nodePort;
			this.dependency=new Map();
			this.nodeStatus=container.status;
			this.xPos=container.xPos;
			this.yPos=container.yPos;
		}
	},

	getNodeId : function() {
		return this.nodeId;
	},

	getImage : function() {
		return this.image;
	},

	getEnvs : function() {
		return this.envs;
	},

	setEnvs : function(envs) {
		this.envs = envs;
	},
	getContainerPort :function(){
		return this.containerPort;
	},
	getNodePort: function() {
		return this.nodePort;
	},
	setServiceName:function(svc){
		this.serviceName=svc;
	},
	getDependency: function() {
		return this.dependency;
	},

    getStepName: function() {
        return this.stepName;
    },
	getDisplayName : function(){
		return this.displayName;
	},
	getStatus :function(){
		return this.status;
	},
	getStageName : function(){
		return this.stageName;
	},

	clone:function(){
		var cloneNode=new ContainerNode(this.nodeId,this.componentId);
		cloneNode.componentId=this.componentId;
		cloneNode.xPos = $("#" + this.nodeId).offset().left,
		cloneNode.yPos = $("#" + this.nodeId).offset().top,
		cloneNode.nodeId=this.nodeId;
		cloneNode.envs=this.envs;
		cloneNode.image=this.image;
		cloneNode.containerPort=this.containerPort;
		cloneNode.nodePort=this.nodePort;
		cloneNode.serviceName=this.serviceName;
		cloneNode.dependency=new Array();
		for(var i in this.dependency.values()){
			console.log("输出依赖项:"+this.dependency.values()[i].nodeId);
			cloneNode.dependency.push(this.dependency.values()[i]);
		}
		cloneNode.nodeStatus=this.nodeStatus;
		console.log(cloneNode.xPos);
		console.log(cloneNode.yPos);
		return cloneNode;
	}
});

function deepClone(source){
	   if(!source || typeof source !== 'object'){
	     throw new Error('error arguments', 'shallowClone');
	   }
	   var targetObj = source.constructor === Array ? [] : {};
	   for(var keys in source){
	      if(source.hasOwnProperty(keys)){
	         if(source[keys] && typeof source[keys] === 'object'){
	           targetObj[keys] = source[keys].constructor === Array ? [] : {};
	           targetObj[keys] = deepClone(source[keys]);
	         }else{
	           targetObj[keys] = source[keys];
	         }
	      } 
	   }
	   return targetObj;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	