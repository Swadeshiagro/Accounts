// স্বদেশী এগ্রো — সেটিংস
// Firebase না বসালে অ্যাপ চলবে, কিন্তু প্রতিটি ফোনে ডাটা আলাদা থাকবে।
// সিফাত ও সাগর একই ডাটা দেখবেন: README.md-এর ধাপ ২ করে নিচের firebase অংশ বসান।
// পাসওয়ার্ড এখানে লেখা নেই, Firebase-এ থাকে।
window.APP_CONFIG = {
  owner: "sifat@swadeshi-agro.app",
  users: {
    "সিফাত": "sifat@swadeshi-agro.app",
    "সাগর": "sagar@swadeshi-agro.app"
  },
  deletePassword: "123456",           // কিছু মুছতে এই পাসওয়ার্ড লাগবে, বদলে নিন
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
