// RestAPI

const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
// 這是什麼?
const bodyParser = require("body-parser");
// 置入/modules/students.js
// 這行到底是什麼?
// const students = require("./modules/student");
const Student = require("./modules/student");
// method-override 是做什麼的?
const methodOverRide = require("method-override");

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(methodOverRide("_method"));

// 連接到mongoose tryDB
mongoose
  .connect("mongodb://localhost:27017/tryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successful to mongodb");
  })
  .catch((e) => {
    console.log("fail to mondodb");
    console.log(e);
  });

// 為什麼這樣就可以變成 restapi
app.get("/students", async (req, res) => {
  try {
    let data = await Student.find();
    res.send(data);
  } catch {
    res.send({ message: "error with find data" });
  }
});

// 連結到/students/insert

//get data by id
// 透過/student/id_num 顯示"個人"頁面
app.get("/students/:id", async (req, res) => {
  // req.params屬性是一個對象，其中包含映射到命名路由“parameters”的
  // 屬性。例如，如果您具有路由/student /：id，則“id”屬性
  // 可用作req.params.id。該對象默認為{}。
  let { id } = req.params;

  try {
    let data = await Student.findOne({ id });

    // 顯示
    // console.log(req.params);
    // 這裡的findone 是一個 vailable Object
    // let data = await Student.findOne({ id });
    // res.send({data});

    // 為什麼要在這裡加入判斷式?
    // 如果"true" 代表有這個有這個編號的資料
    // 整體的工作流程是先判斷資料格式對不對，在判斷資料內容是否存在於資料庫
    if (data !== null) {
      res.send(data);
    } else {
      // 如果"false" 代表沒有這個編號的資料
      res.status(404);
      res.send({ message: "cannot find data" });
    }
  } catch (e) {
    // 錯誤處理
    // 這裡的catch是在指如果這個module 出現錯誤的時候的報錯提示
    // 例如說資料不符合規範

    res.send("error!!!");
    console.log(e);
  }
});

// 這個posting
app.post("/students/:id", (req, res) => {
  // console.log(req.body);
  // res.send("thank for posting.");
  let { id, name, age, merit, other } = req.body;
  // 新建一個object
  let newstudent = new Student({
    id,
    name,
    age,
    scholarship: { merit, other },
  });
  //這part在幹嘛?
  newstudent
    .save()
    .then(() => {
      // console.log("student accepted.");
      //如果成功連結到這個頁面
      res.send({ message: "successful post a new student." });
    })
    .catch((e) => {
      //如果失敗連結到這個頁面
      res.status(404);
      res.send(e);
    });
});

// update page
// 這是update 的第一步
// 改成 restAPI 可以用id 找學生;
app.get("/students/:id", async (req, res) => {
  // 這啥?
  let { id } = req.params;
  try {
    let data = await Student.findOne({ id });
    // 在findOne() 放if 判斷有沒有找到東西
    if (data !== null) {
      // let data = Student.findOne({id})
      res.send(data);
    } else {
      res.status(404);
      res.send({ message: "cannot find data" });
    }
  } catch {
    res.send("error!!!");
  }
});

// form的method只能GET或POST，要如何才能put?
// update 的 第二步
app.put("/students/:id", async (req, res) => {
  // 先把 id 拿出來
  // let { id } = req.params;

  let { id, name, age, merit, other } = req.body;
  // 上面let { id } = req.params 拿到 id 後就可以放進findoneand update 裡面
  // 這裡 findoneandupdate 後面是condition update option 最後還可以有一個callback
  try {
    let d = await Student.findOneAndUpdate(
      { id },
      { id, name, age, schelarship: { merit, other } },
      {
        new: true,
        runValidators: true,
      }
    ); // 因為req.body 的關係 merit跟other 不在schlarship 裡面頁就是schema 格式的問題，因此後面不可以串說 then(...)...catch(...)...
    // 重新導向
    // res.redirect(`/students/${id}`);
    res.send("successful update");
  } catch (e) {
    res.status(404);
    res.send(e);
  }

  // console.log(req.body);
  // res.send("thank for sending put reques.")
});

class newData {
  constructor() {}
    setProperty(key,value) {
      if(key !=="merit" && key !== "other") {
        this[key] = value;
      }else {
        this[`scholarship.$(key)`] = value;
      }
    }  
  }

app.patch("/students/:id", async (req, res) => {
  let {id } = req.params;
  // let { name, age, merit, other } = req.body;
  let newObject = new newData();
  for (let property in req.body) {
    newObject.setProperty(property, req.body[property]);
  }
  console.log(newObject);

  try {
    
    let d = await Student.findOneAndUpdate(
      // 按照原本的語法findoneandupdate()在找未更新的選項的時候就會錯誤
    {id},newObject,{
      // 這裡是什麼?
        new: true,
        runValidators: true,
        overwrite: true
      });

    console.log(d);
    res.send("successful update");
  
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// delete page
app.delete("/students/delete/:id", (req, res) => {
  let { id } = req.params;
  Student.deleteOne({ id })
    .then((meg) => {
      console.log(meg);
      res.send("deleted success.");
    })
    .catch((e) => {
      console.log(e);
      res.send("delete error.");
    });
});

app.delete("/students/delete", (req, res) => {
  
  Student.deleteMany({  })
    .then((meg) => {
      console.log(meg);
      res.send("deleted success.");
    })
    .catch((e) => {
      console.log(e);
      res.send("delete error.");
    });
});

// error handling 算是安全管控嗎?
// "/*"是指什麼意思?好像也可以寫"*"
app.get("*", (req, res) => {
  res.status(404);
  res.render("error.ejs");
});

//port number3000聆聽來自port3000的所有request
app.listen(3000, () => {
  console.log("server is running on 3000");
});
