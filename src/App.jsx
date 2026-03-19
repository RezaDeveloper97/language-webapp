import { useState } from "react";

const categories = [
{
id: "price",
icon: "💰",
title: "قیمت و چانه‌زنی",
color: "#f59e0b",
phrases: [
{ fa: "این چنده؟", en: "How much is this?", pronounce: "هاو ماچ ایز دیس؟" },
{ fa: "خیلی گرونه", en: "It's too expensive", pronounce: "ایتس تو اِکسپِنسیو" },
{ fa: "تخفیف میدی؟", en: "Can you give me a discount?", pronounce: "کَن یو گیو می اِ دیسکاونت؟" },
{ fa: "قیمت نهاییته؟", en: "Is this your best price?", pronounce: "ایز دیس یور بِست پرایس؟" },
{ fa: "قبوله، میگیرمش", en: "Deal! I'll take it.", pronounce: "دیل! آیل تِیک ایت" },
{ fa: "نه ممنون", en: "No thanks", pronounce: "نو تَنکس" },
],
},
{
id: "taxi",
icon: "🚕",
title: "تاکسی / Grab",
color: "#10b981",
phrases: [
{ fa: "به این آدرس میری؟", en: "Can you take me to this address?", pronounce: "کَن یو تِیک می تو دیس اَدرِس؟" },
{ fa: "کنتور داری؟", en: "Do you use the meter?", pronounce: "دو یو یوز د میتِر؟" },
{ fa: "چقدر میشه تا…؟", en: "How much to go to…?", pronounce: "هاو ماچ تو گو تو…؟" },
{ fa: "اینجا پیاده میشم", en: "Please stop here", pronounce: "پلیز استاپ هیر" },
{ fa: "سریع‌تر لطفاً", en: "A bit faster please", pronounce: "اِ بیت فَستِر پلیز" },
{ fa: "آروم‌تر لطفاً", en: "A bit slower please", pronounce: "اِ بیت اِسلوِر پلیز" },
{ fa: "منتظرم بمون", en: "Please wait for me", pronounce: "پلیز وِیت فور می" },
{ fa: "یه کم گرمه", en: "It's a bit hot", pronounce: "ایتس اِ بیت هات" },
],
},
{
id: "hotel",
icon: "🏨",
title: "هتل",
color: "#6366f1",
phrases: [
{ fa: "رزرو دارم", en: "I have a reservation", pronounce: "آی هَو اِ رِزِرویشن" },
{ fa: "اتاق داری؟", en: "Do you have available rooms?", pronounce: "دو یو هَو اِویلِبِل رومز؟" },
{ fa: "اتاق یه نفره", en: "A single room", pronounce: "اِ سینگل روم" },
{ fa: "اتاق دو نفره", en: "A double room", pronounce: "اِ داِبل روم" },
{ fa: "صبحانه داره؟", en: "Does it include breakfast?", pronounce: "داز ایت اینکلود بِرِکفِست؟" },
{ fa: "چک‌این چه ساعتیه؟", en: "What time is check-in?", pronounce: "واِت تایم ایز چِک-این؟" },
{ fa: "زود چک‌این میشه؟", en: "Can I check in early?", pronounce: "کَن آی چِک این اِرلی؟" },
{ fa: "رمز وای‌فای چیه؟", en: "What's the WiFi password?", pronounce: "واِتس د وای‌فای پَسوِرد؟" },
{ fa: "کلیدم توی اتاق جا موند", en: "I locked myself out", pronounce: "آی لاکت مای‌سِلف اِوت" },
{ fa: "اتاقم رو تمیز کنین", en: "Please clean my room", pronounce: "پلیز کلین مای روم" },
],
},
{
id: "restaurant",
icon: "🍜",
title: "رستوران",
color: "#ef4444",
phrases: [
{ fa: "منو لطفاً", en: "Can I see the menu please?", pronounce: "کَن آی سی د مِنیو پلیز؟" },
{ fa: "اینو توصیه میکنی؟", en: "Do you recommend this?", pronounce: "دو یو رِکِمِند دیس؟" },
{ fa: "تند نباشه", en: "Not spicy please", pronounce: "نات اِسپایسی پلیز" },
{ fa: "بدون گوشت خوک", en: "No pork please", pronounce: "نو پورک پلیز" },
{ fa: "حلاله؟", en: "Is it halal?", pronounce: "ایز ایت هَلال؟" },
{ fa: "آب ساده لطفاً", en: "Plain water please", pronounce: "پِلین واتِر پلیز" },
{ fa: "فاکتور لطفاً", en: "Bill please", pronounce: "بیل پلیز" },
{ fa: "جدا جدا حساب", en: "Separate bills please", pronounce: "سِپِریت بیلز پلیز" },
{ fa: "خیلی خوشمزه بود!", en: "It was delicious!", pronounce: "ایت واز دِلیشِس!" },
],
},
{
id: "shopping",
icon: "🛍️",
title: "خرید",
color: "#ec4899",
phrases: [
{ fa: "فقط نگاه میکنم", en: "Just looking, thanks", pronounce: "جاِست لوکینگ، تَنکس" },
{ fa: "سایز داری؟", en: "Do you have my size?", pronounce: "دو یو هَو مای سایز؟" },
{ fa: "اتاق پرو کجاست؟", en: "Where is the fitting room?", pronounce: "وِر ایز د فیتینگ روم؟" },
{ fa: "رنگ دیگه داری؟", en: "Do you have another color?", pronounce: "دو یو هَو اِنادِر کالِر؟" },
{ fa: "این رو برمیگردونم", en: "I'd like to return this", pronounce: "آید لایک تو ریتِرن دیس" },
{ fa: "کیسه داری؟", en: "Do you have a bag?", pronounce: "دو یو هَو اِ بَگ؟" },
],
},
{
id: "emergency",
icon: "🚨",
title: "اورژانس و مهم",
color: "#dc2626",
phrases: [
{ fa: "کمک!", en: "Help!", pronounce: "هِلپ!" },
{ fa: "با اورژانس تماس بگیر", en: "Call an ambulance!", pronounce: "کال اَن اَمبیولِنس!" },
{ fa: "پلیس بخواه", en: "Call the police!", pronounce: "کال د پُلیس!" },
{ fa: "گم شدم", en: "I'm lost", pronounce: "آیم لاست" },
{ fa: "کیفم دزدیده شد", en: "My bag was stolen", pronounce: "مای بَگ واز استولِن" },
{ fa: "حالم خوب نیست", en: "I don't feel well", pronounce: "آی دونت فیل وِل" },
{ fa: "بیمارستان کجاست؟", en: "Where is the hospital?", pronounce: "وِر ایز د هاسپیتِل؟" },
{ fa: "داروخانه کجاست؟", en: "Where is the pharmacy?", pronounce: "وِر ایز د فارمِسی؟" },
],
},
{
id: "general",
icon: "🗣️",
title: "روزمره عمومی",
color: "#0ea5e9",
phrases: [
{ fa: "سلام", en: "Hello!", pronounce: "هِلو!" },
{ fa: "خداحافظ", en: "Goodbye!", pronounce: "گودبای!" },
{ fa: "ممنون", en: "Thank you", pronounce: "تَنک یو" },
{ fa: "خواهش میکنم", en: "You're welcome", pronounce: "یور وِلکِم" },
{ fa: "ببخشید", en: "Excuse me", pronounce: "اِکسکیوز می" },
{ fa: "متوجه نشدم", en: "I don't understand", pronounce: "آی دونت آندِراِستَند" },
{ fa: "آروم‌تر بگو لطفاً", en: "Please speak slowly", pronounce: "پلیز اِسپیک اِسلولی" },
{ fa: "دوباره بگو", en: "Could you repeat that?", pronounce: "کود یو ریپیت دَت؟" },
{ fa: "انگلیسیم ضعیفه", en: "My English is not very good", pronounce: "مای اینگلیش ایز نات وِری گود" },
{ fa: "چطوری؟", en: "How are you?", pronounce: "هاو آر یو؟" },
{ fa: "خوبم، ممنون", en: "I'm fine, thank you", pronounce: "آیم فاین، تَنک یو" },
{ fa: "اسمت چیه؟", en: "What's your name?", pronounce: "واِتس یور نِیم؟" },
{ fa: "اسمم … هست", en: "My name is …", pronounce: "مای نِیم ایز …" },
],
},
{
id: "manglish",
icon: "🇲🇾",
title: "Manglish — لهجه مالزی",
color: "#8b5cf6",
phrases: [
{ fa: "باشه / مشکلی نیست", en: "Okay lah", pronounce: "اوکِی لا" },
{ fa: "میشه؟", en: "Can?", pronounce: "کَن؟" },
{ fa: "آره میشه", en: "Can lah", pronounce: "کَن لا" },
{ fa: "نمیشه", en: "Cannot", pronounce: "کَنات" },
{ fa: "ارزونه", en: "Very cheap lah", pronounce: "وِری چیپ لا" },
{ fa: "همینجاس", en: "Here one", pronounce: "هیر وان" },
{ fa: "بخور بخور!", en: "Makan makan!", pronounce: "ماکان ماکان! (مالایی = بیا غذا بخور)" },
],
},
];

