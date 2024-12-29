const express = require('express');
const QRCode = require('qrcode');
const gifted = require('gifted-dls');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const figlet = require('figlet');
const { chromium } = require('playwright');
const { alldl } = require('rahad-all-downloader'); // اضافه کردن کتابخانه
const { igdl } = require('nothing-dls');
const { ttdl } = require('nothing-dls');
const { fbdown } = require('nothing-dls');
const { youtube } = require('nothing-dls');
const { twitter } = require('nothing-dls');
const { wallpaper } = require('nothing-dls');
const fg = require('api-dylux'); //
const fs = require('fs');
const os = require('os');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const timeLimit = 7 * 24 * 60 * 60 * 1000; // مدت زمان یک هفته (میلی‌ثانیه)
const apiKeyFile = path.join(__dirname, 'apikeyall.json'); // مسیر فایل کلیدها
// فایل JSON برای ذخیره تعداد بازدیدکنندگان
const visitorFile = 'visitors.json';
const visitorFilee = 'count.json';

// خواندن تعداد بازدیدکنندگان از فایل
const getVisitorCount = () => {
  try {
    const data = fs.readFileSync(visitorFile);
    const parsedData = JSON.parse(data);
    return parsedData.visitors || 0;
  } catch (err) {
    console.error('Error reading file', err);
    return 0;
  }
};

const getVisitorCounte = () => {
  try {
    const data = fs.readFileSync(visitorFilee);
    const parsedData = JSON.parse(data);
    return parsedData.visitors || 0;
  } catch (err) {
    console.error('Error reading file', err);
    return 0;
  }
};

// افزایش تعداد بازدیدکنندگان
const incrementVisitorCount = () => {
  let count = getVisitorCount();
  count += 1500; // افزایش 1 واحد (برای هر بازدید)
  fs.writeFileSync(visitorFile, JSON.stringify({ visitors: count }, null, 2));
  return count;
};
// DOC API
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/changelog', (req, res) => {
    res.sendFile(path.join(__dirname, 'Updates.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/doc', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'));
});
app.get('/ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai.html'));
});
app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'));
});
app.get('/tools', (req, res) => {
    res.sendFile(path.join(__dirname, 'tools.html'));
});
// مسیر بررسی وضعیت API
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'search.html'));
});
app.get('/converter', (req, res) => {
    res.sendFile(path.join(__dirname, 'converter.html'));
});
app.get('/shortener', (req, res) => {
    res.sendFile(path.join(__dirname, 'shortener.html'));
});
app.get('/nsfw', (req, res) => {
    res.sendFile(path.join(__dirname, 'nsfw.html'));
});
app.get('/maker', (req, res) => {
    res.sendFile(path.join(__dirname, 'maker.html'));
});
app.get('/stalk', (req, res) => {
    res.sendFile(path.join(__dirname, 'stalk.html'));
});
app.get('/movie', (req, res) => {
    res.sendFile(path.join(__dirname, 'movie.html'));
});
app.get('/islam', (req, res) => {
    res.sendFile(path.join(__dirname, 'islam.html'));
});
// API برای دریافت تعداد بازدیدکنندگان
app.get('/visit', (req, res) => {
  const visitors = getVisitorCount();
  res.json({ visitors });
});
app.get('/count', (req, res) => {
  const visitors = getVisitorCounte();
  res.json({ visitors });
});

