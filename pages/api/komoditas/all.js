import komoditas from "@/data/konversi_satuan.json";

export default function handler(req, res) {
  res.status(200).json({ data: komoditas });
}
