const scriptName="koreanlab.js";

var roomMap ={
    "ytKoreanLab" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "enKoreanLab" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "vtKoreanLab" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "idKoreanLab" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "thKoreanLab" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "ptKoreanLab" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "tpRoom" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "vtRoom" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "ptRoom" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "idRoom" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "algoRoom" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    },
    "general" : {
        check : false,
        gameCheck : false,
        answer : "",
        rightPeople : new Queue()
    }
};

function checkRoom(replier, room){
    var type = roomType(room);
    var check = roomMap[type].check;
    var gameCheck = roomMap[type].gameCheck;

    if(room=="test"){
        replier.reply("check: " + check + ", gameCheck: ", + gameCheck);
    }
    if(!roomMap[type].check){
        return false;
    }else{
        return true;
    }
}

function roomType(room){
    if(room.includes("Korean") && room.includes("Lab")){
       if(room.includes("Subscribers")){
            return "ytKoreanLab";
       } else if(room.includes("English")){
            return "enKoreanLab";
        }else if(room.includes("Indonesia")){
            return "idKoreanLab";
        }else if(room.includes("Thailand")){
            return "thKoreanLab";
        }else if(room.includes("Malaysia")){
            return "mlKoreanLab";
        }else if(room.includes("Brazil")){
            return "ptKoreanLab";
        }else{
            return "general";
        }
    }else if(room.includes("Vietnam")){
        return "vtRoom";
    }else if(room.includes("Aprendendo")){
        return "ptRoom";
    }else if(room.includes("알고리즘")) {
        return "algoRoom";
    }else if(room.includes("인도네시아") || room.includes("nesia")){
        return "idRoom";
    }else if(room.toLowerCase().includes("topik")){
        return "tpRoom";
    }else {
        return "general";
    }
}

// 0: master, 1:manager, -1:blacklist
function authCheck(sender, priority){
    if( priority == -1 ){
        for each(var id in blacklist){
            if( id == sender ){
                return true;
            }
        }
        return false;
    }
    
    return true;
}

// koreanlab, algorithm, general
function roomCheck(room, purpose){
    var check;
    if( purpose == "koreanlab"){
        for each(var r in koreanlabs){
            if(r == room  || room.includes("Korean Lab")){
                return true;
            }
        }
    }else if( purpose == "algorithm"){
        for each(var r in algorithms){
            if(r == room
             || room.includes("알고리즘")
             || room.includes("coding")
             || room.includes("Coding")
             || room.includes("코딩")){
                return true;
            }
        }
    }else if( purpose == "general"){
        for each(var r in generals){
            if(r == room){
                return true;
            }
        }
    }
    return false;
}