// API برای افزایش تعداد بازدیدکنندگان
app.get('/increment-visit', (req, res) => {
  const visitors = incrementVisitorCount();
  res.json({ visitors });
});
setInterval(() => {
  let count = getVisitorCount();
  count += 10; // افزایش 10 واحد
  fs.writeFileSync(visitorFile, JSON.stringify({ visitors: count }, null, 2));
  console.log(`Visitor count increased to: ${count}`);
}, 60000); // هر 60,000 میلی‌ثانیه (1 دقیقه)
// تابع برای محاسبه زمان اجرای سرور
const getUptime = () => {
  const seconds = Math.floor(process.uptime());
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours} hours, ${minutes} minutes, ${remainingSeconds} second`;
};

// تابع برای دریافت استفاده از حافظه
const getMemoryUsage = () => {
  const totalMemory = 7628
  const usedMemory = process.memoryUsage().rss / (1024 * 1024); // مگابایت
  return `${usedMemory.toFixed(2)}MB / ${totalMemory.toFixed(2)}GB`;
};

// API برای وضعیت
app.get('/status', (req, res) => {
  res.json({
    runtime: getUptime(),
    memory: getMemoryUsage(),
  });
});
//MAIN
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// کلید پیش‌فرض
const defaultKey = {
    "nothing-api": { limit: 100000000, used: 0, lastReset: Date.now() }
};

// بارگذاری کلیدها از فایل
const loadApiKeys = () => {
    if (!fs.existsSync(apiKeyFile)) {
        fs.writeFileSync(apiKeyFile, JSON.stringify(defaultKey, null, 2)); // ایجاد فایل در صورت عدم وجود
    }
    return JSON.parse(fs.readFileSync(apiKeyFile));
};

// ذخیره کلیدها در فایل
const saveApiKeys = (apiKeys) => {
    fs.writeFileSync(apiKeyFile, JSON.stringify(apiKeys, null, 2));
};

let apiKeys = loadApiKeys();

// تابع بررسی یا ایجاد وضعیت برای کاربر
const checkUserLimit = (apikey) => {
    const apiKeyData = apiKeys[apikey];
    
    // اگر زمان بازنشانی گذشته باشد، مقدار `used` صفر می‌شود
    if (Date.now() - apiKeyData.lastReset > timeLimit) {
        apiKeyData.used = 0;
        apiKeyData.lastReset = Date.now();
    }

    return apiKeyData;
};
// مسیر بررسی وضعیت API
app.get('/api/checker', (req, res) => {
    const apikey = req.query.apikey;

    if (!apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = apiKeys[apikey];
    const remaining = keyData.limit - keyData.used;

    res.json({
        status: true,
        apikey,
        limit: keyData.limit,
        used: keyData.used,
        remaining,
        resetIn: '7 days'
    });
});
// مسیر ایجاد کلید API جدید
app.get('/api/create-apikey', (req, res) => {
    const newKey = req.query.key;
    if (!newKey || apiKeys[newKey]) {
        return res.status(400).json({
            status: false,
            result: 'Invalid or duplicate key.'
        });
    }

    apiKeys[newKey] = { limit: 200, used: 0, lastReset: Date.now(), users: {} };
    saveApiKeys(apiKeys);

    res.json({
        status: true,
        result: 'New API key created.',
        newKey,
        limit: 200
    });
});

// مسیر تغییر محدودیت کلید API
app.get('/api/apikeychange/upto', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست
    const newLimit = parseInt(req.query.limit); // دریافت محدودیت جدید از درخواست

    // بررسی مقدار ورودی
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json({
            status: false,
            result: 'Invalid or missing API key.'
        });
    }

    if (!newLimit || isNaN(newLimit) || newLimit <= 0) {
        return res.status(400).json({
            status: false,
            result: 'Invalid limit value.'
        });
    }

    // به‌روزرسانی محدودیت کلید API
    apiKeys[apikey].limit = newLimit;
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json({
        status: true,
        result: 'API key limit updated successfully.',
        apikey: apikey,
        newLimit: newLimit
    });
});
//DISABLE APIKEY
app.get('/api/apikeychange/disable', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // غیرفعال کردن کلید API
    apiKeys[apikey].active = false;
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been disabled.`,
        apikey
    }));
});

// فعال کردن مجدد کلید API
app.get('/api/apikeychange/enable', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // فعال کردن مجدد کلید API
    apiKeys[apikey].active = true;
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been enabled.`,
        apikey
    }));
});
// حذف کلید API
app.get('/api/apikeychange/delete', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // حذف کلید API از سیستم
    delete apiKeys[apikey];
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been deleted.`,
        apikey
    }));
});

