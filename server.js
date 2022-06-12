const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true})); 
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://namvandy:qwer1234@cluster0.dybrzzr.mongodb.net/?retryWrites=true&w=majority',function(에러, client){
    // 연결되면 할 일
    if (에러) return console.log(에러)    

    db=client.db('codeapple_todoapp');

    // db.collection('post').insertOne({이름: 'John', 나이 : 20, _id: 100}, function(에러, 결과){
    //     console.log('저장완료');
    // });

    app.listen(8080, function(){
        console.log('listening on 8080');
    });
})

// 누군가가 /pet으로 방문 하면 안내문 띄우기
app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function(req, res){
    res.send('뷰티용품 쇼핑 페이지임');
});

app.get('/', function(req,res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/write', function(req, res){
    res.sendfile(__dirname + '/write.html');
});

app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    console.log(요청.body.title);
    console.log(요청.body.date);
    // db.collection('post').insertOne( {제목:요청.body.title, 날짜: 요청.body.date}, function(){
    //     console.log('저장완료');
    // });    
});

app.get('/list', function(req, res){
    //DB에 저장된 post라는 collection안의 모든 데이터를 꺼내 주세요
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        res.render('list.ejs',{ posts : 결과 });
    });    
    // ejs 파일 사용 시에는 views라는 폴더 안에 존재하게 해야함. 규칙.
    
});