export default function App() {
const [active, setActive] = useState("price");
const [flipped, setFlipped] = useState({});
const [search, setSearch] = useState("");

const toggle = (key) => setFlipped((p) => ({ ...p, [key]: !p[key] }));

const current = categories.find((c) => c.id === active);

const filtered = search.trim()
? categories.flatMap((cat) =>
cat.phrases
.filter(
(p) =>
p.fa.includes(search) ||
p.en.toLowerCase().includes(search.toLowerCase()) ||
p.pronounce.includes(search)
)
.map((p) => ({ ...p, catTitle: cat.title, catColor: cat.color, catIcon: cat.icon }))
)
: null;

return (
<div style={{
minHeight: "100vh",
background: "#0f0f13",
color: "#f1f1f5",
fontFamily: "'Segoe UI', Tahoma, sans-serif",
direction: "rtl",
}}>
{/* Header */}
<div style={{
background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
padding: "24px 20px 20px",
textAlign: "center",
borderBottom: "1px solid #ffffff15",
}}>
<div style={{ fontSize: 36, marginBottom: 8 }}>🇲🇾</div>
<h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
انگلیسی سفر مالزی
</h1>
<p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 13 }}>
روی هر کارت بزن تا تلفظ ببینی
</p>

    {/* Search */}
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="🔍 جستجو به فارسی یا انگلیسی..."
      style={{
        marginTop: 16,
        width: "100%",
        maxWidth: 400,
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #ffffff20",
        background: "#ffffff10",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        textAlign: "right",
        boxSizing: "border-box",
      }}
    />
  </div>

  {/* Search Results */}
  {filtered ? (
    <div style={{ padding: "16px 16px 32px" }}>
      <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
        {filtered.length} نتیجه پیدا شد
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p, i) => (
          <PhraseRow key={i} p={p} color={p.catColor} label={`${p.catIcon} ${p.catTitle}`} />
        ))}
      </div>
    </div>
  ) : (
    <>
      {/* Category Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        padding: "14px 14px 0",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active === cat.id ? 700 : 400,
              background: active === cat.id ? cat.color : "#ffffff12",
              color: active === cat.id ? "#fff" : "#94a3b8",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      {/* Phrases */}
      <div style={{ padding: "16px 14px 40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.phrases.map((p, i) => (
            <FlipCard
              key={i}
              p={p}
              color={current.color}
              isFlipped={!!flipped[`${active}-${i}`]}
              onToggle={() => toggle(`${active}-${i}`)}
            />
          ))}
        </div>
      </div>

      {/* Tip box */}
      {active === "taxi" && (
        <TipBox color="#10b981" text="💡 توی مالزی Grab خیلی بهتر از تاکسیه — قیمت ثابت، بدون چانه‌زنی!" />
      )}
      {active === "restaurant" && (
        <TipBox color="#ef4444" text="💡 بیشتر رستوران‌ها حلاله ولی رستوران‌های چینی ممکنه نباشن. مطمئن شو!" />
      )}
      {active === "manglish" && (
        <TipBox color="#8b5cf6" text="💡 Manglish = ترکیب انگلیسی + مالایی + چینی. وقتی «lah» میشنوی، یعنی داری با یه مالزیایی واقعی صحبت میکنی 😄" />
      )}
    </>
  )}
