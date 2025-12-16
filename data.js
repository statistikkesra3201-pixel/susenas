import { uuid } from "uuidv4";
export const data = [
  {
    _id: 1,
    kategori: "Imunisasi",
    nama: "Hepatitis B",
    biaya: 120000,
    is_created_by_user: false,
  },
  {
    _id: 2,
    kategori: "Imunisasi",
    nama: "BCG",
    biaya: 375000,

    is_created_by_user: false,
  },
  {
    _id: 3,
    kategori: "Imunisasi",
    nama: "Polio Tetes",
    biaya: 125000,

    is_created_by_user: false,
  },
  {
    _id: 4,
    kategori: "Imunisasi",
    nama: "Polio Suntik (IPV)",
    biaya: 300000,

    is_created_by_user: false,
  },
  {
    _id: 5,
    kategori: "Imunisasi",
    nama: "DPT Hib Hb",
    biaya: 350000,

    is_created_by_user: false,
  },
  {
    _id: 6,
    kategori: "Imunisasi",
    nama: "Campak Rubella",
    biaya: 155000,

    is_created_by_user: false,
  },
  {
    _id: 7,
    kategori: "Imunisasi",
    nama: "MMR",
    biaya: 475000,

    is_created_by_user: false,
  },
  {
    _id: 8,
    kategori: "Listrik",
    nama: "450 VA",
    biaya: 0,

    is_created_by_user: false,
  },
  {
    _id: 9,
    kategori: "Listrik",
    nama: "900 VA",
    biaya: 1352,

    is_created_by_user: false,
  },
  {
    _id: 10,
    kategori: "Listrik",
    nama: "1300 VA",
    biaya: 1445,

    is_created_by_user: false,
  },
  {
    _id: 11,
    kategori: "Listrik",
    nama: "2200 VA",
    biaya: 1445,

    is_created_by_user: false,
  },
  {
    _id: 12,
    kategori: "Listrik",
    nama: "3500-5500 VA",
    biaya: 1670,

    is_created_by_user: false,
  },
  {
    _id: 13,
    kategori: "Listrik",
    nama: ">6600 VA",
    biaya: 1445,

    is_created_by_user: false,
  },
  {
    _id: 14,
    kategori: "BPJS",
    nama: "Kelas 1",
    biaya: 150000,

    is_created_by_user: false,
  },
  {
    _id: 15,
    kategori: "BPJS",
    nama: "Kelas 2",
    biaya: 100000,

    is_created_by_user: false,
  },
  {
    _id: 16,
    kategori: "BPJS",
    nama: "Kelas 3",
    biaya: 42000,

    is_created_by_user: false,
  },
  {
    _id: 17,
    kategori: "Pendidikan (BOS)",
    nama: "SD",
    biaya: 950000,

    is_created_by_user: false,
  },
  {
    _id: 18,
    kategori: "Pendidikan (BOS)",
    nama: "SMP",
    biaya: 1190000,

    is_created_by_user: false,
  },
  {
    _id: 19,
    kategori: "Pendidikan (BOS)",
    nama: "SMA",
    biaya: 1620000,

    is_created_by_user: false,
  },
  {
    _id: 20,
    kategori: "Pendidikan (BOS)",
    nama: "SMK",
    biaya: 1730000,

    is_created_by_user: false,
  },
  {
    _id: 21,
    kategori: "Pendidikan (BOS)",
    nama: "SLB",
    biaya: 3750000,

    is_created_by_user: false,
  },
];

export const getData = () => {
  return JSON.parse(localStorage.getItem("data"));
};

export const getDataById = (id) => {
  const data = JSON.parse(localStorage.getItem("data"));
  return data.filter((item) => item._id == id);
};

export const updateDataById = (updatedData) => {
  let data = getData();
  const remappedData = {
    _id: updatedData._id,
    kategori: updatedData.kategori,
    nama: updatedData.nama,
    biaya: updatedData.biaya,
    is_created_by_user: true,
  };
  // console.log("data", data);
  if (!data) {
    data = [];
  }
  const res = data.map((item) => {
    if (item._id === updatedData._id) {
      return { ...remappedData };
    }
    return item;
  });

  if (typeof Storage !== "undefined" && updatedData.is_created_by_user) {
    localStorage.setItem("data", JSON.stringify(res));
  }
  return updatedData;
};

export const addData = (kategori, nama, biaya) => {
  const newData = {
    _id: uuid(),
    kategori,
    nama,
    biaya,
    is_created_by_user: true,
  };
  let res = [newData];
  if (typeof Storage !== "undefined") {
    const customData = getData();
    if (customData && customData.length > 0) {
      res = [...customData, ...res];
    }
    localStorage.setItem("data", JSON.stringify(res));
  }
  return { ...newData, is_checked: true, is_filtered: false, amount: 1 };
};

export const deleteData = (id) => {
  const data = getData();
  const res = data.filter((item) => item._id != id);
  if (typeof Storage !== "undefined") {
    localStorage.setItem("data", JSON.stringify(res));
    // return JSON.parse(localStorage.getItem("data"));
  }
  // else {
  //   return res;
  // }
};
