function myResources(){
	var loader1 = document.getElementById("loader");
	loader1.style.display="block"; 
	var ob = document.getElementById("land").style.display="none";
	var ob1 = document.getElementById("camps").style.display="none";
	var ob1 = document.getElementById("messages").style.display="none";
	var ob1 = document.getElementById("thread").style.display="none";
	var ob1 = document.getElementById("main").innerHTML="My Inventory";
	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/ngo/myresources"));
	console.log("this is the author name: "+json_obj.data);
	var temp = json_obj.data;
	console.log(temp);
	labels= new Array();
	values = new Array();
	var i;
	for (i in temp) {
		labels.push(i);
		values.push(Number(temp[i]))
		console.log(i);
		console.log(Number(temp[i]));	
	}
	for(i in labels){
		console.log(i)
	}
	
	console.log(labels);
	console.log(values);
	var ob1 = document.getElementById("camps").style.display="block";
	plot(labels,values);
	loader1.style.display="none";
	return;
}

function updateResources(){
	var e = document.getElementById("dropdown");
	var type = e.options[e.selectedIndex].text;
	var name = document.getElementById("name").value;
	var qty =  document.getElementById("qty").value;
	//json_={"name":name,"qty":qty,"type":option}
	var request=new XMLHttpRequest();

	request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200)
            {
                alert('Updated Successfully');
            }
            else{
                alert('Network Error');
            }
            
    }
    };
    request.open("POST",'https://rvngo.azurewebsites.net/ngo/myresources/update',true);
    request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({name:name,qty:qty,type:type}));

	// console.log(json_obj.status)

}



function deleteResources(){
	var e = document.getElementById("dropdown1");
	var type = e.options[e.selectedIndex].text;
	var name = document.getElementById("name1").value;
	var qty =  document.getElementById("qty1").value;
	console.log(JSON.stringify({name:name,qty:qty,type:type}));
	//json_={"name":name,"qty":qty,"type":option}
	var request=new XMLHttpRequest();

	request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200)
            {
                alert('Removed Successfully');
            }
            else{
                alert('Network Error');
            }
            
    }
    };
    request.open("POST",'https://rvngo.azurewebsites.net/ngo/myresources/delete',true);
    request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({name:name,qty:qty,type:type}));

	// console.log(json_obj.status)

}












function plot(labels,values){
	var ctx = document.getElementById('myres').getContext('2d');
	var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
	   label:'My Resources',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: values,
        }]
    },

    // Configuration options go here
    options: {
    }
});


}


function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}



window.onload = function()
{
	var ob1 = document.getElementById("main").innerHTML="My Requests";
	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/ngo/resources"));
	
	console.log("this is the author name: "+json_obj.data);
	var doms = this.document.getElementById("replace").innerHTML = json_obj.data
	$("#land").show();
	$("#loader").hide();
}

function dashhome(){
	var ob1 = document.getElementById("main").innerHTML="My Requests";
	var ob = document.getElementById("land").style.display="block";
	var ob1 = document.getElementById("camps").style.display="none";
	var ob1 = document.getElementById("messages").style.display="none";
	var ob1 = document.getElementById("thread").style.display="none";
}


function dashmessages(){
	var loader1 = document.getElementById("loader");
	loader1.style.display="block";
	var ob1 = document.getElementById("main").innerHTML="My Messages";
	var ob = document.getElementById("land").style.display="none";
	var ob1 = document.getElementById("camps").style.display="none";
	
	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/message/pipeline/gettopic"));
	
	
	var doms = document.getElementById("message-replacer").innerHTML = json_obj.data
	// console.log(json_obj.data);
	var ob1 = document.getElementById("messages").style.display="block";

	var ob1 = document.getElementById("thread").style.display="none";


	loader1.style.display="none";


}



function reply(){
	var ob1 = document.getElementById("main").innerHTML="My Messages";
	var text=document.getElementById("reply").value;
	var js1={"message":text.toString(),"user":"Ngo1"};
	var mid=document.getElementById("indices").innerHTML;
	document.getElementById("reply").value="";

	console.log(mid);
	var request=new XMLHttpRequest();

	request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200)
            {
                alert('Updated Successfully');
            }
            else{
                alert('Network Error');
            }
            
    }
    };
    request.open("POST",'https://rvngo.azurewebsites.net/messages/pipeline/'+mid+'/updatethread',true);
    request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify(js1));


}





function showthread(ele){
	console.log(ele);
	var loader1 = document.getElementById("loader");
	loader1.style.display="block";

	var ob = document.getElementById("land").style.display="none";
	var ob1 = document.getElementById("camps").style.display="none";
	var ob1 = document.getElementById("messages").style.display="none";
	var ob1 = document.getElementById("main").innerHTML="My Messages";
	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/messages/pipeline/getthread/"+ele.toString()));
	
	
	var doms = document.getElementById("threadinfo").innerHTML = json_obj.data
	var doms = document.getElementById("topicname").innerHTML = json_obj.topic
	var doms = document.getElementById("indices").innerHTML = json_obj.mid


	var ob1 = document.getElementById("thread").style.display="block";
	loader1.style.display="none";
}

function goback(){
	var ob = document.getElementById("land").style.display="none";
	var ob1 = document.getElementById("camps").style.display="none";
	var ob1 = document.getElementById("messages").style.display="block";
	var ob1 = document.getElementById("thread").style.display="none";
}


(function(document) {
	'use strict';

	var LightTableFilter = (function(Arr) {

		var _input;

		function _onInputEvent(e) {
			_input = e.target;
			var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
			Arr.forEach.call(tables, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, _filter);
				});
			});
		}

		function _filter(row) {
			var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}

		return {
			init: function() {
				var inputs = document.getElementsByClassName('light-table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = _onInputEvent;
				});
			}
		};
	})(Array.prototype);

	document.addEventListener('readystatechange', function() {
		if (document.readyState === 'complete') {
			LightTableFilter.init();
		}
	});

})(document);
