import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const prizes = [
  "iPhone 15",
  "หูฟังไร้สาย",
  "Gift Voucher 500 บาท",
  "Power Bank",
  "เสื้อยืดแบรนด์",
  "ขอบคุณที่ร่วมสนุก",
  "แก้วน้ำลายพิเศษ",
  "กระเป๋าผ้า",
];

const colors = ["#fda4af", "#fcd34d", "#a5b4fc", "#6ee7b7", "#f9a8d4", "#fdba74", "#93c5fd", "#c4b5fd"];

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const spin = () => {
    if (spinning || !name || !phone) return;

    setSpinning(true);
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const degreesPerSegment = 360 / prizes.length;
    const newRotation = 360 * 5 + (360 - prizeIndex * degreesPerSegment);

    setRotation((prev) => prev + newRotation);
    setTimeout(() => {
      const prize = prizes[prizeIndex];
      setSelectedPrize(prize);
      setHistory((prev) => [
        `${name} (${phone}): ${prize}`,
        ...prev
      ]);
      setSpinning(false);
    }, 4000);
  };

  const shareResult = () => {
    if (!selectedPrize) return;
    const text = `ฉันได้รับ '${selectedPrize}' จากการหมุนวงล้อเสี่ยงโชค ลองเล่นกันดูสิ! 🎁`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "วงล้อเสี่ยงโชค 🎉",
        text,
        url,
      });
    } else {
      alert("อุปกรณ์ของคุณไม่รองรับการแชร์อัตโนมัติ ลองคัดลอกลิงก์แทนได้เลย!\n" + url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 p-4">
      <h1 className="text-3xl font-extrabold mb-4 text-pink-600">🎁 วงล้อเสี่ยงโชค 🎡</h1>

      <div className="bg-white p-4 rounded-lg shadow w-full max-w-md mb-4 space-y-3">
        <input
          className="w-full border rounded p-2 text-sm"
          placeholder="ชื่อของคุณ"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 text-sm"
          placeholder="เบอร์โทรศัพท์"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="relative w-80 h-80 border-[10px] border-pink-300 rounded-full shadow-xl overflow-hidden">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: "easeOut" }}
          style={{ originX: "50%", originY: "50%" }}
        >
          <div className="absolute w-full h-full grid grid-cols-1 grid-rows-[repeat(8,1fr)] rotate-[-22.5deg]">
            {prizes.map((prize, i) => (
              <div
                key={i}
                className="flex items-center justify-center text-xs text-white font-bold text-center px-2 py-1"
                style={{
                  transform: `rotate(${i * (360 / prizes.length)}deg) translateY(-50%)`,
                  transformOrigin: "center bottom",
                  backgroundColor: colors[i % colors.length],
                }}
              >
                {prize}
              </div>
            ))}
          </div>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[55%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-red-500 z-10" />
      </div>

      <div className="mt-6">
        <button onClick={spin} disabled={spinning || !name || !phone} className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded">
          {spinning ? "กำลังหมุน..." : "หมุนวงล้อ"}
        </button>
      </div>

      {selectedPrize && !spinning && (
        <>
          <div className="mt-4 text-xl font-bold text-green-600 text-center">
            🎉 คุณได้รับ: {selectedPrize} 🎉
          </div>
          <button onClick={shareResult} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            แชร์ผลลัพธ์
          </button>
        </>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-lg font-bold text-pink-700 mb-2">ประวัติการหมุน</h2>
          <ul className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
            {history.map((item, idx) => (
              <li key={idx} className="text-gray-700">{idx + 1}. {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}