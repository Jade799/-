'use strict';

const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const JWT_SECRET = 'voting_system_2026_secret';
const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' })); // 支持 base64 大图片

// ============================================================
// 数据库连接池
// ============================================================
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',   // 空字符串
  database: 'polling_system',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+08:00'
});

// ============================================================
// JWT 鉴权中间件
// ============================================================
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '请先登录' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token 已过期，请重新登录' });
  }
};

// ============================================================
// 工具：把数据库行转换为前端格式
// ============================================================
const formatPoll = (row, options) => ({
  id:         row.id,
  title:      row.title,
  description:row.description,
  algorithm:  row.algorithm,
  status:     row.status,
  createdAt:  new Date(row.created_at).getTime(),
  endAt:      new Date(row.end_at).getTime(),
  totalVotes: row.total_votes,
  creator:    row.creator_name || '匿名',
  options:    options.map(o => ({
    id:    o.id,
    label: o.label,
    count: parseFloat(o.count_val)
  }))
});

// ============================================================
// 用户模块
// ============================================================

// 注册
app.post('/api/register', async (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username?.trim() || !password?.trim())
    return res.status(400).json({ error: '账号和密码不能为空' });

  try {
    const [exist] = await pool.query(
      'SELECT id FROM users WHERE username = ?', [username]
    );
    if (exist.length > 0)
      return res.status(409).json({ error: '账号已存在，请直接登录' });

    const hash = await bcrypt.hash(password, 10);
    const nick = nickname?.trim() || username.split('@')[0];

    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash, nickname) VALUES (?, ?, ?)',
      [username, hash, nick]
    );

    const token = jwt.sign(
      { id: result.insertId, nickname: nick },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({
      success: true, token,
      user: { id: result.insertId, nickname: nick, isCertified: false }
    });
  } catch (err) {
    res.status(500).json({ error: '注册失败', detail: err.message });
  }
});

