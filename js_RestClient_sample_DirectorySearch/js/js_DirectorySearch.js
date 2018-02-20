 var serverIP;
 var adminlogin;
 var passwd;
 var alcUserId="";
 var protocol="";
 var port="";
 var criteriaNum=0;
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
					document.getElementById("searchDiv").style.visibility = "visible";	
					document.getElementById("or").style.visibility = "visible";
					document.getElementById("and").style.visibility = "visible";
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
		     			
					 }
	});	

}
function startSearch() {
	var searchRequest = getCriterion();
	
	var list = document.getElementById('LoginList');
	var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/directory/search?loginName="+callingLogin,
		       type : 'POST',
		       contentType: "application/json",
		       data: JSON.stringify(searchRequest),
		       success: function (data, textStatus, jqXHR) {		       	
					document.getElementById("resultStartSearch").innerHTML = "returns " + jqXHR.status; 
					if (jqXHR.status === 201) {
								$('#searchResultButton').prop('disabled', false);
								$('#searchStopButton').prop('disabled', false);
								document.getElementById("resultStopSearch").innerHTML = ""; 
								document.getElementById("resultGetSearchResult").innerHTML = "";
								document.getElementById("resultCode").innerHTML = "";
								//var table =  $('#resultSearchTable');/* tr:not(:first-child) */
								//table.remove(); 
								var table = document.getElementById("resultSearchTable");
								var rowCount = table.rows.length;
								for (var i = 1; i < rowCount; i++) {
									table.deleteRow(1);
								}
								
					}
		       	},
		       error : function(jqXHR, statut){
		     			$('#searchResultButton').prop('disabled', true);
						$('#searchStopButton').prop('disabled', true);
						document.getElementById("resultStopSearch").innerHTML = ""; 
		 				document.getElementById("resultGetSearchResult").innerHTML = "";
					}
	});	
}
function addCriteria(op){
	criteriaNum++;
	if(op=="OR")
		document.getElementById("and").style.visibility = "hidden";
	else
		document.getElementById("or").style.visibility = "hidden";
	var divCrieria = document.getElementById('divCrieria');
	
	
	
	var label = document.createElement('label');
    label.innerHTML="Field ";
	label.setAttribute('style','width: 80px');
	
	var select = document.createElement('select');
	select.type = 'text';
    select.setAttribute('name', 'shField'+criteriaNum);
    select.setAttribute('id', 'shField'+criteriaNum);
    select.setAttribute('style','width: 120px');
	var optField1=document.createElement('option');
	optField1.value="lastName";
	optField1.innerHTML = "Last Name";
	select.appendChild( optField1 );
	var optField2=document.createElement('option');
	optField2.value="firstName";
	optField2.innerHTML = "First Name";
	select.appendChild( optField2 );
	var optField3=document.createElement('option');
	optField3.value="id.phoneNumber";
	optField3.innerHTML = "Phone Number";
	select.appendChild( optField3 );
	var optField4=document.createElement('option');
	optField4.value="id.loginName";
	optField4.innerHTML = "Login Name";
	select.appendChild( optField4 );
	
	var label2 = document.createElement('label');
    label2.innerHTML=" Operation ";
	label2.setAttribute('style','width: 80px');	
	
	var select1 = document.createElement('select');
    select1.type = 'text';
    select1.setAttribute('name', 'shOperation'+criteriaNum);
    select1.setAttribute('id', 'shOperation'+criteriaNum);
    select1.setAttribute('style','width: 120px');
    var option1=document.createElement('option');
	option1.value="EQUAL_IGNORE_CASE";
	option1.innerHTML = "EQUAL_IGNORE_CASE";
	select1.appendChild( option1 );
	var option2=document.createElement('option');
	option2.value="BEGIN_WITH";
	option2.innerHTML = "BEGIN_WITH";
	select1.appendChild( option2 );
	var option3=document.createElement('option');
	option3.value="CONTAIN";
	option3.innerHTML = "CONTAIN";
	select1.appendChild( option3 );
	var option4=document.createElement('option');
	option4.value="END_WITH";
	option4.innerHTML = "END_WITH";
	select1.appendChild( option4 );
	
	var label3 = document.createElement('label');
    label3.innerHTML=" Operand ";
	label3.setAttribute('style','width: 80px');	
	
	var input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('value', 'o');
	input.setAttribute('style', 'width: 80px');
	input.setAttribute('id', 'shOperand'+criteriaNum);
 	var space = document.createElement('br');
	
	divCrieria.appendChild( label ); 
	divCrieria.appendChild( select );	
	divCrieria.appendChild( label2 );
	divCrieria.appendChild( select1 );
	divCrieria.appendChild( label3 );	
	divCrieria.appendChild( input );
	divCrieria.appendChild( space );
}
function getSearchResult() {
	var list = document.getElementById('LoginList');
	var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/directory/search?loginName="+callingLogin,
		       type : 'GET',
		       success: function (jsonResponse, textStatus, jqXHR) {
		       	document.getElementById("resultSearch").style.visibility = "visible";	
		       	document.getElementById("resultGetSearchResult").innerHTML = "returns " + jqXHR.status; 
		       	if (jqXHR.status === 200) {
					var resultCode = jsonResponse.resultCode;
					document.getElementById("resultCode").innerHTML = resultCode;
					var resultElts = jsonResponse.resultElements;
					if(	resultCode=="OK" && resultElts != undefined && resultElts.length >0)
					{
						var table =  $('#resultSearchTable');
						//table.innerHTML = "";
						 
						for(var i in resultElts)
						{
							var contacts=resultElts[i].contacts;
							if(	contacts != undefined && contacts.length >0)
							{
								for(var j in contacts)
								{
									$('<tr>').append(
									$('<td>').text(resultElts[i].directorySource),
									$('<td>').text(contacts[j].id.phoneNumber),
									$('<td>').text(contacts[j].firstName),
									$('<td>').text(contacts[j].lastName)
									).appendTo('#resultSearchTable');
									
								}
							}
							
						}
						applyTableCss();
					
					}
				}
		       },
		       error : function(jqXHR, statut){
		     			document.getElementById("resultGetSearchResult").innerHTML = "returns " + jqXHR.status; 
		     			
					 }
	});	

}
function getCriterion()
{
	var searchRequest;
	
	var listField = document.getElementById('shField');
	var field=listField.options[ listField.selectedIndex ].value;
	var listOperation = document.getElementById('shOperation');
	var operation=listOperation.options[ listOperation.selectedIndex ].value;
	var operand = document.getElementById('shOperand').value;
	var filter = {
		"field":field,
		"operation":operation,
		"operand": operand
	   };
	   
	if(criteriaNum >0)
	{
		var criterionTab=[];
		criterionTab.push(filter);
		for (var i = 1; i <= criteriaNum; i++) {
			var listFi = document.getElementById('shField'+i);
			var fi=listFi.options[ listFi.selectedIndex ].value;
			var listOp = document.getElementById('shOperation'+i);
			var op=listOp.options[ listOp.selectedIndex ].value;
			var opd = document.getElementById('shOperand'+i).value;
			
			var critElt= {
				"field": fi,
				"operation": op,
				"operand": opd
			};
			criterionTab.push(critElt);
		}
		var operation="AND";
		if(document.getElementById("and").style.visibility=="hidden")
			operation="OR";
			
		searchRequest = {
			"filter" : {
						"operation": operation,
						"operand": criterionTab
			}
		}
		
	}
	else
	{
		var listField = document.getElementById('shField');
		var field=listField.options[ listField.selectedIndex ].value;
		var listOperation = document.getElementById('shOperation');
		var operation=listOperation.options[ listOperation.selectedIndex ].value;
		var operand = document.getElementById('shOperand').value;
		searchRequest = {
		   "filter": filter
		}
	}
	return searchRequest;
}
function deleteCriterion()
{
	criteriaNum=0;
	var divCrieria = document.getElementById('divCrieria');
	divCrieria.innerHTML="";
	document.getElementById("and").style.visibility = "visible";
	document.getElementById("or").style.visibility = "visible";
}
function stopSearch() {
	var list = document.getElementById('LoginList');
	var callingLogin=list.options[ list.selectedIndex ].value;
	$.ajax({
		       url : serverUrl + "1.0/directory/search?loginName="+callingLogin,
		       type : 'DELETE',
		       success: function (jsonResponse, textStatus, jqXHR) {
		       	document.getElementById("resultStopSearch").innerHTML = "returns " + jqXHR.status; 
				deleteCriterion();
				if (jqXHR.status === 204) {
					document.getElementById("resultGetSearchResult").innerHTML ="";
					document.getElementById("resultStartSearch").innerHTML ="";		       	
					$('#searchResultButton').prop('disabled', true);
					$('#searchStopButton').prop('disabled', true);
					
				}
		       },
		       error : function(jqXHR, statut){
						deleteCriterion();
		     			document.getElementById("resultStopSearch").innerHTML = "returns " + jqXHR.status; 		     			
					 }
	});	

}
function applyTableCss()
{
	$('#resultSearchTable').css({ 'width':'600px'});	
	$('tr').css({ 'height':'30px','text-shadow': '0px 0px 0px black'});
	$('th').css({ 'height':'50px'});
	var arrayLignes = document.getElementById("resultSearchTable").rows;
	var longueur = arrayLignes.length;
	var i=0; 
	while(i<longueur)
	{
		if(i % 2 == 0)
		{
			arrayLignes[i].style.backgroundColor = "#bdcbf5";
		}
		else
		{
			arrayLignes[i].style.backgroundColor = "#829eeb";
		}
		i++;
	}
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
		document.getElementById("searchDiv").style.visibility = "hidden";
		document.getElementById("or").style.visibility = "hidden";
		document.getElementById("and").style.visibility = "hidden";
		document.getElementById("resultSearch").style.visibility = "hidden";	
		document.getElementById("resultStopSearch").innerHTML = "";
		document.getElementById("resultGetSearchResult").innerHTML = "";
		document.getElementById("resultStartSearch").innerHTML = "";
		var table = document.getElementById("resultSearchTable");
		var rowCount = table.rows.length;
		for (var i = 1; i < rowCount; i++) {
			table.deleteRow(1);
		}
		
		 
	}