</div>

);
}

function FlipCard({ p, color, isFlipped, onToggle }) {
return (
<div
onClick={onToggle}
style={{
background: isFlipped
? `linear-gradient(135deg, ${color}22, ${color}11)`
: "#1e1e2e",
border: `1px solid ${isFlipped ? color + "55" : "#ffffff12"}`,
borderRadius: 14,
padding: "14px 16px",
cursor: "pointer",
transition: "all 0.25s",
userSelect: "none",
}}
>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 16, fontWeight: 700, color: "#f1f1f5", marginBottom: 4 }}>
{p.fa}
</div>
<div style={{ fontSize: 14, color: isFlipped ? "#e2e8f0" : "#64748b", direction: "ltr", textAlign: "right" }}>
{p.en}
</div>
{isFlipped && (
<div style={{
marginTop: 10,
padding: "8px 12px",
background: `${color}22`,
borderRadius: 8,
borderRight: `3px solid ${color}`,
}}>
<span style={{ fontSize: 11, color: color, fontWeight: 600 }}>تلفظ: </span>
<span style={{ fontSize: 14, color: "#fde68a", fontWeight: 600 }}>{p.pronounce}</span>
</div>
)}
</div>
<div style={{
marginRight: 12,
width: 28,
height: 28,
borderRadius: "50%",
background: isFlipped ? color : "#ffffff15",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 13,
flexShrink: 0,
}}>
{isFlipped ? "✓" : "👁"}
</div>
</div>
</div>
);
}

