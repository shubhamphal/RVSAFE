function weather(){
    var url="https://fcm.googleapis.com/fcm/send";

    var text= document.getElementById("alert").value;
    var title = document.getElementById('title').value;
    var xhr = new XMLHttpRequest();
        var body = {
        "notification": {
        "title": title,
        "text": text
            
        },
      "data":{
        "title":"test3",
        "image":"https://firebase.google.com/images/social.png",
        "message":"test4"
      },
      "to":"/topics/hackathon"
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState===XMLHttpRequest.DONE){
            if(xhr.status===200)
            {
                alert('Alerted Successfully');
            }
            else{
                alert('Network Error');
            }
    }


};
xhr.open("POST",url,true);
xhr.setRequestHeader('Content-Type','application/json');
xhr.setRequestHeader('Authorization','key=AAAApQIylJc:APA91bFcH4bK740PrhMQqXqgfZ9MTJ-u6GQPISVwkbDBFR4f5qWwKigM0xtzdC6pwugJxUYlXIZyhPLp5MaOrYSMfontnwVjeI-EuVFCE-givzLCxEk7nox_e7cz_0jCLc4k8L0Lh5Kq')

xhr.send(JSON.stringify(body));
};