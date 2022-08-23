// 這個file 是幹嘛的?
// 我猜是定義資料schema用的，下方的module.exports 顯示現在這東西是一個自建的module

// 置入mongoose module
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  
  // 這邊就是資料的架構
  id:{
    // 資料類型
    type: Number,
    required:true,
  },

  name: {
    type:String,
    required:true,
  },
  // 年齡
  age: {
    type:Number,
    default:18,
    max:[80, "Too old error"],
  },
  // nested structure
  scholarship: {
    merit: {
      type:Number,
      min:0,
      max: [5000,"max"],
    },
    other: {
      type:Number,
      min:0,
    },
  },
});


// 左邊Student這個變數被左邊賦值mongoose.model("Student",studentSchema)
const Student = mongoose.model("Student", schema);
// 這個語法與module.exports.Student = Student的差異
// module.exports.Student = Student //[object()]
module.exports = Student; //object()