// ریست کردن آمار کلید API
app.get('/api/apikeychange/reset', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // ریست کردن آمار کلید API
    apiKeys[apikey].used = 0;
    apiKeys[apikey].lastReset = Date.now(); // زمان آخرین ریست را به‌روز می‌کند
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been reset.`,
        apikey
    }));
});
//TEMP MAIL
const tempEmails = [];
app.get('/api/tools/tempmail', async (req, res) => {
    const apikey = req.query.apikey; // دریافت API Key از درخواست

    // بررسی وجود API Key در لیست
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.',
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.',
        });
    }

    // افزایش مقدار `used` برای کلید و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // تولید ایمیل
        const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox');
        const email = response.data[0];
        
        // ذخیره ایمیل در متغیر
        tempEmails.push(email);

        // بازگشت ایمیل تولید شده
        const result = {
            type: 'email',
            apikey: apikey,
            email: email,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: result,
        }, null, 2)); // مرتب کردن JSON با فاصله 4
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error creating temporary email.',
            error: error.message,
        });
    }
});
// مسیر برای بررسی Inbox ایمیل
app.get('/api/tools/tempmail-inbox', async (req, res) => {
    const apikey = req.query.apikey; // دریافت API Key از درخواست
    const email = req.query.inbox;  // ایمیل موردنظر برای بررسی

    // بررسی وجود API Key
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.',
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.',
        });
    }

    // بررسی وجود ایمیل
    if (!email) {
        return res.status(400).json({
            status: false,
            message: 'Inbox email is required.',
        });
    }

    // بررسی اینکه آیا ایمیل قبلاً ایجاد شده است
    if (!tempEmails.includes(email)) {
        return res.status(404).json({
            status: false,
            message: 'Email not found. Make sure to create it first.',
        });
    }

    // افزایش مقدار `used` برای کلید و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const [login, domain] = email.split('@');

        // دریافت پیام‌های Inbox
        const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const messages = response.data;

        // ساختار پاسخ
        const result = {
            type: 'inbox',
            apikey: apikey,
            email: email,
            messages: messages.length > 0 ? messages : 'Inbox is empty.',
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: result,
        }, null, 2)); // مرتب کردن JSON با فاصله 4
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error checking inbox.',
            error: error.message,
        });
    }
});
// دانلود فایل apikeyall.json
app.get('/api/getsession2', (req, res) => {
    const filePath = path.join(__dirname, 'apikeyall.json'); // تعیین مسیر فایل
    res.download(filePath, 'apikeyall.json', (err) => {
        if (err) {
            res.status(500).json(JSON.stringify({
                status: false,
                result: 'Error downloading file.',
                error: err.result
            }));
        }
    });
});
app.get('/api/getsession3', (req, res) => {
    const filePath = path.join(__dirname, 'shortlinks.json'); // تعیین مسیر فایل
    res.download(filePath, 'shortlinks.json', (err) => {
        if (err) {
            res.status(500).json(JSON.stringify({
                status: false,
                result: 'Error downloading file.',
                error: err.result
            }));
        }
    });
});
// مسیر برای دریافت تمام API keyها
app.get('/api/checkallapikey/check', (req, res) => {
    try {
        // خواندن فایل و دریافت کلیدها
        const apiKeysData = JSON.parse(fs.readFileSync(apiKeyFile));

        // قالب‌بندی اطلاعات
        const allKeys = Object.entries(apiKeysData).map(([key, value]) => ({
            apikey: key,
            limit: value.limit,
            used: value.used,
            remaining: value.limit - value.used,
            lastReset: new Date(value.lastReset).toLocaleString()
        }));

        // ارسال پاسخ به صورت مرتب شده
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: allKeys
        }, null, 2)); // مرتب کردن JSON با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            result: 'Error reading API keys file.',
            error: err.message
        });
    }
});
//ALL DL
app.get('/api/downloader/alldl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const videoUrl = req.query.url; // دریافت لینک ویدیو

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت کلید API
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی وجود لینک ویدیو
    if (!videoUrl) {
        return res.status(400).json({
            status: false,
            message: 'No video URL provided.'
        });
    }

    try {
        // افزایش مقدار استفاده از کلید
        keyData.used += 1;
        saveApiKeys(apiKeys);

        // دریافت اطلاعات ویدیو از API
        const result = await alldl(videoUrl);
        const videoData = result.data;

        // کوتاه کردن لینک دانلود با TinyURL
        const tinyUrlResponse = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoData.videoUrl)}`
        );
        const tinyDownloadUrl = tinyUrlResponse.data;

        // ساختار JSON خروجی
        const video = {
            type: "video",
            apikey: apikey, // کلید API
            quality: "480p", // کیفیت پیش‌فرض
            title: videoData.title || "No Title Available",
            url: videoUrl, // لینک اصلی ویدیو
            download_url: tinyDownloadUrl // لینک کوتاه‌شده
        };

        // ارسال پاسخ JSON با استفاده از JSON.stringify و مرتب کردن داده‌ها
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "Nothing-Ben",
            result: [video]
        }, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Error processing your request.",
            error: err.message
        });
    }
});
//FBDL
app.get('/api/downloader/facebook', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { url } = req.query;

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }
    
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }
    
    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }
    
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const video = await fbdown(url);
        res.json({ video });
    } catch (error) {
        res.status(500).send({ error: 'Failed to download video' });
    }
});

