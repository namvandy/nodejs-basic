// var로 만든 변수 = 재선언 O, 재할당 O, 생존범위는 function
// let로 만든 변수 = 재선언 X, 재할당 O, 생존범위는 {}
// const로 만든 변수 = 재선언 X, 재할당 X, 생존범위는 {}

const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true})); 
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));


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
    res.render('index.ejs');
});

app.get('/write', function(req, res){
    res.render('write.ejs');
    console.log('write 페이지 접속')
});

app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    // console.log(요청.body.title);
    // console.log(요청.body.date);
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost) // 결과.totalPost = 총게시물갯수
        var 총게시물갯수 = 결과.totalPost; // MongoDB에서 관리되는 데이터의 id Auto Increment를 위해 counter라는 Document에 관리 -> 게시물갯수를 불러옴 
        
        // counter라는 collection에 있는 totalPost 라는 항목도 1 증가시킴.
        db.collection('post').insertOne( {_id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date}, function(){
            console.log('저장완료');
            db.collection('counter').updateOne( {name : '게시물갯수'}, { $inc : {totalPost : 1}}, function(에러, 결과){
                if(에러){return console.log(에러)}
            }) // operator,{어떤 데이터를 수정할지}, {수정값}
        });
    
    }); 

});

app.get('/list', function(요청, 응답){
    //DB에 저장된 post라는 collection안의 모든 데이터를 꺼내 주세요
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs',{ posts : 결과 });
    });    
    // ejs 파일 사용 시에는 views라는 폴더 안에 존재하게 해야함. 규칙.
    
});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body); // 요청시 함께 보낸 데이터 찾기 위해 찍은 것(게시물 번호)
    // 요청.body에 담긴 게시물 번호에 따라 DB에서 데이터 삭제
    요청.body._id = parseInt(요청.body._id);// 요청.body에서 id의 값을 문자열로 반환시킴 -> int형으로 바꾸어야 함
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다'});
    });
});

// :id -> detail/??로 GET요청을 하면 아래 코드를 실행함(Parameter)
// 요청.parmas.id -> 파라미터 중 :id라는 뜻
app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });
        
    })

})