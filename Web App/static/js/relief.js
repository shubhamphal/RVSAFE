function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function faceanalytics(){
	document.getElementsByClassName('sidenav')[0].style.display="block";

    document.getElementById('forms').style.display="none";
    document.getElementById('faces').style.display="";
    document.getElementById('messages').style.display="none";
	document.getElementById('thread').style.display="none";
	document.getElementById('image_upload').style.display="none";

}


function relief(){
	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/group/images"));
	res=""
	document.getElementsByClassName('sidenav')[0].style.display="none";
	static1="<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4' > <div class='card' style='width:85%'> <img class='card-img-top' src='"
	
	static2="'alt='Card image' style='height:40vh'> <div class='card-body'> </div> </div> </div> "
	/*
	<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" >
              <div class="card" style="width:85%">
                <img class="card-img-top" src="{{ url_for('static',filename='images/default1.jpeg') }}" alt="Card image" style="height:40vh">
                <div class="card-body">
                  
                </div>
              </div>
            </div>
*/
	arr=json_obj['urls']
	for( var j=0;j<arr.length;j++){
		res=res+static1+arr[j]+static2

	}
	document.getElementById("reliefgroups").innerHTML=res;
}



function alertnew(){
	document.getElementsByClassName('sidenav')[0].style.display="block";

    document.getElementById('forms').style.display="block";
    document.getElementById('faces').style.display="none";
    document.getElementById('messages').style.display="none";
    document.getElementById('thread').style.display="none";
	document.getElementById('image_upload').style.display="none";

}


function submit_thread(){

	topic=document.getElementById('fname').value;
    relief=document.getElementById('lname').value;
	message=document.getElementById('subject').value;
	js1={"topic":topic,"relief":relief,"message":message}
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
    request.open("POST",'https://rvngo.azurewebsites.net/messages/pipeline/createtopic',true);
    request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify(js1));



}


function dashmessages(){
	document.getElementsByClassName('sidenav')[0].style.display="block";

	var ob = document.getElementById("faces").style.display="none";
	var ob1 = document.getElementById("forms").style.display="none";
	document.getElementById('image_upload').style.display="none";
	var loader1 = document.getElementById("loader");
	loader1.style.display="block"; 
	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/message/pipeline/gettopic"));
	
	
	var doms = document.getElementById("message-replacer").innerHTML = json_obj.data
	// console.log(json_obj.data);
	var ob1 = document.getElementById("messages").style.display="block";
	loader1.style.display="none"; 
	var ob1 = document.getElementById("thread").style.display="none";
}

function reply(){

	var text=document.getElementById("reply").value;
	var js1={"message":text.toString(),"user":"Relief1"};
	var mid=document.getElementById("indices").innerHTML;
	document.getElementById("reply").value="";
	document.getElementById('image_upload').style.display="none";

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
	document.getElementsByClassName('sidenav')[0].style.display="block";

	var ob = document.getElementById("faces").style.display="none";
	var ob1 = document.getElementById("forms").style.display="none";
	var ob1 = document.getElementById("messages").style.display="none";


	var json_obj = JSON.parse(Get("https://rvngo.azurewebsites.net/messages/pipeline/getthread/"+ele.toString()));
	
	
	var doms = document.getElementById("threadinfo").innerHTML = json_obj.data
	var doms = document.getElementById("topicname").innerHTML = json_obj.topic
	var doms = document.getElementById("indices").innerHTML = json_obj.mid

	document.getElementById('image_upload').style.display="none";

	var ob1 = document.getElementById("thread").style.display="block";
}

function goback(){
	var ob1 = document.getElementById("messages").style.display="block";
	var ob1 = document.getElementById("thread").style.display="none";
}

function upload(){
	relief()
	document.getElementById('forms').style.display="none";
    document.getElementById('faces').style.display="none";
    document.getElementById('messages').style.display="none";
	document.getElementById('thread').style.display="none";
	document.getElementById('image_upload').style.display="block";
	
}

function upload_asynch(){

	var imgfile=($("#image"))[0].files[0];
	
	var type=imgfile["type"];
	var type = type.split('/')
	var newtype = type[1]
	var fr=new FileReader();
	var posurl = "https://rvngo.azurewebsites.net/update/rescued/cognitive"
	console.log(posurl);
	console.log(imgfile);

	var loader1 = document.getElementById("loader");
	loader1.style.display="block"; 
	 fr.onload=function()
	{
		byteresult=fr.result;
		// console.log(length(byteresult));
		var request1=new XMLHttpRequest();
		request1.onreadystatechange=function(){
				if(request1.readyState===XMLHttpRequest.DONE){
					if(request1.status===200)
					{
						alert('Upload Success');
					}
					else{
						alert('Upload Fail');
					}
					
			}
			};
			request1.open("POST",posurl,true);
			request1.setRequestHeader('Content-Type','application/octet-stream');
		request1.send(byteresult);
		$("#image").val('');

		
	};

	loader1.style.display="none"; 
fr.readAsArrayBuffer(imgfile);

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
