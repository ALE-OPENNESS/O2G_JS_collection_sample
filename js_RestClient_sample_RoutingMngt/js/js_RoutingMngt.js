 var serverIP;
 var adminlogin;
 var passwd;
 var alcUserId="";
 var protocol="";
 var port="";
function doAuthent()
{
 
  serverIP =  document.getElementById('ServerIP').value;
  var listPort = document.getElementById('protocol');
	protocol = listPort.options[ listPort.selectedIndex ].value;
  port =  document.getElementById('port').value;
  adminlogin =  document.getElementById('Adminlogin').value;
  passwd =  document.getElementById('Password').value;
 
	serverUrl = protocol+serverIP+":"+port+"/api/rest/"; 		
 
	$.ajax({
		       url : serverUrl + "authenticate?version=1.0",
		       type : 'GET',
		       crossDomain: true,
		                         
            username: adminlogin, 
            password: passwd,
            xhrFields: {
				         withCredentials: true
				    },
		       success: function (data, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultAuthent").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 200) {
							document.getElementById("clickStartSession").style.visibility = "visible";
							document.getElementById("resultSession").innerHTML = ""; 
							document.getElementById("resultCloseSession").innerHTML = ""; 
						}
		       	 },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultAuthent").innerHTML = "returns " + jqXHR.status; 
							}
	});	
}
function startSession() {
	var appliNameParams = {"applicationName":"myTestProgram"};
	$.ajax({
		       url : serverUrl + "1.0/sessions",
		       type : 'POST',
		       contentType: "application/json",
		       data: JSON.stringify(appliNameParams),
		       success: function (data, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultSession").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 200) {
							document.getElementById("clickGetLogin").style.visibility = "visible";
		 					document.getElementById("resultGetLogin").innerHTML = ""; 
		 					document.getElementById("clickCloseSession").style.visibility = "visible";
							document.getElementById("resultCloseSession").innerHTML = "";
						}
		       	 },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultSession").innerHTML = "returns " + jqXHR.status; 
		     			document.getElementById("clickGetLogin").style.visibility = "hidden";
		 					document.getElementById("resultGetLogin").innerHTML = ""; 
		 					document.getElementById("clickCloseSession").style.visibility = "visible";
							document.getElementById("resultCloseSession").innerHTML = "";
							}
	});	
}
function getLoginList() {
	$.ajax({
		       url : serverUrl + "1.0/logins",
		       type : 'GET',
		       success: function (jsonResponse, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultGetLogin").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 200) {
							document.getElementById("clickGetCapability").style.visibility = "visible";
		 	  			document.getElementById("resultGetCapability").innerHTML = ""; 
		 	  
		 					var nodeList = jsonResponse.loginNames;
		 					if(	nodeList != undefined && nodeList.length >0)
							{
								var select =  document.getElementById('LoginList');
								select.innerHTML = "";
								
								for(var i in nodeList)
								{
							  	var opt = document.createElement('option');
    							opt.value = nodeList[i];
    							opt.innerHTML = nodeList[i];
    							select.appendChild(opt);
    						}
    						
							}
						}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultGetLogin").innerHTML = "returns " + jqXHR.status; 
		     			document.getElementById("clickGetDevice").style.visibility = "hidden";
		 	    		document.getElementById("resultGetDevice").innerHTML = "";
					 }
	});	

}

