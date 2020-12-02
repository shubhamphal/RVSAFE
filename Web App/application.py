from flask import *
import pymongo
import requests
from bson import ObjectId
from datetime import datetime
from ast import literal_eval
import random
import cognitive_face as cf
from azure.storage.blob import BlockBlobService, PublicAccess

app = Flask(__name__,template_folder=".")

uri = "mongodb://yatishhr:skv5d9yiRMuHeS0ft5aYipjLAErgy0KEg5iacaWTWUW5JwdskJAlXVYZagWJfWD46ZILskdyxDWhtH2YXl7YdA==@yatishhr.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
client = pymongo.MongoClient(uri)
db = client.Azure

@app.route("/",methods=["GET"])
@app.route("/home",methods=["GET"])
def login():
    return render_template('index.html')

@app.route("/dashboard",methods=["GET"])
def dashboard():
    return render_template('dashboard.html')

@app.route("/weather/dashboard",methods=["GET"])
def renderdash():
    return render_template('dashboard_weather.html')

@app.route("/relief/home",methods=["GET"])
def renderrelief():
    return render_template('relief.html')

@app.route('/ngo/resources',methods=['GET'])
def resources():
    # import pdb; pdb.set_trace()
    donate = db.resources
    res=""
    donated = donate.find()
    for cur in donated:
        res+="<tr>"

        res+="<td>"+str(cur["Name"])+"</td>"
        res+="<td>"+str(cur["phone_number"])+"</td>"
        res+="<td>"+str(cur["Address"])+"</td>"
        res+="<td>"+str(cur["City"])+"</td>"
        temps=""
        try:
            l=list(literal_eval(cur["items"]))
        except:
            l=list(cur["items"])
        try:
            for i in l:
                temps=temps+","+i
        except:
            pass
        res+="<td>"+str(temps[1:])+"</td>"
        res+="</tr>"

    return json.dumps({"status":200,"data":res})

@app.route('/ngo/myresources',methods=["GET"])
def get_db():
    ref = db.ngo_data
    curr = ref.find_one({"_id":ObjectId("5c3349625c19950d9b9c2de3")})
    res={}
    res["data"] = literal_eval(curr["myresources"])
    return json.dumps(res)

@app.route('/ngo/myresources/update', methods=["POST"])
def updateones():
    ref = db.ngo_data
    req = request.get_json()
    curr = ref.find_one({"_id":ObjectId("5c3349625c19950d9b9c2de3")})
    temp={}
    keys = req["name"]+'('+req["type"]+')'
    temp[keys] = req["qty"]
    if keys not in curr["myresources"]:
        curr["myresources"][keys] = req["qty"]
    else:
        temp = int(curr["myresources"][keys])
        curr["myresources"][keys] = str(temp+int(req["qty"]))
    ref.update_one({"_id":"0"},{"$set":curr},upsert=False)
    return json.dumps({"status":"200"})

@app.route('/ngo/myresources/delete', methods=["POST"])
def deleteones():
    ref = db.ngo_data
    req = request.get_json()
    curr = ref.find_one({"_id":ObjectId("5c3349625c19950d9b9c2de3")})
    temp={}
    keys = req["name"]+'('+req["type"]+')'
    temp[keys] = req["qty"]
    if keys not in curr["myresources"]:
        curr["myresources"][keys] = "0"
    else:
        curr["myresources"][keys] = str(int(curr["myresources"][keys]) - int(req["qty"]))
        if int(curr["myresources"][keys]) <0:
            # curr["myresources"][keys] = "0"
            del curr["myresources"][keys]
    ref.update_one({"_id":"0"},{"$set":curr},upsert=False)
    return json.dumps({"status":"200"})

@app.route('/relief/<disaster_id>/getassets',methods=["GET"])
def getassets(disaster_id):
    ref = db.Victim
    cursor = ref.find_one({"user_id":"0","Disasterid":disaster_id})
    res={}
    res["src"] = cursor["facial"]
    try:
        temp=literal_eval(cursor["victims"])
    except:
        temp=cursor["victims"]
    res["males"]=temp["males"]
    res["children"]=temp["children"]
    res["elders"]=temp["elders"]
    res["female"]=temp["female"]
    res["status"] = 200
    return json.dumps(res)

@app.route('/message/pipeline/gettopic',methods=["GET"])
def get_topics():
    d=db.ngo_data.find_one({'intent':'message_passing'})
    d=d['body']
    k=1
    res=""
    # '''
    # <tr class="unread" onclick="showthread()">
    #                 <td class="inbox-small-cells">
    #                 </td>
    #                 <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
    #                 <td class="view-message  dont-show">PHPClass</td>
    #                 <td class="view-message ">Added a new class: Login Class Fast Site</td>
    #                 <td class="view-message  inbox-small-cells"><i class="fa fa-paperclip"></i></td>
    #                 <td class="view-message  text-right">9:27 AM</td>
    #               </tr>
    # '''
    for i in d:
        res=res+"<tr class='unread' onclick='showthread("+str(i["mid"])+")'>"
        res=res+"<td class='inbox-small-cells' style='width:10px;'> </td> <td class='inbox-small-cells' style='width:10px;'><i class='fa fa-star'></i></td>"
        res=res+"<td class='view-message  dont-show'>"+i["reliefcampname"]+"</td>"
        res=res+"<td class='view-message'>"+i["topic_name"]+"</td>"
        res=res+"<td class='view-message  inbox-small-cells'><i class='fa fa-paperclip'></i></td>"
        res = res+"<td class='view-message  text-right'>"+str(i["timestamp"])+"</td> </tr>"

    return json.dumps({"status":200,"data":res})