app.get('/api/downloader/wallpaper', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { text } = req.query; // دریافت پارامتر 'text'

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }
    
    if (!text) { // بررسی وجود پارامتر 'text'
        return res.status(400).json({ error: 'Text is required' });
    }
    
    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }
    
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const video = await wallpaper(text); // فرض بر این است که تابع wallpaper تعریف شده است
        res.json({ video });
    } catch (error) {
        res.status(500).json({ error: 'Failed to download wallpaper' });
    }
});
app.get('/api/downloader/twitter', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { url } = req.query;

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }
    
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }
    
    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }
    
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const video = await twitter(url);
        res.json({ video });
    } catch (error) {
        res.status(500).send({ error: 'Failed to download video' });
    }
});
//TINYURL CODE
app.get('/api/tools/tinyurl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const url = req.query.url; // URL اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // ارسال درخواست به TinyURL
        const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        const tinyUrl = tinyUrlResponse.data;

        // ساختار JSON خروجی
        const result = {
            type: "tinyurl",
            apikey: apikey,
            tiny_url: tinyUrl,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error creating TinyURL.',
            error: err.message
        });
    }
});
//IS SHORTURL
app.get('/api/tools/is-shorturl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const url = req.query.url; // URL اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // ارسال درخواست به TinyURL
        const tinyUrlResponsee = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
        const issh = tinyUrlResponsee.data;

        // ساختار JSON خروجی
        const result = {
            type: "is",
            apikey: apikey,
            is_url: issh,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error creating TinyURL.',
            error: err.message
        });
    }
});
//SHORT URL OFFCIAL
app.get('/api/create-shorturl', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const originalUrl = req.query.url; // دریافت لینک اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی اینکه لینک ارسال شده یا نه
    if (!originalUrl) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    // خواندن لینک‌های ذخیره‌شده
    let links = {};
    const linksFile = 'shortlinks.json';
    if (fs.existsSync(linksFile)) {
        links = JSON.parse(fs.readFileSync(linksFile));
    }

    // تولید کد کوتاه و اضافه کردن .com
    const shortCode = Math.random().toString(36).substr(2, 6) + '.com';

    // ذخیره لینک
    links[shortCode] = originalUrl;
    fs.writeFileSync(linksFile, JSON.stringify(links, null, 2));

    // ساختار JSON خروجی مشابه TinyURL با استفاده از JSON.stringify
    const result = {
        status: true,
        creator: 'nothing-ben',
        apikey: apikey,
        original_url: originalUrl,
        short_url: `https://${req.hostname}/${shortCode}`
    };

    // استفاده از JSON.stringify برای ایجاد خروجی به صورت مرتب
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: true,
        creator: 'nothing-ben',
        result: [result]
    }, null, 2));  // 4 فاصله برای مرتب‌سازی و خوانایی بهتر
});
app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;

    // خواندن لینک‌ها از فایل
    const linksFile = 'shortlinks.json';
    if (!fs.existsSync(linksFile)) {
        return res.status(404).json({
            status: false,
            message: 'URL not found.'
        });
    }

    const links = JSON.parse(fs.readFileSync(linksFile));
    const originalUrl = links[shortCode];

    if (originalUrl) {
        res.redirect(originalUrl); // ریدایرکت به لینک اصلی
    } else {
        res.status(404).json({
            status: false,
            message: 'URL not found.'
        });
    }
});
//SHORT URL
app.get('/api/tools/shorturl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const url = req.query.url; // URL اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // ارسال درخواست به ShortURL
        const response = await axios.post('https://www.shorturl.at/shortener.php', null, {
            params: { url: url }
        });
        const shortUrl = response.data || 'Shortening failed';

        // ساختار JSON خروجی
        const result = {
            type: "shorturl",
            apikey: apikey,
            short_url: shortUrl,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error creating ShortURL.',
            error: err.message
        });
    }
});
//INGDL
app.get('/api/downloader/Instagram', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    // بررسی اینکه URL اینستاگرام باشد
    if (!url.includes('instagram.com')) {
        return res.status(400).json({
            status: false,
            message: 'Invalid Instagram URL.'
        });
    }

    try {
        // دانلود پست اینستاگرام
        const data = await igdl(url);
        
        // گرفتن لینک‌های thumbnail و url
        const thumbnailLink = data[0].thumbnail;
        const videoUrl = data[0].url;

        if (!thumbnailLink || !videoUrl) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving Instagram post details.'
            });
        }

        // کوتاه کردن لینک‌ها با TinyURL
        const shortThumbnailLink = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(thumbnailLink)}`);
        const shortVideoUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoUrl)}`);

        // ساختار JSON و استفاده از JSON.stringify برای ارسال خروجی
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "video", // نوع محتوا
                apikey: apikey, // کلید API
                url: url, // URL اصلی
                thumbnail: shortThumbnailLink.data, // لینک کوتاه‌شده تصویر بندانگشتی
                downloa_url: shortVideoUrl.data // لینک کوتاه‌شده ویدیو
            }]
        };

        // ارسال پاسخ با استفاده از JSON.stringify و مرتب‌سازی آن
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//TIKTOK DL
app.get('/api/downloader/tiktok', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    // بررسی اینکه URL شامل tiktok باشد
    const validTikTokDomains = ['tiktok.com', 'vt.tiktok.com', 'www.tiktok.com'];
    const isValidUrl = validTikTokDomains.some(domain => url.includes(domain));

    if (!isValidUrl) {
        return res.status(400).json({
            status: false,
            message: 'Invalid TikTok URL.'
        });
    }

    try {
        // دریافت اطلاعات ویدیو از TikTok
        const data = await ttdl(url);

        // گرفتن لینک‌های thumbnail و url
        const thumbnailLink = data.thumbnail;
        const videoUrl = data.video[0];
        const title = data.title;

        if (!thumbnailLink || !videoUrl) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving TikTok post details.'
            });
        }

        // کوتاه کردن لینک‌ها با TinyURL
        const shortThumbnailLink = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(thumbnailLink)}`);
        const shortVideoUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoUrl)}`);

        // ساختار JSON و استفاده از JSON.stringify برای ارسال خروجی
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "video", // نوع محتوا
                apikey: apikey, // کلید API
                title: title,
                url: url, // URL اصلی
                thumbnail: shortThumbnailLink.data, // لینک کوتاه‌شده تصویر بندانگشتی
                video_url: shortVideoUrl.data // لینک کوتاه‌شده ویدیو
            }]
        };

        // ارسال پاسخ با استفاده از JSON.stringify و مرتب‌سازی آن
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//YTMP4 DL
app.get('/api/downloader/ytmp4', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    try {
        // دریافت اطلاعات ویدیو از YouTube
        const data = await youtube(url);

        if (!data || !data.mp4) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving YouTube video details.'
            });
        }

        const mp4TinyUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.mp4)}`);

        // ساختار JSON برای پاسخ
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "video",
                apikey: apikey,
                quality: "480p",
                title: data.title, // عنوان ویدیو
                url: data.url, // URL اصلی
                views: data.views, // تعداد بازدید
                duration: data.duration, // مدت زمان ویدیو
                thumbnail: data.thumbnail, // تصویر بندانگشتی
                downloa_url: mp4TinyUrl.data // لینک کوتاه شده فایل ویدیویی
            }]
        };

        // ارسال پاسخ JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//YTMP3 YOUTUBE
app.get('/api/downloader/ytmp3', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    try {
        // دریافت اطلاعات ویدیو از YouTube
        const data = await youtube(url);

        if (!data || !data.mp4) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving YouTube video details.'
            });
        }

        // کوتاه کردن لینک‌های mp3 و mp4
        const mp3TinyUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.mp3)}`);
        
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "audio", // نوع محتوا
                apikey: apikey, // کلید API
                quality: "128kbps",
                title: data.title, // عنوان ویدیو
                url: data.url, // URL اصلی
                views: data.views, // تعداد بازدید
                duration: data.duration, // مدت زمان ویدیو
                thumbnail: data.thumbnail, // تصویر بندانگشتی
                downloa_url: mp3TinyUrl.data // لینک کوتاه شده فایل ویدیویی
            }]
        };

        // ارسال پاسخ JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//PLAY COMMAND API