// Respond
function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
   if(msg.indexOf('helloworld')==0){
       logM(sender, replier, roomType(room));
       logM(sender, replier, "check: "+roomMap[roomType(room)].check);
       logM(sender, replier, "gameCheck: "+roomMap[roomType(room)].gameCheck);
       roomMap[roomType(room)].check = false;
       roomMap[roomType(room)].gameCheck = false;
       return;
   }
   

   if(authCheck(sender, 0)){
       //replier.reply(roomMap[roomType(room)].gameCheck);
   }else if(checkRoom(replier, room)){
       return;
   }

   if(roomMap[roomType(room)].gameCheck
      && roomMap[roomType(room)].answer.toLowerCase().includes(msg.toLowerCase())){
      //replier.reply("answer: "+roomMap[roomType(room)].answer.toLowerCase() + " msg: "+msg.toLowerCase());
      replier.reply("맞았습니다!");
    
      return;
   }
 
   roomMap[roomType(room)].check = true;
   
   // 블랙리스트 체크
   if(authCheck(sender, -1)){
       if(msg.indexOf("세종대왕님, 죄송합니다.") == 0){
          removeBlackList(replier, sender);
       }else{
          replier.reply('무엄하도다! 어디서 감히!\n(You are not allowed. Say "세종대왕님, 죄송합니다.") ');
          addBlackList(replier, sender);
       }
       
       return;
   }

    var helpMessage = "(_ 는 공백)";

        // 방 체크
        if( msg.indexOf("/roomcheck")==0){
            replier.reply(room +" is "+roomCheck(room, "koreanlab"));
        }else if(roomCheck(room, "koreanlab")){
            helpMessage += "\n/사전_언어_키워드 \n(입력 가능 언어: en, vt, id, th, cn, jp, pt, fr, sp, gm, mg)\nㄷㅇ; 무작위 단어(random word)\nㄷㅇㄱ; 단어 거꾸로(reverse)\nㄷㅇ_number; 단어 갯수\n(일반 사용자 단어 제한: 5개)\n/time\n/tran_ko 안녕\n/tran_en_hello\n/tran_cn_过得怎么样？\n/tran_jp_こんにちは";
            if(authCheck(sender, 1)){
                 helpMessage += "\n### 매니저 이상 ###\n단어 반복 제한 없음\n단어 추가:ㄷㅇ_ㅊㄱ_언어//한국어//외국어\n단어 수정:ㄷㅇ ㅅㅈ 언어//FROM//TO\n(언어:en, pt, vt, id, th, cn, jp)";
            }
        }else if(roomCheck(room, "algorithm")){
            helpMessage = "\n/r 서비스 분류:랜덤 문제\n/백준 번호\n/code 소스코드";
            if(room == "국립 순천대 알고리즘 스터디 방(타대생, 취준생 환영)"){
                if(msg.indexOf("/소개")==0 &&  authCheck(sender, 1)){
                    replier.reply("안녕하세요? 순천대 알고리즘 자습방에 오신 걸 환영합니다. 비순대생분들도 계시며, 저희는 주로 백준 사이트(http://boj.kr)에서 문제를 풀고 있습니다. 백준에서 학교나 회사 인증을 하셔서 등록하시고 백준 내에 저희 그룹(http://www.acmicpc.net/group/1243)에서 같이 문제를 풀기도 하니 관심있으시면 그룹 신청을 해주세요. 마지막으로, 교내외 알고리즘 활동(동아리 활동, 오프 스터디 팀원 구하기, 대회 등) 관련 홍보는 자유롭게 하셔도 좋습니다.");
                    roomMap[roomType(room)].check = true;
                    return;
                }
            }
        }else if(roomCheck(room, "general")){
        }else{}

   if(msg.indexOf('/help')==0){
      var command = '### 사용가능한 명령어 ###\n'+helpMessage;
      command += '\n\n### 기본 ###\n/네이버_keyword\n/구글_keyword\n/유투브_keyword';
      replier.reply(command);
   }else if(msg.indexOf('/사전') == 0){
       var lang = msg.substring(4, 6);
       var keyword =  encodeURI(msg.substring(7, msg.length));
       var link;

       if( lang == "en"){
           link = "https://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=";
       }else if( lang == "vt" ){
           link = "https://dict.naver.com/vikodict/#/search?query=";
       }else if( lang == "id"){
           link = "https://dict.naver.com/idkodict/#/search?query=";
       }else if( lang == "cn"){
           link = "https://zh.dict.naver.com/#/search?query=";
       }else if( lang == "jp" ){
           link = "https://ja.dict.naver.com/search.nhn?query=";
       }else if( lang == "fr" ){
           link = "https://dict.naver.com/frkodict/#/search?query=";
       }else if( lang == "sp"){
           link = "https://dict.naver.com/eskodict/#/search?query=";
       }else if( lang == "gm"){
           link = "https://dict.naver.com/dekodict/#/search?query=";
       }else if( lang == "th"){
           link = "https://dict.naver.com/thkodict/#/search?query=";
       }else if( lang == "mg"){
           link = "https://dict.naver.com/mnkodict/#/search?query=";
       }else if( lang == "pt"){
           link = "https://dict.naver.com/ptkodict/#/search?query=";
       }else if( keyword == undefined || keyword == "" || keyword == " "){
           replier.reply("Usage)\n/사전_언어_키워드\n입력 가능 언어: en, vt, id, th, cn, jp, pt, fr, sp, gm, mg");
           roomMap[roomType(room)].check = false;
           return;
       }else{
           replier.reply("Usage)\n/사전_언어_키워드\n입력 가능 언어: en, vt, id, th, cn, jp, pt, fr, sp, gm, mg");
           roomMap[roomType(room)].check = false;
           return;
       }
       replier.reply(link+keyword);
   }else if(msg.indexOf('/네이버')==0){
       var keyword = encodeURI(msg.substring(5, msg.length));
       replier.reply('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query='+keyword);
   }else if(msg.indexOf('/구글')==0){
       var keyword = encodeURI(msg.substring(4, msg.length));
       replier.reply('https://www.google.co.kr/search?q='+keyword);
   }else if(msg.indexOf('/유투브')==0){
       var keyword = encodeURI(msg.substring(5, msg.length));
       replier.reply('https://www.youtube.com/results?search_query='+keyword);
   }else if (msg.trim() == "/날씨") {
      try { // 오류가 발생하지 않았을 때
         var link = Utils.getWebText ("http://www.weather.go.kr/weather/warning/status.jsp");
         var noti = link.split ("<dl class=\"special_report_list3\">")[1].split ("<li>")[1].split ("</li>")[0].replace(/(<br>|<br\/>|<br \/>)/g, '\r\n').replace(/(&lt;)/g, '<').replace(/(&gt;)/g, '>');
         var day = link.split ("<dl class=\"special_report_list3\">")[1].split (":")[1].split ("</dt>")[0].replace(/^ +/gm,"");

         replier.reply (day+"\n"+noti);
      } catch (e) {
      replier.reply ("발표된 기상정보가 없습니다.");
      }
}

   // Korean Lab
       if(msg.indexOf('/tran') == 0){
           var targetLanguage;
           var sourceLanguage;
           var content;
           var result;

           if(msg.indexOf('ko') == 6){
               sourceLanguage = 'ko';
               targetLanguage = 'en';
           }else{
               if(msg.indexOf('en') == 6){
                   sourceLanguage = 'en';
               }else if(msg.indexOf('cn') == 6 ){
                   sourceLanguage = 'zh-TW';
               }else if(msg.indexOf('th') == 6){
                   sourceLanguage = 'th';
               }else if(msg.indexOf('jp') == 6){
                   sourceLanguage = 'ja';
               }else if(msg.indexOf('id') == 6){
                   sourceLanguage = 'id';
               }else if(msg.indexOf('vn') == 6){
                   sourceLanguage = 'vi';
               }else if(msg.indexOf('es') == 6){
                   sourceLanguage = 'es';
               }
               targetLanguage = 'ko';
           }
           if((targetLanguage == 'en' || targetLanguage == 'ko')
                && (sourceLanguage == 'en'
                      || sourceLanguage == 'ko'
                      || sourceLanguage == 'zh-TW'
                      || sourceLanguage == 'ja'
                      || sourceLanguage == 'e'
                      || sourceLanguage == 't'
                      || sourceLanguage == 'i'
                      || sourceLanguage == 'v')){
               content = msg.substring(9, msg.length);
               result = Api.papagoTranslate(sourceLanguage,targetLanguage, content, true);
               replier.reply('결과: '+ result);
           }else{
               replier.reply('Usage)\n/tran ko 안녕\n/tran en hello\n/tran cn 过得怎么样？\n/tran jp こんにちは');
           }
       }else if(msg.indexOf('/time')==0){
          var d = new Date();
          var year = d.getFullYear()+'년 ';
          var month = d.getMonth()+1+'월 ';
          var date = d.getDate()+'일';
          var day = d.getDay();
          switch(day){
             case 0: day = '일요일 '; break;
             case 1: day = '월요일 '; break;
             case 2: day = '화요일 '; break;
             case 3: day = '수요일 '; break;
             case 4: day = '목요일 '; break;
             case 5: day = '금요일 '; break;
             case 6: day = '토요일 '; break;
          }
          var hour = d.getHours()+'시 ';
          var minute = d.getMinutes()+'분 ';
          var second = d.getSeconds()+'초';
 
          replier.reply('현재 한국 시간은 '
             + day + hour + minute + second
             + '['+year + month+ date +']입니다.');
       }else if(msg.indexOf('ㄷㅇ') == 0){
           var message = msg.split(" ");

           var auth = authCheck(sender, 1);
           var control = message[1];
           if(!isNaN(control) || control == undefined ){
               var repeat;
               repeat = control;

               if(control == undefined){
                   repeat = 1;
               }else if( repeat > 5 ){
                   if( !authCheck(sender, 4)){
                      repeat = 5;
                      replier.reply("일반 백성들은 5개가 최대 한도이니라...");
                   }
               }
               var order = msg.substring(2, 3);

               if(repeat > 1 ){
                   replier.reply("기특하구나! 그래, 우리 한 번 기초 단어 "+repeat+"개를 같이 외워보자꾸나.");
                   java.lang.Thread.sleep(1000*5);
               }
               for( var i = 0 ; i < repeat ; i++){
                   if( room.includes("Brazil") || room == 'Aprendendo coreano 2.0📚💗'){
                       getWord(room, replier, 'pt', order);
                   }else if( room.includes("Vietnam")){
                       getWord(room, replier, 'vt', order);
                   }else if( room.includes("인도네시아")){
                       getWord(room,replier, "id", order);
                   }else if( room.includes("Thai")){
                       getWord(room,replier, "th", order);
                   }else{
                       getWord(room, replier, 'en', order);
                   }
               }
              if(repeat > 1 ){
                   replier.reply("자, 단어 "+repeat + "개를 다 내었네. 어떤가? 이제 한국어 실력이 좀 는 것 같은가? 하하하.");
               }

           }else if(message[2] == undefined){
               replier.reply("단어 추가:ㄷㅇ ㅊㄱ 언어//한국어//외국어\n단어 수정:ㄷㅇ ㅅㅈ 언어//FROM//TO\n(언어:en, pt, vt, id, th)");
           }else if(control =="ㅅㅈ"){
               var realMessage = msg.substring(6, msg.length);
               var message = realMessage.split("//");
               if(auth == false){
                   replier.reply("미안한 말이지만, 자네를 아직 믿지 못 하겠소...\n(You have not granted yet.)");
                   return;
               }
               var target = message[0];
               var fromWhat = message[1];
               var toWhat = message[2];

               updateWord(replier, "change", target, fromWhat, toWhat);
           }else if(control == "ㅊㄱ"){
               if(auth == false){
                   replier.reply("어허! 무엇하는 게냐! 나는 그대를 아직 신뢰할 수가 없네!\n(You have not granted yet.)");
                   return;
               }
               var realMessage = msg.substring(6, msg.length);
               var message = realMessage.split("//");
                    
               var targetLanguage = message[0];             
               var front = message[1];
               var back = message[2];

               updateWord(replier, "add", targetLanguage, front, back, "ko");
           }
       }else if(msg.indexOf('ㅌㅍ') == 0){
           getProblem(replier);
       }




  // 순천대학교
  if(room == '🐯 정보처리기사 정보공유 / 공부방' ||
         room == '자바/코틀린 알고리즘 자습방' ||
         room == '순천대 알고리즘 스터디 방(타대생, 취준생 환영!)'){
      if(msg.indexOf('/백준 ') == 0){
         var arg = msg.substring(4, msg.length);

         if(isNaN(arg) == false){
            replier.reply('http://boj.kr/'+arg);
         }else{
            replier.reply("https://www.acmicpc.net/search#q="+encodeURI(arg)+"&c=Problems");
         }
         roomMap[roomType(room)].check = false;
      }else if(msg.indexOf("/r") == 0){
         var params = msg.split(" ")
         //replier.reply(params[1]+" "+params[2]);
         replier.reply(getAlgoProblem(params[1], params[2]));
         roomMap[roomType(room)].check = false;
      }else if(msg.indexOf("오늘의 문제입니다")==0 && authCheck(sender, 1)){
          replier.reply(getAlgoProblem("boj", "ss"));
          roomMap[roomType(room)].check = false;
      }else if(msg.indexOf('/code') == 0){
         var result;
         var code = msg.substring(6, msg.length);
         var koCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
         var enCheck = /[a-zA-Z0-9]/;
         if(!(code.includes(";")
             && enCheck.test(code)
             && code.includes("{") 
             && keywordCheck(code)
             && code.includes("}"))){
                 replier.reply("소스 코드만 공유해주세요.");
                 roomMap[roomType(room)].check = false;
                 return;
         }else if(koCheck.test(code)){
                 if(!(code.includes("'") || code.includes('"'))){
                     replier.reply("소스 코드만 공유해주세요.");
                     roomMap[roomType(room)].check = false;
                     return;
                 }
         }
         var lines = code. split("\n");
         var lastNumLength = lines.length.toString().length;
   
         var q = new Queue();
         var lineLength;
        
         for each(var e in lines){
             var firstPart;
             var lastPart;
             
             //replier.reply(e);
             if(e.length > 40){
                 firstPart = e.substring(0, 48);
                 lastPart = e.substring(48, e.length);
                 q.enqueue(firstPart);
                 q.enqueue(lastPart);
             }else{
                 q.enqueue(e);
             }
             lineLength = q.getLength();
         }
              var newCode = "";

         var lineNum = 1;
         while(!q.isEmpty()){
             var space = "";
             var line = q.dequeue();
             //replier.reply(line);
             for(var j = 1; j <= (lastNumLength)-(lineNum.toString().length) ; j++){
                space += "  ";
             }
             //replier.reply(i+ " "+(lastNumLength)+" "+(lineNum.toString().length));
             if( lineNum == 1){
                 newCode += space+ (lineNum)+'│'+line;
             }else if( lineNum == 21){
                 newCode += "\n    └────── 최대한도: 20줄 ──────  ";
             }else{
                 newCode += '\n'+space+ (lineNum)+'│'+line;
             }
             lineNum++;
             roomMap[roomType(room)].check = false;
         }
         replier.reply(newCode);
         roomMap[roomType(room)].check = false;
      }
   }
    roomMap[roomType(room)].check = false;
    /*(이 내용은 길잡이일 뿐이니 지우셔도 무방합니다)
     *(String) room: 메시지를 받은 방 이름
     *(String) msg: 메시지 내용
     *(String) sender: 전송자 닉네임
     *(boolean) isGroupChat: 단체/오픈채팅 여부
     *replier: 응답용 객체. replier.reply("메시지") 또는 replier.reply("방이름","메시지")로 전송
     *(String) ImageDB.getProfileImage(): 전송자의 프로필 이미지를 Base64로 인코딩하여 반환
     *(String) packageName: 메시지를 받은 메신저의 패키지 이름. (카카오톡: com.kakao.talk, 페메: com.facebook.orca, 라인: jp.naver.line.android
     *(int) threadId: 현재 쓰레드의 순번(스크립트별로 따로 매김)     *Api,Utils객체에 대해서는 설정의 도움말 참조*/
}

