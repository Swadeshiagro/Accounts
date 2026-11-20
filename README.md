# স্বদেশী এগ্রো — খামার ম্যানেজমেন্ট অ্যাপ

ডিম, ইনকিউবেটর, বাচ্চা, মুরগি, ওজন, খাবার, ওষুধ-ভ্যাক্সিন ও হিসাব — সব এক অ্যাপে। ফোনে ইনস্টল করে ব্যবহার করা যায় (PWA)।

## ধাপ ১: গিটহাবে পাবলিক করুন (৫ মিনিট)

1. github.com এ নতুন Repository খুলুন (যেমন `swadeshi-agro`), **Public** রাখুন।
2. **Add file → Upload files** চেপে এই ফোল্ডারের সব ফাইল ও `icons` ফোল্ডার আপলোড করুন, তারপর **Commit**।
3. **Settings → Pages → Branch: main / (root) → Save**।
4. ১–২ মিনিট পর লিংক হবে: `https://আপনার-ইউজারনেম.github.io/swadeshi-agro/`

এই পর্যন্ত করলেই অ্যাপ চলবে, তবে প্রতিটি ফোনে ডাটা আলাদা থাকবে।

## ধাপ ২: সিফাত ও সাগর একই ডাটা দেখবেন (ফ্রি Firebase)

1. console.firebase.google.com → **Add project** (Analytics বন্ধ রাখতে পারেন)।
2. **Build → Firestore Database → Create database** (Production mode, কাছের লোকেশন)।
3. **Build → Authentication → Get started → Email/Password → Enable → Save**।
4. Authentication → **Users → Add user** দিয়ে দুজনকে যোগ করুন:
   - ইমেইল `sifat@swadeshi-agro.app`, পাসওয়ার্ড: সিফাতের পাসওয়ার্ড
   - ইমেইল `sagar@swadeshi-agro.app`, পাসওয়ার্ড: সাগরের পাসওয়ার্ড

   (এটা আসল ইমেইল না, শুধু ভেতরের নাম। অ্যাপে ঢোকার সময় নাম বেছে পাসওয়ার্ড দিলেই হবে।)
5. Firestore → **Rules** ট্যাবে `firestore.rules`-এর লেখা পেস্ট করে **Publish**।
6. Project settings (⚙️) → **Your apps → Web (</>)** → রেজিস্টার করলে যে `firebaseConfig` দেখাবে, সেটা `config.js`-এর `firebase` অংশে বসান। গিটহাবে Commit করুন।

লিংক খুললে নাম বেছে পাসওয়ার্ড দিয়ে ঢুকবেন। দুজনের এন্ট্রি একই জায়গায় জমবে ও সাথে সাথে দুজনেই দেখবেন। পাসওয়ার্ড কোডে নেই, কেবল Firebase-এ থাকে।

## ফোনে ইনস্টল

- **Android (Chrome):** মেনু (⋮) → *Install app* / *Add to Home screen*
- **iPhone (Safari):** Share → *Add to Home Screen*

## জেনে রাখুন

- গিটহাব পাবলিক হলেও আপনার খামারের ডাটা পাবলিক নয়, ডাটা থাকে Firebase-এ, rules দিয়ে বন্ধ।
- `config.js`-এর Firebase key গোপন জিনিস নয়, সমস্যা নেই। সুরক্ষা আসে rules থেকে।
- মোছার পাসওয়ার্ড `config.js`-এ `deletePassword` এ বদলে নিন (পাবলিক রিপোতে ডিফল্ট `123456` সবাই দেখতে পাবে)।
- Claude-কে প্রশ্ন করার বক্সটি শুধু Claude-এর ভেতরে চলত, তাই এখানে দেখাবে না। বাকি সব ফিচার একই আছে।
- অ্যাপ আপডেট করলে `sw.js`-এর `VERSION` বাড়িয়ে দিন।