function PhraseRow({ p, color, label }) {
const [show, setShow] = useState(false);
return (
<div
onClick={() => setShow(!show)}
style={{
background: show ? `${color}15` : "#1e1e2e",
border: `1px solid ${show ? color + "44" : "#ffffff10"}`,
borderRadius: 12,
padding: "12px 14px",
cursor: "pointer",
}}
>
<div style={{ fontSize: 11, color: color, marginBottom: 4 }}>{label}</div>
<div style={{ fontSize: 15, fontWeight: 700 }}>{p.fa}</div>
<div style={{ fontSize: 13, color: "#94a3b8", direction: "ltr", textAlign: "right" }}>{p.en}</div>
{show && (
<div style={{ marginTop: 8, padding: "6px 10px", background: `${color}20`, borderRadius: 6, borderRight: `2px solid ${color}` }}>
<span style={{ fontSize: 11, color: color }}>تلفظ: </span>
<span style={{ fontSize: 13, color: "#fde68a", fontWeight: 600 }}>{p.pronounce}</span>
</div>
)}
</div>
);
}

function TipBox({ color, text }) {
return (
<div style={{
margin: "0 14px 20px",
padding: "12px 14px",
background: `${color}15`,
border: `1px solid ${color}33`,
borderRadius: 12,
fontSize: 13,
color: "#cbd5e1",
lineHeight: 1.7,
}}>
{text}
</div>
);
}