// 登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim())
    return res.status(400).json({ error: '请填写账号和密码' });

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: '账号不存在' });

    const u = rows[0];
    const valid = await bcrypt.compare(password, u.password_hash);
    if (!valid)
      return res.status(401).json({ error: '密码错误' });

    const token = jwt.sign(
      { id: u.id, nickname: u.nickname },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({
      success: true, token,
      user: {
        id: u.id, nickname: u.nickname, signature: u.signature,
        avatar: u.avatar,   bgImage: u.bg_image,
        isCertified: !!u.is_certified,
        companyName: u.company_name, realName: u.real_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?', [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: '用户不存在' });
    const u = rows[0];
    res.json({
      id: u.id, nickname: u.nickname, signature: u.signature,
      avatar: u.avatar, bgImage: u.bg_image,
      isCertified: !!u.is_certified,
      companyName: u.company_name, realName: u.real_name
    });
  } catch (err) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 更新个人信息
app.put('/api/user/profile', auth, async (req, res) => {
  const { nickname, signature, avatar, bgImage, isCertified, companyName, realName } = req.body;
  try {
    await pool.query(
      `UPDATE users
         SET nickname=?, signature=?, avatar=?, bg_image=?,
             is_certified=?, company_name=?, real_name=?
       WHERE id=?`,
      [nickname, signature, avatar, bgImage,
       isCertified ? 1 : 0, companyName, realName, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '更新失败', detail: err.message });
  }
});

// ============================================================
// 投票模块
// ============================================================

// 获取投票列表
app.get('/api/polls', async (req, res) => {
  const { status, algorithm, q, sort } = req.query;
  try {
    let sql = `
      SELECT p.*, u.nickname AS creator_name
      FROM polls p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all')     { sql += ' AND p.status = ?';    params.push(status); }
    if (algorithm && algorithm !== 'all') { sql += ' AND p.algorithm = ?'; params.push(algorithm); }
    if (q) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (sort === 'popular') sql += ' ORDER BY p.total_votes DESC';
    else if (sort === 'ending') sql += ' ORDER BY p.end_at ASC';
    else sql += ' ORDER BY p.created_at DESC';

    const [pollRows] = await pool.query(sql, params);

    // 批量拿选项
    const pollIds = pollRows.map(p => p.id);
    let optMap = {};
    if (pollIds.length > 0) {
      const [optRows] = await pool.query(
        'SELECT * FROM options WHERE poll_id IN (?) ORDER BY id', [pollIds]
      );
      optRows.forEach(o => {
        if (!optMap[o.poll_id]) optMap[o.poll_id] = [];
        optMap[o.poll_id].push(o);
      });
    }

    res.json(pollRows.map(p => formatPoll(p, optMap[p.id] || [])));
  } catch (err) {
    res.status(500).json({ error: '获取列表失败', detail: err.message });
  }
});

// 获取单个投票详情
app.get('/api/polls/:id', async (req, res) => {
  try {
    const [polls] = await pool.query(
      `SELECT p.*, u.nickname AS creator_name
         FROM polls p LEFT JOIN users u ON p.creator_id = u.id
        WHERE p.id = ?`,
      [req.params.id]
    );
    if (polls.length === 0) return res.status(404).json({ error: '投票不存在' });

    const [options] = await pool.query(
      'SELECT * FROM options WHERE poll_id = ? ORDER BY id', [req.params.id]
    );
    res.json(formatPoll(polls[0], options));
  } catch (err) {
    res.status(500).json({ error: '获取详情失败' });
  }
});

// 创建投票
app.post('/api/polls', auth, async (req, res) => {
  const { title, description, algorithm, endAt, options } = req.body;
  if (!title || !algorithm || !endAt || !options?.length)
    return res.status(400).json({ error: '参数不完整' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO polls (title, description, algorithm, status, end_at, creator_id)
       VALUES (?, ?, ?, 'active', ?, ?)`,
      [title, description || '', algorithm, new Date(endAt), req.user.id]
    );
    const pollId = result.insertId;

    for (const opt of options) {
      await conn.query(
        'INSERT INTO options (poll_id, label, count_val) VALUES (?, ?, 0)',
        [pollId, opt.label]
      );
    }

    await conn.commit();
    res.json({ success: true, id: pollId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: '创建失败', detail: err.message });
  } finally {
    conn.release();
  }
});

// 删除投票（仅创建者）
app.delete('/api/polls/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT creator_id FROM polls WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: '投票不存在' });
    if (rows[0].creator_id !== req.user.id)
      return res.status(403).json({ error: '无权删除他人的投票' });

    await pool.query('DELETE FROM polls WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '删除失败' });
  }
});

// 提交投票
app.post('/api/polls/:id/vote', auth, async (req, res) => {
  const pollId = parseInt(req.params.id);
  const userId = req.user.id;
  const { algorithm, singleValue, multipleValues, weightValues, bordaOrder, scoreValues } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 防重复投票
    const [voted] = await conn.query(
      'SELECT id FROM votes WHERE user_id = ? AND poll_id = ?', [userId, pollId]
    );
    if (voted.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: '你已参与过此投票' });
    }

    // 校验投票状态
    const [polls] = await conn.query('SELECT * FROM polls WHERE id = ?', [pollId]);
    if (!polls.length || polls[0].status !== 'active') {
      await conn.rollback();
      return res.status(400).json({ error: '投票不存在或已结束' });
    }
    const totalVotes = polls[0].total_votes;

    // 按算法更新票数
    if (algorithm === 'single') {
      await conn.query(
        'UPDATE options SET count_val = count_val + 1 WHERE id = ? AND poll_id = ?',
        [singleValue, pollId]
      );

    } else if (algorithm === 'multiple') {
      for (const optId of (multipleValues || [])) {
        await conn.query(
          'UPDATE options SET count_val = count_val + 1 WHERE id = ? AND poll_id = ?',
          [optId, pollId]
        );
      }

    } else if (algorithm === 'weighted') {
      for (const [optId, weight] of Object.entries(weightValues || {})) {
        const [opt] = await conn.query('SELECT count_val FROM options WHERE id = ?', [optId]);
        if (opt.length) {
          const newAvg = ((opt[0].count_val * totalVotes) + Number(weight)) / (totalVotes + 1);
          await conn.query('UPDATE options SET count_val = ? WHERE id = ?', [Math.round(newAvg), optId]);
        }
      }

    } else if (algorithm === 'borda') {
      const order = bordaOrder || [];
      const n = order.length;
      for (let i = 0; i < n; i++) {
        const score = n - 1 - i;
        const [opt] = await conn.query('SELECT count_val FROM options WHERE id = ?', [order[i]]);
        if (opt.length) {
          const newAvg = ((opt[0].count_val * totalVotes) + score) / (totalVotes + 1);
          await conn.query(
            'UPDATE options SET count_val = ? WHERE id = ?',
            [parseFloat(newAvg.toFixed(2)), order[i]]
          );
        }
      }

    } else if (algorithm === 'scoring') {
      for (const [optId, score] of Object.entries(scoreValues || {})) {
        const [opt] = await conn.query('SELECT count_val FROM options WHERE id = ?', [optId]);
        if (opt.length) {
          const newAvg = ((opt[0].count_val * totalVotes) + Number(score)) / (totalVotes + 1);
          await conn.query(
            'UPDATE options SET count_val = ? WHERE id = ?',
            [parseFloat(newAvg.toFixed(1)), optId]
          );
        }
      }
    }

    // 总票数 +1，写入投票记录
    await conn.query('UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?', [pollId]);
    await conn.query('INSERT INTO votes (user_id, poll_id) VALUES (?, ?)', [userId, pollId]);

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: '投票失败', detail: err.message });
  } finally {
    conn.release();
  }
});

// 查询当前用户是否已投票
app.get('/api/polls/:id/voted', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM votes WHERE user_id = ? AND poll_id = ?',
      [req.user.id, req.params.id]
    );
    res.json({ voted: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: '查询失败' });
  }
});

// ============================================================
// 企业认证（保留原有接口）
// ============================================================
app.post('/api/verify-enterprise', async (req, res) => {
  const { companyName, realName } = req.body;
  try {
    const [results] = await pool.query(
      'SELECT * FROM official_enterprises WHERE company_name = ? AND legal_name = ?',
      [companyName, realName]
    );
    if (results.length > 0) {
      res.json({ success: true, message: '认证成功！' });
    } else {
      res.status(401).json({ success: false, message: '企业信息或姓名不匹配' });
    }
  } catch (err) {
    res.status(500).json({ error: '数据库查询出错' });
  }
});

// ============================================================
// 启动
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 后端服务已在 http://localhost:${PORT} 启动`);
  console.log('可用接口：');
  console.log('  POST /api/register        注册');
  console.log('  POST /api/login           登录');
  console.log('  GET  /api/user/profile    获取个人信息（需登录）');
  console.log('  PUT  /api/user/profile    更新个人信息（需登录）');
  console.log('  GET  /api/polls           投票列表');
  console.log('  GET  /api/polls/:id       投票详情');
  console.log('  POST /api/polls           创建投票（需登录）');
  console.log('  DEL  /api/polls/:id       删除投票（需登录）');
  console.log('  POST /api/polls/:id/vote  提交投票（需登录）');
  console.log('  GET  /api/polls/:id/voted 是否已投票（需登录）');
  console.log('  POST /api/verify-enterprise 企业认证');
});
