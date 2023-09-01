import axios from 'axios';
import cheerio from 'cheerio';
import { download } from 'aptoide-scraper';

let handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  try {
    if (command === 'apk') {
      if (!text) throw `*المرجو كتابة إسم التطبيق الذي تود تحميله يا صديقي.*\nم\n`;

      await conn.reply(m.chat, global.wait, m);
      let data = await download(text);

      if (data.size.replace(' MB', '') > 400) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] The file is too large.*' }, { quoted: m });
      }

      if (data.size.includes('GB')) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] The file is too large.*' }, { quoted: m });
      }

      // يتم إرسال صورة التطبيق
      if (data.icon) {
        const iconBuffer = await axios.get(data.icon, { responseType: 'arraybuffer' });
        await conn.sendFile(m.chat, Buffer.from(iconBuffer.data), 'app-icon.jpg', `*تطبيق:* ${data.name}\n*الوصف:* ${data.desc}\n*التصنيف:* ${data.category}\n*التقييم:* ${data.rating}\n*الإصدار:* ${data.version}`, m);
      }

      // يتم إرسال رابط التحميل
      await conn.sendMessage(
        m.chat,
        { document: { url: data.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: data.name + '.apk', caption: null },
        { quoted: m }
      );
    }
  } catch (error) {
    throw `*هدا تطبيق او لعبة غير موجود/ة*\n${error.message}`;
  }
};

handler.command = /^apk$/i;
handler.help = ['apk [اسم التطبيق]', 'apk [رابط التطبيق]'];
handler.desc = 'تنزيل تطبيق APK من مصدر معين.';
export default handler;
          