function getCapabilityList() {
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/routing?loginName="+callingLogin,
		       type : 'GET',
		       success: function (jsonResponse, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultGetCapability").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 200) {							
		 					var presentationRoute = jsonResponse.presentationRoute;
		 					var forwardRoute = jsonResponse.forwardRoute;
		 					var overflowRoute = jsonResponse.overflowRoute;
		 					var dnd = jsonResponse.dnd;
		 					var select =  document.getElementById('CapabilityList');
							select.innerHTML = "";
							if(presentationRoute)
							{
								var opt = document.createElement('option');
    						opt.value = "presentationRoute";
    						opt.innerHTML = "presentationRoute";
    						select.appendChild(opt);
    						
							}
							if(forwardRoute)
							{
								var opt = document.createElement('option');
    						opt.value = "forwardRoute";
    						opt.innerHTML = "forwardRoute";
    						select.appendChild(opt);
    						document.getElementById("forwardDiv").style.visibility = "visible";
    						document.getElementById("resultImmediateFwd").innerHTML = "";
    						document.getElementById("resultDeactivateFwd").innerHTML = "";
							}
							if(overflowRoute)
							{
								var opt = document.createElement('option');
    						opt.value = "overflowRoute";
    						opt.innerHTML = "overflowRoute";
    						select.appendChild(opt);
							}
							if(dnd)
							{
								var opt = document.createElement('option');
    						opt.value = "dnd";
    						opt.innerHTML = "dnd";
    						select.appendChild(opt);
    						document.getElementById("dndTitle").style.visibility = "visible";
    						document.getElementById("clickActivateDnd").style.visibility = "visible";
		 	  				document.getElementById("resultActivateDnd").innerHTML = ""; 
		 	 	  			document.getElementById("clickDeactivateDnd").style.visibility = "visible";
		 	   				document.getElementById("resultDeactivateDnd").innerHTML = ""; 
    			
							}
		 					getRoutingState();
						}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultGetCapability").innerHTML = "returns " + jqXHR.status; 
		     			
					 }
	});	
	
}