app.get('/api/downloader/play', async (req, res) => {
    const text = req.query.text; // دریافت متن جستجو از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!text || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'Text and API key are required.'
        });
    }

    try {
        // جستجو در یوتیوب با استفاده از ytsearch
        const searchResults = await ytSearch(text);
        const firstResult = searchResults.all[0]; // دریافت اولین نتیجه از جستجو

        if (!firstResult) {
            return res.status(500).json({
                status: false,
                message: 'No results found for the search query.'
            });
        }

        const videoUrl = firstResult.url; // URL ویدیو
        const data = await youtube(videoUrl); // دریافت اطلاعات ویدیو از YouTube

        if (!data || !data.mp4) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving YouTube video details.'
            });
        }

        // کوتاه کردن لینک‌های mp3 و mp4
        const mp3TinyUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.mp3)}`);
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "play-audio", // نوع محتوا
                apikey: apikey, // کلید API
                quality: "128kbps",
                title: data.title, // عنوان ویدیو
                url: data.url, // URL اصلی
                views: data.views, // تعداد بازدید
                duration: data.duration, // مدت زمان ویدیو
                thumbnail: data.thumbnail, // تصویر بندانگشتی
                download_url: mp3TinyUrl.data // لینک کوتاه شده فایل ویدیویی
            }]
        };

        // ارسال پاسخ JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//XNXX SEARCH
app.get('/api/search/xnxx-search', async (req, res) => {
  const apikey = req.query.apikey;
  const searchText = req.query.text;

  // بررسی وجود کلید API و مقدار متنی
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      result: 'Invalid or missing API key.'
    });
  }

  if (!searchText) {
    return res.status(400).json({
      status: false,
      result: 'No search text provided.'
    });
  }

  try {
    // تابع جستجو در xnxx
    const result = await xnxxSearch(searchText);

    // ارسال نتیجه به صورت JSON با فرمت مورد نظر
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: result.status,
      creator: result.creator,
      result: result.result.map((item, index) => {
        if (index === 0) {
          return {
            type: 'video',
            apikey: apikey,
            title: item.title,
            link: item.link
          };
        } else {
          return {
            title: item.title,
            link: item.link
          };
        }
      }),
    }, null, 2));  // استفاده از 4 فاصله برای فرمت JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      result: 'Error fetching data.',
      error: error.message
    });
  }
});

// تابع جستجو در xnxx
async function xnxxSearch(query) {
  const response = await fetch(`https://www.xnxx.com/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {
    'method': 'get'
  });

  const body = await response.text();
  const $ = cheerio.load(body);
  let result = [];

  $("div.mozaique").each((index, element) => {
    const links = $(element).find("div.thumb a").map((_, el) => "https://www.xnxx.com" + $(el).attr('href').replace("/THUMBNUM/", '/')).get();
    const titles = $(element).find("div.thumb-under a").map((_, el) => $(el).attr("title")).get();
    
    for (let i = 0; i < links.length; i++) {
      result.push({
        title: titles[i],
        link: links[i]
      });
    }
  });

  return {
    status: true,
    creator: 'Nothing-Ben',
    result: result
  };
}
//XNXX DOWNLOAD
app.get('/api/downloader/xnxx-dl', async (req, res) => {
  const apikey = req.query.apikey;
  const videoUrl = req.query.url;

  // بررسی کلید API و آدرس ویدئو
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      result: 'Invalid or missing API key.'
    });
  }

  if (!videoUrl) {
    return res.status(400).json({
      status: false,
      result: 'No video URL provided.'
    });
  }

  try {
    // اجرای تابع xnxxdl برای استخراج داده‌ها
    const result = await xnxxdl(videoUrl);

    // ارسال خروجی در فرمت JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: 'Nothing-Ben',
      result: {
        type: 'video',
        title: result.title,
        duration: result.duration,
        quality: result.quality,
        thumb: result.thumb,
        size: result.size,
        download_link: result.url_dl
      }
    }, null, 2)); // فرمت JSON با فاصله 4
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      result: 'Error processing download request.',
      error: error.message
    });
  }
});

