function measure(text: string, reuseMirror: boolean): [number, number] {
  const last = 2 * text.length;
  const radius = reuseMirror ? Array<number>(last + 1).fill(0) : [];
  let center = 0, right = 0, probes = 0, count = 0;
  for (let i = 0; i <= last; i++) {
    let length = reuseMirror && i < right ? Math.min(radius[2 * center - i], right - i) : 0;
    while (i - length > 0 && i + length < last) {
      probes++;
      const left = i - length - 1, next = i + length + 1;
      if (left % 2 && text[(left - 1) / 2] !== text[(next - 1) / 2]) break;
      length++;
    }
    if (reuseMirror) {
      radius[i] = length;
      if (i + length > right) {
        center = i;
        right = i + length;
      }
    }
    count += Math.floor((length + 1) / 2);
  }
  return [probes, count];
}

const n = 1000;
const text = "a".repeat(n);
for (const reuseMirror of [false, true]) {
  const [probes, count] = measure(text, reuseMirror);
  if (count !== n * (n + 1) / 2) throw new Error("Sai số đoạn đối xứng");
  console.log(`${reuseMirror ? "Manacher" : "Mở từ tâm"}: ${probes} lượt dò, ${count} đoạn`);
}
console.log("2/2 ca đúng");