function activateDnd() {
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/routing/dnd?loginName="+callingLogin,
		       type : 'POST',
		       contentType: "application/json",
		       success: function (data, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultActivateDnd").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 204) {
								getRoutingState();
						}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultActivateDnd").innerHTML = "returns " + jqXHR.status; 
		     			
					 }
	});	

}
function deactivateDnd() {
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/routing/dnd?loginName="+callingLogin,
		       type : 'DELETE',
		       success: function (data, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultDeactivateDnd").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 204) {
								getRoutingState();
						}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultDeactivateDnd").innerHTML = "returns " + jqXHR.status; 
		     			
					 }
	});	
	
}
function getRoutingState()
{
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/routing/state?loginName="+callingLogin,
		       type : 'GET',
		       success: function (jsonResponse, textStatus, jqXHR) {
		       	
		       	if (jqXHR.status === 200) {
		       		//dnd
							var dndState = jsonResponse.dndState;
		 					var dndactivated = dndState.activate;
		 					if(dndactivated)
		 						document.getElementById("dndStatus").innerHTML="Activated";
		 					else
		 						document.getElementById("dndStatus").innerHTML="Deactivated";	
		 					//fwd route
		 				  var forwardRoutes=jsonResponse.forwardRoutes;
		 				 
		 				  if(forwardRoutes!= undefined && forwardRoutes.length >0)
		 				  {
		 				  	for (var i=0; i<forwardRoutes.length; i++){
		 				  		var routeFwdType=forwardRoutes[i].forwardType;
		 				  		var routeDestinations=forwardRoutes[i].destinations;
		 				  		if(routeDestinations!= undefined && routeDestinations.length >0)
		 				  		{
		 				  			for (var j=0; j<routeDestinations.length; j++){
		 				  				var number=routeDestinations[j].number;
		 				  				if(routeFwdType==null || routeFwdType=="undefined"){
		 				  						document.getElementById("forwardStatus").innerHTML="Immediate Fwd -> "+number;	
		 				  				}
		 				  				else if(routeFwdType=="NO_ANSWER"){
		 				  						document.getElementById("forwardStatus").innerHTML="No reply => "+number;	
		 				  				}
		 				  				else if(routeFwdType=="BUSY"){
		 				  						document.getElementById("forwardStatus").innerHTML="Busy => "+number;	
		 				  				}
		 				  				else if(routeFwdType=="BUSY_NO_ANSWER"){
		 				  					document.getElementById("forwardStatus").innerHTML="Busy / no reply => "+number;
		 				  				}
		 				  				else
						 				  {
						 				  		document.getElementById("forwardStatus").innerHTML=""; 
						 				  }
		 				  			}
		 				  		}
		 				  	}
		 				  }
		 				  else {
		 				  	document.getElementById("forwardStatus").innerHTML="";	
		 				  }
		 				}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("forwardStatus").innerHTML=""; 
		     			
					 }
	});	
	
}
function getFwdRoute()
{
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/routing/forwardroute?loginName="+callingLogin,
		       type : 'GET',
		       success: function (jsonResponse, textStatus, jqXHR) {
		       	
		       	if (jqXHR.status === 200) {
							var forwardType = jsonResponse.forwardType;
							var destinations = jsonResponse.destinations;
		 				  if(destinations!= undefined && destinations.length >0)
		 				  {
 				  			for (var j=0; j<destinations.length; j++){
 				  				var number=destinations[j].number;
 				  				if(forwardType==null || forwardType=="undefined"){
 				  						document.getElementById("forwardStatus").innerHTML="Immediate Fwd -> "+number;	
 				  				}
 				  				else if(forwardType=="NO_ANSWER"){
 				  						document.getElementById("forwardStatus").innerHTML="No reply => "+number;	
 				  				}
 				  				else if(forwardType=="BUSY"){
 				  						document.getElementById("forwardStatus").innerHTML="Busy => "+number;	
 				  				}
 				  				else if(forwardType=="BUSY_NO_ANSWER"){
 				  					document.getElementById("forwardStatus").innerHTML="Busy / no reply => "+number;
 				  				}
 				  			}
		 				  }
		 				  else
		 				  {
		 				  		document.getElementById("forwardStatus").innerHTML=""; 
		 				  }
		 				}
		 				else
	 				  {
	 				  		document.getElementById("forwardStatus").innerHTML=""; 
	 				  }
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("forwardStatus").innerHTML=""; 
		     			
					 }
	});	
	
}
function activateFwd() {
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
  var listFwdType = document.getElementById('fwdType');
  var fwdType=listFwdType.options[ listFwdType.selectedIndex ].value;
  
  var fwdRouteRequestParams = {
   "forwardRoute": {
   	"forwardType":fwdType,
   	"destinations":[{
   		"type":"NUMBER",
   		"number":document.getElementById("fwdNumber").value
   	}]
   }

 }
 if(fwdType==="IMMEDIATE")
  	fwdRouteRequestParams = {
   "forwardRoute": {
   	"destinations":[{
   		"type":"NUMBER",
   		"number":document.getElementById("fwdNumber").value
   	}]
   }

 }
	$.ajax({
		       url : serverUrl + "1.0/routing/forwardroute?loginName="+callingLogin,
		       type : 'POST',
		       contentType: "application/json",
		       data: JSON.stringify(fwdRouteRequestParams),
		       success: function (data, textStatus, jqXHR) {
		       	
		       	document.getElementById("resultImmediateFwd").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 204) {
								getFwdRoute();
						}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultImmediateFwd").innerHTML = "returns " + jqXHR.status; 
		     			
					 }
	});	
	
}
function deactivateFwd() {
	var list = document.getElementById('LoginList');
  var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/routing/forwardroute?loginName="+callingLogin,
		       type : 'DELETE',
		       success: function (data, textStatus, jqXHR) {		       	
		       		document.getElementById("resultDeactivateFwd").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 204) {
								getFwdRoute();
						}
		       },
		       error : function(jqXHR, statut){		     			
		     			document.getElementById("resultDeactivateFwd").innerHTML = "returns " + jqXHR.status; 
					 }
	});
	
}
function closeSession() {
	$.ajax({
		       url : serverUrl + "1.0/sessions",
		       type : 'DELETE',
		       success: function (data, textStatus, jqXHR) {		       	
		       		hideButton(jqXHR.status);
		       },
		       error : function(jqXHR, statut){		     			
		     			hideButton(jqXHR.status);
					 }
	});
	
	
}
function hideButton(codeStatus) {
		 document.getElementById("resultCloseSession").innerHTML = "returns " + codeStatus; 
		 document.getElementById("resultAuthent").innerHTML = "";
		 document.getElementById("clickGetLogin").style.visibility = "hidden";
		 document.getElementById("clickGetCapability").style.visibility = "hidden";
		 document.getElementById("clickActivateDnd").style.visibility = "hidden";		 
		 document.getElementById("forwardDiv").style.visibility = "hidden";		 
		 document.getElementById("clickDeactivateDnd").style.visibility = "hidden";
		 document.getElementById("dndTitle").style.visibility = "hidden";
		 
	}