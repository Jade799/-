const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 连接数据库
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'hj0118', 
  database: 'polling_system'
});

// 核心：企业验证接口
app.post('/api/verify-enterprise', (req, res) => {
  const { companyName, realName } = req.body;
  
  // 到数据库里查找是否有匹配的记录
  const sql = 'SELECT * FROM official_enterprises WHERE company_name = ? AND legal_name = ?';
  
  db.query(sql, [companyName, realName], (err, results) => {
    if (err) return res.status(500).json({ error: '数据库查询出错' });
    
    if (results.length > 0) {
      res.json({ success: true, message: '认证成功！' });
    } else {
      res.status(401).json({ success: false, message: '企业信息或姓名不匹配' });
    }
  });
});

app.listen(3000, () => {
  console.log('🚀 后端服务已在 http://localhost:3000 启动');
});