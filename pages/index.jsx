import { useEffect, useState } from "react";
import {
  IconCircleCheckFilled,
  IconCopy,
  IconCirclePlus,
  IconPencil,
  IconX,
  IconTrash,
} from "@tabler/icons-react";

import {
  addData,
  updateDataById,
  deleteData,
} from "@/data/pengeluaran";

import {
  Home as HomeCard,
  Modal as ModalCard,
  ModalCreate as ModalCreateCard,
} from "@/components/Card";

import { Modal as FormModal } from "@/components/Modal";

/* =======================
   Formatter
======================= */
const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

/* =======================
   COMPONENTS
======================= */

const SearchForm = ({ onChange }) => {
  const [value, setValue] = useState("");

  return (
    <div className="border rounded-lg bg-gray-100 w-full">
      <input
        type="text"
        placeholder="cari kategori pengeluaran"
        className="w-full px-3 py-2 rounded-md text-sm border"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

const ListItem = ({ data, onClick, onDelete }) => (
  <ul className="space-y-2 h-[200px] overflow-y-auto">
    {data.map((item) => (
      <li
        key={item._id}
        className="flex justify-between bg-gray-50 p-2 rounded-lg"
      >
        <div
          className="flex space-x-2 items-center cursor-pointer"
          onClick={() => onClick(item._id)}
        >
          {item.is_checked ? (
            <IconCircleCheckFilled size={22} />
          ) : (
            <IconCirclePlus size={22} />
          )}
          <span>{item.kategori}</span>
          <span>-</span>
          <span>{item.nama}</span>
        </div>

        {item.is_created_by_user && (
          <div
            onClick={() => onDelete(item._id)}
            className="cursor-pointer text-red-500"
          >
            <IconTrash size={20} />
          </div>
        )}
      </li>
    ))}
  </ul>
);

const SelectedList = ({ data, onUpdate, onDelete }) => {
  const [modal, setModal] = useState(null);

  return (
    <>
      {modal && (
        <FormModal callback={() => setModal(null)}>
          <ModalCard
            item={modal}
            callback={() => setModal(null)}
            updateDataCallback={onUpdate}
          />
        </FormModal>
      )}

      <ul className="space-y-2">
        {data.map((item) => (
          <li
            key={item._id}
            className="flex bg-gray-50 p-2 rounded-lg"
          >
            <IconX
              className="cursor-pointer text-red-500"
              onClick={() => onDelete(item._id)}
            />
            <IconPencil
              className="cursor-pointer text-gray-500 ml-2"
              onClick={() => setModal(item)}
            />

            <div className="ml-4 text-sm">
              {item.amount} × {item.nama} (
              {formatter.format(item.biaya)}) =
              <b> {formatter.format(item.biaya * item.amount)}</b>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

/* =======================
   MAIN PAGE
======================= */

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [copied, setCopied] = useState(false);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    fetch("/api/pengeluaran/all")
      .then((res) => res.json())
      .then((res) => {
        const mapped = res.data.map((item) => ({
          ...item,
          is_checked: false,
          is_filtered: false,
          amount: 1,
        }));

        setData(mapped);
        setFilteredData(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* =======================
     HANDLERS
  ======================= */

  const toggleItem = (id) => {
    let updated;
    const newData = data.map((item) => {
      if (item._id === id) {
        updated = { ...item, is_checked: !item.is_checked };
        return updated;
      }
      return item;
    });

    const selected = newData.filter((i) => i.is_checked);
    setData(newData);
    setFilteredData(newData);
    setSelectedData(selected);
    setTotal(selected.reduce((a, b) => a + b.biaya * b.amount, 0));
  };

  const deleteHandler = (id) => {
    deleteData(id);
    const newData = data.filter((i) => i._id !== id);
    const selected = newData.filter((i) => i.is_checked);

    setData(newData);
    setFilteredData(newData);
    setSelectedData(selected);
    setTotal(selected.reduce((a, b) => a + b.biaya * b.amount, 0));
  };

  const updateHandler = (item) => {
    const updated = updateDataById(item);
    const newData = data.map((d) =>
      d._id === updated._id ? updated : d
    );
    const selected = newData.filter((i) => i.is_checked);

    setData(newData);
    setFilteredData(newData);
    setSelectedData(selected);
    setTotal(selected.reduce((a, b) => a + b.biaya * b.amount, 0));
  };

  const addHandler = (kategori, nama, biaya) => {
    const newItem = addData(kategori, nama, biaya);
    const newData = [newItem, ...data];

    setData(newData);
    setFilteredData(newData);
  };

  const searchHandler = (value) => {
    if (!value) {
      setFilteredData(data);
      return;
    }
    const v = value.toLowerCase();
    setFilteredData(
      data.filter((i) =>
        `${i.kategori}-${i.nama}`.toLowerCase().includes(v)
      )
    );
  };

  /* =======================
     RENDER
  ======================= */

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading data...
      </div>
    );
  }

  return (
    <>
      <HomeCard title="Kalkulator Pengeluaran">
        <SearchForm onChange={searchHandler} />

        {filteredData.length > 0 ? (
          <ListItem
            data={filteredData}
            onClick={toggleItem}
            onDelete={deleteHandler}
          />
        ) : (
          <div className="text-center text-gray-400">
            Tidak ada data
          </div>
        )}

        <div className="flex justify-between mt-2">
          <button
            className="text-sm text-gray-400"
            onClick={() => setOpenCreate(true)}
          >
            tambah data
          </button>
        </div>
      </HomeCard>

      <HomeCard
        title={
          <div className="flex justify-between">
            <span>Pengeluaran</span>
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => {
                navigator.clipboard.writeText(total);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {formatter.format(total)}
            </span>
          </div>
        }
      >
        {selectedData.length > 0 ? (
          <SelectedList
            data={selectedData}
            onUpdate={updateHandler}
            onDelete={toggleItem}
          />
        ) : (
          <div className="text-center text-gray-400">
            Belum ada Pengeluaran
          </div>
        )}

        {copied && (
          <div className="text-xs text-center mt-2">
            Nilai disalin!
          </div>
        )}
      </HomeCard>

      {openCreate && (
        <FormModal callback={() => setOpenCreate(false)}>
          <ModalCreateCard
            item={data[0]}
            callback={() => setOpenCreate(false)}
            addDataCallback={addHandler}
            listKategori={[...new Set(data.map((i) => i.kategori))]}
          />
        </FormModal>
      )}
    </>
  );
}