// تابع xnxxdl برای استخراج اطلاعات ویدئو
async function xnxxdl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $("meta[property=\"og:title\"]").attr('content');
    const duration = $("span.metadata").text().replace(/\n/gi, '').split("\t\t\t\t\t")[1]?.split(/-/)[0]?.trim();
    const quality = $("span.metadata").text().trim().split("- ")[1]?.replace(/\t\t\t\t\t/, '');
    const thumb = $("meta[property=\"og:image\"]").attr("content");
    const scriptContent = $("#video-player-bg > script:nth-child(6)").html();
    const url_dl = (scriptContent.match(/html5player\.setVideoUrlHigh'([^']+)'/) || [])[1];
    const size = await getFileSize(url_dl);

    const sizeB = parseFloat(size) * (/GB/i.test(size) ? 1048576 : /MB/i.test(size) ? 1024 : /KB/i.test(size) ? 1 : /bytes?/i.test(size) ? 0.001 : /B/i.test(size) ? 0.1 : 0);

    return {
      title,
      duration,
      quality,
      thumb,
      size,
      sizeB,
      url_dl
    };
  } catch (error) {
    throw error;
  }
}

// تابع برای دریافت حجم فایل
async function getFileSize(url) {
  try {
    const response = await axios.head(url);
    const sizeInBytes = response.headers['content-length'];
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  } catch (error) {
    return 'Unknown size';
  }
}
/// SEARCH YOUTUBE API with API key
app.get('/api/search/yt-search', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const query = req.query.text; // دریافت متن جستجو

    // بررسی کلید API و محدودیت‌های آن
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Limit exceeded for this key.'
        });
    }

    // بررسی عدم ارسال query
    if (!query) {
        return res.status(400).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'No search query provided.'
        });
    }

    // افزایش مقدار `used` و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    try {
        // جستجوی ویدیوها در یوتیوب
        const results = await ytSearch(query);
        const videos = results.videos
            .sort((a, b) => b.views - a.views) // مرتب‌سازی بر اساس تعداد بازدید
            .slice(0, 9) // انتخاب 3 نتیجه اول
            .map(video => ({
                type: "video",
                apikey: apikey, // کلید API
                videoId: video.videoId,
                url: video.url,
                title: video.title,
                description: video.description || "", // توضیحات ویدیو
                image: video.thumbnail, // لینک تصویر بندانگشتی
                thumbnail: video.thumbnail, // لینک تصویر بندانگشتی
                seconds: video.duration.seconds || 0, // مدت زمان بر حسب ثانیه
                timestamp: video.duration.timestamp || "0:00", // مدت زمان در قالب hh:mm:ss
                duration: video.duration, // شیء مدت زمان
                ago: video.ago, // تاریخ انتشار (مثلاً "1 year ago")
                views: video.views, // تعداد بازدید
                author: {
                    name: video.author.name, // نام کانال
                    url: video.author.url // لینک کانال
                }
            }));

        // ارسال JSON مرتب‌شده
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: videos
        }, null, 2)); // JSON با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Error fetching YouTube search API',
            error: err.message
        });
    }
});
//NPM SEARCH
async function npmSearch(packageName) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const { name, description } = response.data;
    const latestVersion = response.data['dist-tags'].latest;
    const packageLink = `https://www.npmjs.com/package/${name}`;
    const downloadLink = `https://registry.npmjs.org/${name}/-/${name}-${latestVersion}.tgz`;
    
    const packagePage = await axios.get(packageLink);
    const $ = cheerio.load(packagePage.data);
    const publishedDate = $("time").first().text();
    const owner = response.data.maintainers[0].name;
    const keywords = response.data.keywords;
    const homepage = response.data.homepage;
    const license = response.data.license;
    const dependencies = response.data.dependencies;
    const readme = $("div[class='markdown']").html();

    return {
      name,
      description,
      version: latestVersion,
      packageLink,
      downloadLink,
      publishedDate,
      owner,
      keywords,
      homepage,
      license,
      dependencies,
      readme
    };
  } catch (error) {
    throw "Error while fetching package information.";
  }
}