@app.route('/messages/pipeline/createtopic',methods=["POST"])
def create_topic():
    js=request.get_json()
    topic=js["topic"]
    relif=js["relief"]
    message=js["message"]
    d=db.ngo_data.find_one({'intent':'message_passing'})
    temp={"topic_name":topic,"timestamp":datetime.now().strftime("%d %b"),"reliefcampname":relif,"mid":str(len(d["body"])+1),"status":"true","threads":[relif+':'+message]}
    d["body"].append(temp)
    db.ngo_data.update_one({"intent":"message_passing","_id":ObjectId("5c34292d1b4ebb4818cc6a7c")},{"$set":d},upsert=False)
    return json.dumps({"status":200})

@app.route('/messages/pipeline/getthread/<mid>')
def get_thread(mid):
    d=db.ngo_data.find_one({'intent':'message_passing'})
    # import pdb; pdb.set_trace()
    mid=int(mid)
    t=d['body'][mid-1]["threads"]
    ''' message split '''
    res="<br><hr>"
    cols=["#555af3","#59e955","#f6ea32","#f63232","f529df"]
    class1="bubble me"
    class2="bubble you"
    cols=random.sample(cols,2)
    col1=cols[0]
    col2=cols[1]
    f1=False
    f2=False
    '''
    <hr>
          <p><strong style="color:#f4511e"> User1:</strong> need so many stuffs!!</p>
    
    '''
    dicts={}
    for i in t:
        l=i.split(':')
        u=l[0]
        m=l[1]
        try:
            col,class_ = dicts[u]
            res=res+ "<div class='"+class_+"'><p><strong style='color:"+col+"'>"+u+":</strong> "+m+"</p></div><br><br><br>"
        except:
            if not f1:
                res=res+ "<div class='"+class1+"'><p><strong style='color:"+col1+"'>"+u+":</strong> "+m+"</p></div><br><br><br>"
               
                dicts[u]=(col1,class1)
                f1=True 
                continue
            if not f2:
                res=res+ "<div class='"+class2+"'><p><strong style='color:"+col2+"'>"+u+":</strong> "+m+"</p></div><br><br><br>"

                dicts[u]=(col2,class2)
                f2=True
                f1=False 

    return json.dumps({"status":200,"data":res,"topic":d["body"][mid-1]["topic_name"],"mid":mid})

@app.route('/messages/pipeline/<mid>/updatethread',methods=["POST"])
def update_thread(mid):
    js=request.get_json()
    mid=int(mid)
    d=db.ngo_data.find_one({'intent':'message_passing'})
    t=d['body'][mid-1]
    u=js["user"]
    m=js["message"]
    t["threads"].append(u+':'+m)
    d['body'][mid-1]=t
    db.ngo_data.update_one({"intent":"message_passing","_id":ObjectId("5c34292d1b4ebb4818cc6a7c")},{"$set":d},upsert=False)

    return json.dumps({"status":200})



@app.route('/messages/pipeline/update/status')
def update_status():
    js=request.get_json()

    return json.dumps({"status":200})

@app.route('/update/rescued/cognitive',methods=['POST'])
def update_rescued():
    data=request.data
    #PERSON_GROUP_ID="victims"
    d=db.ngo_data.find_one({'type':'safe'})
    #headers={"Content-Type":"application/octet-stream"}
    #headers["Ocp-Apim-Subscription-Key"]="501f22c3797048d2a73ae58a83ea9069"
    #BASE_URL="https://australiaeast.api.cognitive.microsoft.com/face/v1.0/"
    #cf.BaseUrl.set(BASE_URL)
    #cf.Key.set("501f22c3797048d2a73ae58a83ea9069")
    #binurl="https://australiaeast.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false"
    #res=requests.post(url=binurl,headers=headers,data=data)
    #js=json.loads(res.text)
    #face_ids = [d['faceId'] for d in js]
    #identified_faces = cf.face.identify(face_ids, PERSON_GROUP_ID)
    #person_list=cf.person.lists(PERSON_GROUP_ID)
    uid=len(d['rescued_urls'])+1
    # cursor["facial"] = "https://rvsafeimages.blob.core.windows.net/imagescontainer/"+uid+'.'+format_
    # ref.update_one({"user_id":user_id,"Disasterid":str(cursor["Disasterid"])},{"$set":cursor},upsert=False)
    
    block_blob_service = BlockBlobService(account_name='rvsafeimages', account_key='391TMmlvDdRWu+AsNX+ZMl1i233YQfP5dxo/xhMrPm22KtwWwwMmM9vFAJpJHrGXyBrTW4OoAInjHnby9Couug==')
    container_name ='imagescontainer'
    block_blob_service.create_blob_from_bytes(container_name,'safevictims'+str(uid)+"."+'jpg',data)
    #save to blob
    urls="https://rvsafeimages.blob.core.windows.net/imagescontainer/safevictims"+str(uid)+'.'+'jpg'
    rescued=[]
    try:
        d['rescued_urls'].append(urls)
    except:
        d['rescued_urls']=[urls]
    # for k in identified_faces:
    #     i=k['candidates']
    #     if len(i)==0:
    #         continue
    #     for t in i:
    #         if 'personId' in t:
    #             for j in person_list:
    #                 if j['personId']==t['personId']:
    #                     rescued.append([j['name'],urls])
    # rescued=rescued+d['rescued']
    # d['rescued']=rescued
    db.ngo_data.update_one({"type":"safe","_id":ObjectId("5c3b5389d59b290b704c4012")},{"$set":d},upsert=False)
    return json.dumps({'status':200})

@app.route('/group/images')
def get_group_images():
    d=db.ngo_data.find_one({'type':'safe'})
    urls=d['rescued_urls']
    return json.dumps({"status":200,"urls":urls})