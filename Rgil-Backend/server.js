/* ═══════════════════════════════════════════════════════════════
   RGIL NOTICES BACKEND — server.js
   Single-file Express + MongoDB + JWT backend

   QUICK START:
   1. npm install express mongoose jsonwebtoken bcryptjs cors dotenv
   2. Create .env file (see bottom of this file for template)
   3. node server.js
   4. Visit http://localhost:5000/api/auth/seed  (POST) once to create admin
   5. Then DELETE or comment out the /seed route
═══════════════════════════════════════════════════════════════ */

require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const cors      = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ══ Middleware ══ */
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',   // set to your domain in production
  methods: ['GET','POST','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.disable('x-powered-by');

/* ══ Connect MongoDB ══ */
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rgil')
  .then(() => console.log('✅  MongoDB connected'))
  .catch(e  => { console.error('❌  MongoDB error:', e.message); process.exit(1); });

/* ══════════════════════════════════════════════════════
   SCHEMAS & MODELS
══════════════════════════════════════════════════════ */

/* ── Admin ── */
const tickerSchema = new mongoose.Schema({
  type: { type: String, enum: ['link', 'download', 'text'], required: true },
  text: { type: String, required: true },
  href: { type: String },
  badge: { type: String }
}, { timestamps: true });

const Ticker = mongoose.model('Ticker', tickerSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
adminSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.checkPassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};
const Admin = mongoose.model('Admin', adminSchema);

/* ── Notice ── */
const noticeSchema = new mongoose.Schema({
  panel:     { type: String, enum: ['notices','events'], required: true },
  date:      { type: String, required: true },          // display string e.g. "May 15"
  text:      { type: String, required: true, maxlength: 300 },
  badge:     { type: String, enum: ['','New','Ongoing'], default: '' },
  type:      { type: String, enum: ['text','link','download'], default: 'text' },
  href:      { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Notice = mongoose.model('Notice', noticeSchema);

/* ══════════════════════════════════════════════════════
   JWT MIDDLEWARE
══════════════════════════════════════════════════════ */
function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token — access denied' });

  try {
    req.admin = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/* ══════════════════════════════════════════════════════
   AUTH ROUTES
══════════════════════════════════════════════════════ */

/* POST /api/auth/login → { token, expiresIn } */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.checkPassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );
    res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* GET /api/auth/verify → checks token */
app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});

/* POST /api/auth/seed → creates admin account ONCE
   ⚠️  DELETE or comment this route after first use! */
app.post('/api/auth/seed', async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (exists) return res.status(409).json({ error: 'Admin already exists.' });

    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    });
    await admin.save();
    res.json({ message: `Admin '${admin.username}' created. Now DELETE the /seed route!` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ══════════════════════════════════════════════════════
   NOTICES ROUTES
══════════════════════════════════════════════════════ */

/* GET /api/notices → PUBLIC — returns all notices newest first */
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).lean();
    res.json(notices);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET ticker (public)
app.get('/api/ticker', async (req, res) => {
  const items = await Ticker.find().sort({ createdAt: -1 });
  res.json(items);
});

// ADD ticker
app.post('/api/ticker', requireAuth, async (req, res) => {
  const item = await Ticker.create(req.body);
  res.json(item);
});

// DELETE ticker
app.delete('/api/ticker/:id', requireAuth, async (req, res) => {
  await Ticker.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.post('/api/ticker/seed', async (req, res) => {
  await Ticker.deleteMany();

  await Ticker.insertMany([
    { type: "link", text: "Admissions Open for 2025–26 Academic Year — Apply Now", href: "admissions.html" },
    { type: "download", text: "National Moot Court Competition — Download Brochure", href: "assets/moot-court-brochure.pdf" },
    { type: "link", text: "Legal Aid Camp at Ramanayyapeta — Community Service Initiative", href: "events.html#legal-aid" },
    { type: "download", text: "Results for Semester III Declared — Download Results PDF", href: "assets/sem3-results.pdf" },
    { type: "link", text: "Guest Lecture by Hon. Justice (Retd.) K. Ramakrishna — 15 May 2025", href: "notices.html" },
    { type: "text", text: "College closed on 14 April for Dr. Ambedkar Jayanti" },
    { type: "text", text: "College closed on 1st May for May Day" }
  ]);

  res.json({ message: "Ticker seeded" });
});


/* POST /api/notices → ADMIN ONLY — add a notice */
app.post('/api/notices', requireAuth, async (req, res) => {
  try {
    const { panel, date, text, badge, type, href } = req.body;

    if (!panel || !date || !text)
      return res.status(400).json({ error: 'panel, date and text are required' });

    if (!['notices','events'].includes(panel))
      return res.status(400).json({ error: 'panel must be "notices" or "events"' });

    if (type !== 'text' && !href)
      return res.status(400).json({ error: 'href required for link/download type' });

    const notice = new Notice({ panel, date, text, badge: badge||'', type: type||'text', href: href||'' });
    await notice.save();
    res.status(201).json(notice);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* DELETE /api/notices/:id → ADMIN ONLY — delete a notice */
app.delete('/api/notices/:id', requireAuth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* POST /api/notices/seed → ADMIN ONLY — seed default notices once */
app.post('/api/notices/seed', requireAuth, async (req, res) => {
  try {
    const count = await Notice.countDocuments();
    if (count > 0) return res.status(409).json({ error: 'Notices already exist.' });

    const defaults = [
      { panel:'notices', date:'May 15', text:'Guest Lecture by Hon. Justice (Retd.) K. Ramakrishna on Constitutional Law', badge:'New',     type:'link',     href:'notices.html' },
      { panel:'notices', date:'May 10', text:'Semester III Examination Results Declared — Check Portals',                   badge:'',       type:'download', href:'assets/sem3-results.pdf' },
      { panel:'notices', date:'May 05', text:'Moot Court National Competition — Team Selection on May 8',                   badge:'',       type:'link',     href:'notices.html' },
      { panel:'notices', date:'Apr 28', text:'Legal Aid Camp at Ramanayyapeta — Volunteer Registrations Open',              badge:'Ongoing',type:'text' },
      { panel:'notices', date:'Apr 20', text:'Annual Sports Day — Schedule Released',                                       badge:'',       type:'text' },
      { panel:'events',  date:'Jun 01', text:'Admissions Commence — 2025–26 Batch',                                         badge:'New',    type:'link',     href:'admissions.html' },
      { panel:'events',  date:'May 20', text:'HRC Visit — High Court of Andhra Pradesh, Amaravati',                         badge:'',       type:'text' },
      { panel:'events',  date:'May 18', text:'NSS Camp — Village Adoption Programme, Kakinada Rural',                       badge:'',       type:'text' },
      { panel:'events',  date:'May 12', text:'Central Prison Visit — Criminal Justice Field Study',                          badge:'',       type:'text' },
      { panel:'events',  date:'May 02', text:'Inter-Collegiate Debate Competition — Results Announced',                      badge:'',       type:'text' },
    ];
    await Notice.insertMany(defaults);
    res.json({ message: `${defaults.length} notices seeded.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* PATCH /api/notices/:id → ADMIN ONLY — edit a notice */
app.patch('/api/notices/:id', requireAuth, async (req, res) => {
  try {
    const { panel, date, text, badge, type, href } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { panel, date, text, badge: badge||'', type: type||'text', href: href||'' },
      { new: true, runValidators: true }
    );
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* PATCH /api/ticker/:id → ADMIN ONLY — edit a ticker item */
app.patch('/api/ticker/:id', requireAuth, async (req, res) => {
  try {
    const { text, type, href } = req.body;
    const item = await Ticker.findByIdAndUpdate(
      req.params.id,
      { text, type: type||'text', href: href||'' },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Ticker item not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ══ Health check ══ */
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => console.log(`🚀  RGIL API → http://localhost:${PORT}`));