// API route for searching npm package
app.get('/api/search/npm-search', async (req, res) => {
  const apikey = req.query.apikey; // دریافت کلید API
  const query = req.query.text; // دریافت متن جستجو

  // بررسی کلید API و محدودیت‌های آن
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  // بررسی عدم ارسال query
  if (!query) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No search query provided.'
    });
  }

  // افزایش مقدار `used` و ذخیره‌سازی
  keyData.used += 1;

  try {
    const result = await npmSearch(query);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: 'Nothing-Ben',
      result: {
        type: "npm-package",
        apikey: apikey,
        name: result.name,
        description: result.description,
        version: result.version,
        packageLink: result.packageLink,
        downloadLink: result.downloadLink,
        publishedDate: result.publishedDate,
        owner: result.owner,
        keywords: result.keywords,
        homepage: result.homepage,
        license: result.license,
        dependencies: result.dependencies,
        readme: result.readme
      }
    }, null, 2)); // JSON با فاصله 4
  } catch (error) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching npm package data',
      error: error
    });
  }
});
//COMPLETE ✅
//PORN HUB SEARCH
async function phSearch(query) {
  try {
    const response = await fetch("https://www.pornhub.com/video/search?search=" + query);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];

    $("li[data-video-segment]").each((index, element) => {
      if (index < 15) {
        const videoLink = $(element).find(".title a").attr("href").trim();
        const videoTitle = $(element).find(".title a").text().trim();
        const uploader = $(element).find(".videoUploaderBlock a").text().trim();
        const views = $(element).find('.views').text().trim().replace("views", '');
        const duration = $(element).find(".duration").text().trim();
        
        results.push({
          link: "https://www.pornhub.com" + videoLink,
          title: videoTitle,
          uploader: uploader,
          views: views,
          duration: duration
        });
      }
    });
    
    if (results.length === 0) {
      return { status: false, message: 'No results found' };
    }

    return { status: true, results: results };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

app.get('/api/search/ph-search', async (req, res) => {
  const apikey = req.query.apikey; // دریافت کلید API
  const query = req.query.text; // دریافت متن جستجو

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!query) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No search query provided.'
    });
  }

  keyData.used += 1;

  try {
    const result = await phSearch(query);

    if (!result.status) {
      return res.status(200).json({
        status: false,
        creator: 'Nothing-Ben',
        result: result.message
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({
      status: true,
      creator: 'Nothing-Ben',
      result: result.results
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching search results',
      error: error.message
    });
  }
});
//SWEB CAPTURE 3 MERHOD
//1 FULL
app.get('/api/tools/ssweb-full', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // درخواست به Google PageSpeed API برای اسکرین‌شات کامل
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//2 DESKTOP
app.get('/api/tools/ssweb-pc', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // شبیه‌سازی دسکتاپ
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}&strategy=desktop`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//3 PHONE
app.get('/api/tools/ssweb-phone', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // شبیه‌سازی موبایل
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}&strategy=mobile`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//4 TABLET
app.get('/api/tools/ssweb-tablet', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // شبیه‌سازی تبلت
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}&strategy=desktop`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//FONT TXT
app.get('/api/tools/font-txt', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const text = req.query.text;      // دریافت متن

  // بررسی کلید API و محدودیت‌های آن
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  // بررسی عدم ارسال query
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No text provided.'
    });
  }

  // افزایش مقدار `used` و ذخیره‌سازی
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // درخواست برای تبدیل متن به فونت‌های مختلف
    const response = await axios.get(`http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text)}`);
    const $ = cheerio.load(response.data);
    const fonts = [];

    // استخراج فونت‌ها از صفحه
    $("table > tbody > tr").each((index, element) => {
      fonts.push({
        name: $(element).find("td:nth-child(1) > span").text(),
        result: $(element).find("td:nth-child(2)").text().trim(),
      });
    });

    // ارسال خروجی به صورت JSON با استفاده از JSON.stringify
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: 'Nothing-Ben',
      type: "font",
      apikey: apikey, // کلید API
      result: fonts,
    }, null, 2));  // فرمت‌بندی JSON با فاصله 4

  } catch (error) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching font conversion.',
      error: error.message
    });
  }
});
//QR CODE MAKER
app.get('/api/tools/qrcode', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const text = req.query.text; // متن برای تولید QR Code

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            result: 'API key usage limit exceeded.'
        });
    }

    if (!text) {
        return res.status(400).json({
            status: false,
            result: 'No text provided.'
        });
    }

    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
        
        // درخواست تصویر QR Code
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // ارسال تصویر
        res.setHeader('Content-Type', 'image/png');
        res.send(response.data);
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error generating QR code.',
            error: err.message
        });
    }
});
// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