function getWord(room, replier, targetLanguage, order){
 /*   var client = new org.apache.http.impl.client.DefaultHttpClient();

    var httpget = new org.apache.http.client.methods.HttpGet("http://YOUR_URL?type=word");
    
    var response = client.execute(httpget);
    var entity = response.getEntity();
    var result = new org.apache.http.util.EntityUtils.toString(response.getEntity());
    var content = entity.getContent();
     for each(var e in content) {
        replier.reply(e);
    }
*/
    //replier.reply(JSON.stringify(entity.get));

    if(roomMap[roomType(room)].gameCheck){
        return;
    }else{
        roomMap[roomType(room)].gameCheck = true;
        const conn=(new java.net.URL("http://YOUR_URL?type=word&targetLanguage="+targetLanguage)).openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("accept", "application/json");
        conn.setRequestProperty("accept-language","ko,en-US;q=0.9,en;q=0.8,zh;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5");
        conn.setRequestProperty("content-type","application/x-www-form-urlencoded");
        conn.setRequestProperty("upgrade-insecure-requests","1");
        conn.setRequestProperty("user-agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
   
        const br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
        var tmp = null;
        var str=''
        while ((tmp = br.readLine()) != null) {
            str+=tmp;
        }
       var result = JSON.parse(str);
       if( order == "ㄱ" ){
           var givenTime = (result.front.length*2.5)+2;
           if(result.front.includes(",") || result.front.includes("/")){
               givenTime = givenTime/2;
           }
           if(givenTime > 10){
               givenTime = 10;
           }
           replier.reply("📣문제: "+result.back+"\n(주어진 시간: "+givenTime +"초)");
           roomMap[roomType(room)].answer = result.front;
           java.lang.Thread.sleep(1000*givenTime);
           replier.reply("정답: "+result.front);
       }else{
           var givenTime = result.back.length+2;
           if(result.back.includes(",") || result.back.includes("/") ){
               givenTime = givenTime/2;
           }
           if(givenTime > 10){
               givenTime = 10;
           }

           replier.reply("📣문제: "+result.front+"\n(주어진 시간: "+givenTime +"초)");
           roomMap[roomType(room)].answer=result.back;
           java.lang.Thread.sleep(1000*givenTime);
           replier.reply("정답: "+result.back);
        }
        roomMap[roomType(room)].gameCheck = false;
    }
}

function updateWord(replier, control, targetLanguage, param1, param2, param3){
    var conn;
    if(control == "add"){
        conn = (new java.net.URL(encodeURI("http://YOUR_URL?type=word&control="+control+"&targetLanguage="+targetLanguage+"&front="+param1+"&back="+param2+"&sourceLanguage="+param3))).openConnection();
    }else if( control == "change"){
        conn = (new java.net.URL(encodeURI("http://YOUR_URL?type=word&control="+control+"&targetLanguage="+targetLanguage+"&fromWhat="+param1+"&toWhat="+param2))).openConnection();
    }else{return;}

    conn.setRequestMethod("GET");
    conn.setRequestProperty("accept", "application/json");
    conn.setRequestProperty("accept-language","ko,en-US;q=0.9,en;q=0.8,zh;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5");
    conn.setRequestProperty("content-type","application/x-www-form-urlencoded");
    conn.setRequestProperty("upgrade-insecure-requests","1");
    conn.setRequestProperty("user-agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
   
    const br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
    var tmp = null;
    var str=''
    while ((tmp = br.readLine()) != null) {
      str+=tmp;
    }
    var output = str.split(" ");
    var result = output[0];
    if(result == 0 ){
        replier.reply("무언가 이상하네. 자네 제대로 적은 거 맞는가?\n(result: "+output[0]+")");
    }else if(control=="add"){
        replier.reply("아따마~솰아 있네!\n(result: "+output[0]+")");
    }else if(control=="change"){
        replier.reply("고것이 고것이 아니었고만! 고맙네!!\n(result: "+output[0]+")");
    }
}

function getProblem(replier){
   replier.reply('문제 없음');
}



// 알고리즘...
function getAlgoProblem(service, type){
    var services = ["boj"];
    var types = ["ss", "dp1", "gr", "bfs", "dfs", "bt", "dq"];

    var serviceCheck = false;
    var typeCheck = false;
    if(service == undefined && type == undefined ){
        return "잘못 입력하셨습니다";
    }else{
        for each(var s in services){
            if( s == service ){
                serviceCheck = true;
                break;
            }
        }
        if(serviceCheck == false){
            return "[boj] 가능"
        }else{
            for each(var t in types){
                if( t == type){
                    typeCheck = true;
                    break;
                }
            }
            if( typeCheck == false ){
                return "[gr(그리디), bt, dq, dp1, dfs, bfs, ss(삼성기출)] 가능"
            }
        }
    }

    const conn=(new java.net.URL(encodeURI("http://YOUR_URL?service="+service+"&type="+type))).openConnection();
    conn.setRequestMethod("GET");
    conn.setRequestProperty("accept", "application/json");
    conn.setRequestProperty("accept-language","ko,en-US;q=0.9,en;q=0.8,zh;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5");
    conn.setRequestProperty("content-type","application/x-www-form-urlencoded");
    conn.setRequestProperty("upgrade-insecure-requests","1");
    conn.setRequestProperty("user-agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
   
    const br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
    var tmp = null;
    var str=''
    while ((tmp = br.readLine()) != null) {
       str+=tmp;
     }
     var result = JSON.parse(str)[0];
     
     if(result.url != undefined){
         return result.url;
     }else{
         return "실패";
     }
}

function keywordCheck(code){
    var keywords = ["int ", "long ", "short", "String", "string", "for", "i", "var ", "const "
        , "double", "Integer", "function", "Double", "public ", "if", "case"
        , "new", "else",  "BufferedReader", "BufferedWriter", 
        , "StringTokenizer", "Scanner", "print", "out", "BigInteger"];
    var operators = [ "+", "-", "*", "/", "=", "<", ">"];

    var result = false;
    for each( var k in keywords){
        if(code.includes(k)){
             result = true;
        }
    }
    if(result == false) return false;

    for each( var o in operators){
        if(code.includes(o)){
             return true;
        }
    }

    return false;
}

function addBlackList(replier, sender){
    //replier.reply("준비중...");
}

function removeBlackList(replier, sender){
    replier.reply("쯧쯧쯧...");
}

function onStartCompile(){
    /*컴파일 또는 Api.reload호출시, 컴파일 되기 이전에 호출되는 함수입니다.
     *제안하는 용도: 리로드시 자동 백업*/
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
    var layout = new android.widget.LinearLayout(activity);
    var typeTV = new android.widget.TextView(activity);
    var koreanTV = new android.widget.TextView(activity);
    var languageTV = new android.widget.TextView(activity);
    var typeET = new android.widget.EditText(activity);
    var koreanET = new android.widget.EditText(activity);
    var languageET = new android.widget.EditText(activity);

    layout.setOrientation(android.widget.LinearLayout.VERTICAL);
    typeTV.setText("Type");
    koreanTV.setText("Korean");
    languageTV.setText("TargetLanguage");

    layout.addView(typeTV);
    layout.addView(typeET);
    layout.addView(koreanTV);
    layout.addView(koreanET);
    layout.addView(languageTV);
    layout.addView(languageET);

    Log.error("토스트 메시지", true);

    activity.setContentView(layout);
}
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {};

function Queue(){
    var a = [], b = 0;

    this.getLength = function(){
        return a.length-b;
    };

    this.isEmpty = function(){
        return a.length == 0;
    };
    this.enqueue = function(b){
        a.push(b);
        return b;
    };
    this.dequeue = function(){
        if(0!=a.length){
            var c = a[b];
            2*++b>=a.length&&(a=a.slice(b), b=0);
            return c;
        }
    };
    this.peek = function(){
        return 0 < a.length?a[b]:void 0
    }
}

function logM(sender, replier, message){
    if(authCheck(sender, 0)){
        replier.reply(message);
    } 
    return;
}
