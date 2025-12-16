import {
  addData,
  data as dummyData,
  updateDataById,
  deleteData,
} from "@/data/pengeluaran";
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
  Home as HomeCard,
  Modal as ModalCard,
  ModalCreate as ModalCreateCard,
} from "@/components/Card";
import { Modal as FormModal } from "@/components/Modal";

const TITLE = "Kalkulator Pengeluaran";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const ListItem = ({ data, callback, deleteDataCallback }) => {
  return (
    <ul className="text-sm space-y-2 h-[200px] overflow-y-auto scrollbar-thumb-gray-400 scrollbar-thin scrollbar-rounded-large scrollbar-track-gray-100">
      {data.map((item) => (
        <li
          key={item._id}
          className="flex justify-between space-x-2 bg-gray-50 p-2 rounded-lg pr-4 items-center"
        >
          <div
            className={`flex flex-1 space-x-2  hover:cursor-pointer hover:text-blue-500 text-gray-600 duration-200 ease-in-out ${
              item.is_checked ? "text-green-500 hover:text-blue-500" : ""
            }`}
            onClick={(e) => callback(item._id)}
            disabled={item.is_checked}
          >
            {item.is_checked ? (
              <IconCircleCheckFilled color="gray" size={24} stroke={2} />
            ) : (
              <IconCirclePlus size={24} stroke={2} color="gray" />
            )}
            <span>{item.kategori}</span>
            <span>-</span>
            <span>{item.nama}</span>
          </div>
          {item.is_created_by_user && (
            <div
              className="p-2 relative text-white shadow rounded-md bg-gradient-to-tr from-red-400 to-orange-200 hover:cursor-pointer hover:shadow-lg duration-300 ease-in-out"
              onClick={() => {
                deleteDataCallback(item._id);
              }}
            >
              <IconTrash size={20} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export const ListSelectedItem = ({
  data,
  updateDataCallback,
  deleteDataCallback,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const onModalClickHandler = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <FormModal callback={onModalClickHandler}>
          <ModalCard
            item={modalItem}
            callback={onModalClickHandler}
            updateDataCallback={updateDataCallback}
          />
        </FormModal>
      )}
      <ul className="text-sm space-y-2">
        {data.map((item) => (
          <li
            key={item._id}
            className={`flex space-x-2 bg-gray-50 p-2 rounded-lg shadow`}
          >
            <div className="flex w-full items-center space-x-4">
              <div
                className="p-2 relative text-white shadow rounded-md bg-gradient-to-tr from-red-400 to-orange-200 hover:cursor-pointer hover:shadow-lg duration-300 ease-in-out"
                onClick={() => {
                  deleteDataCallback(item._id);
                }}
              >
                <IconX size={20} />
              </div>
              <div
                className="p-2 relative text-white shadow rounded-md bg-gradient-to-tr from-gray-400 to-sky-200 hover:cursor-pointer hover:shadow-lg duration-300 ease-in-out"
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  setModalItem(item);
                }}
              >
                <IconPencil size={20} />
              </div>

              <div className="flex space-x-2 md:space-x-4 items-center overflow-x-auto text-xs md:text-regular p-2">
                <span>{item.amount}</span>
                <span>
                  <IconX size={16} />
                </span>
                <div className="flex-1">{item.nama}</div>
                <span> ({formatter.format(item.biaya)})</span>
                <span>=</span>
                <span>{formatter.format(item.biaya * item.amount)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export const SearchForm = ({ callback }) => {
  const [searchInput, setSearchInput] = useState("");
  const onChangeHandler = (e) => {
    setSearchInput(e.target.value);
    callback(e.target.value);
  };
  return (
    <div className="border-[0.5px] rounded-lg bg-gray-100 w-full md:w-11/12 lg:w-8/12 m-auto">
      <input
        type="text"
        placeholder="cari kategori pengeluaran"
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm placeholder-slate-400
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={searchInput}
        onChange={onChangeHandler}
      />
    </div>
  );
};

// kita butuh, is_filtered, is_checked
export default function Home() {
  const [total, setTotal] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  let pengeluaranComp;

  useEffect(() => {
    let tempData;
    // kalau mendukung localStorage dan ada data,
    // ambil data itu, tambahin atribut is_checked, is_filtered, amount
    if (
      typeof Storage !== "undefined" &&
      localStorage.getItem("data") !== null
    ) {
      const lsData = JSON.parse(localStorage.getItem("data"));
      // hapus data sebelumnya
      if (lsData.filter((item) => item._id == 1).length > 0) {
        localStorage.removeItem("data");
      }

      if (lsData.length > 0) {
        tempData = lsData.map((item) => {
          return { ...item, is_checked: false, is_filtered: false, amount: 1 };
        });
      }
    }
    fetch("/api/pengeluaran/all")
      .then((data) => data.json())
      .then((dataJson) => {
        // remap data

        const dataFetch = dataJson.data.map((item) => {
          return { ...item, is_checked: false, is_filtered: false, amount: 1 };
        });
        // kalau ada tempData, taruh di atas list
        if (tempData) {
          setData(() => [...tempData, ...dataFetch]);
          setFilteredData(() => [...tempData, ...dataFetch]);
        } else {
          setData(dataFetch);
          setFilteredData(dataFetch);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  const getTotal = (total, item) => {
    return total + item.biaya * item.amount;
  };

  const pengeluaranClickHandler = (id) => {
    let updatedItem;
    let updatedData = data.map((item) => {
      if (item._id == id) {
        updatedItem = { ...item, is_checked: !item.is_checked, amount: 1 };
        return updatedItem;
      }
      return item;
    });
    setData(updatedData);
    // taruh data yang diklik ke paling bawah
    const tempSelectedData = [
      ...updatedData.filter((item) => item.is_checked && item._id != id),
    ];
    if (updatedItem.is_checked) {
      tempSelectedData.push(updatedItem);
    }
    setSelectedData(tempSelectedData);
    setTotal(tempSelectedData.reduce(getTotal, 0));
    setFilteredData((prev) =>
      prev.map((item) => {
        if (item._id == id) {
          return updatedItem;
        }
        return item;
      })
    );
  };

  const updateDataHandler = (item) => {
    let tempData = updateDataById(item);
    tempData = data.map((d) => {
      if (d._id == tempData._id) {
        return tempData;
      }
      return d;
    });
    const tempSelectedData = tempData.filter((item) => item.is_checked);
    setSelectedData(tempSelectedData);
    setData(tempData);
    setTotal(tempSelectedData.reduce(getTotal, 0));
    // setFilteredData(tempData);
  };

  const addDataHandler = (kategori, nama, biaya) => {
    let tempData = addData(kategori, nama, biaya);
    tempData = [tempData, ...data];
    const tempSelectedData = tempData.filter((item) => item.is_checked);
    setSelectedData(tempSelectedData);
    setData(tempData);
    setTotal(tempSelectedData.reduce(getTotal, 0));
    setFilteredData(tempData);
  };

  const deleteDataHandler = (id) => {
    deleteData(id);
    let tempData = data.filter((item) => item._id != id);
    const tempSelectedData = tempData.filter((item) => item.is_checked);
    setSelectedData(tempSelectedData);
    setData(tempData);
    setTotal(tempSelectedData.reduce(getTotal, 0));
    setFilteredData(tempData);
  };

  const resetSelection = () => {
    const dataFetch = data.map((item) => {
      return { ...item, is_checked: false, is_filtered: false, amount: 1 };
    });
    setData(dataFetch);
    setFilteredData(dataFetch);
    setSelectedData([]);
    setTotal(0);
  };

  const onModalClickHandler = () => {
    setIsOpen((prev) => !prev);
  };

  if (!data) {
    return (
      <div>
        <h1>...loading</h1>
      </div>
    );
  } else {
    pengeluaranComp = (
      <>
        {filteredData.length > 0 ? (
          <ListItem
            data={filteredData}
            callback={pengeluaranClickHandler}
            deleteDataCallback={deleteDataHandler}
          />
        ) : (
          <div className="m-auto text-center text-gray-400">Tidak ada data</div>
        )}
      </>
    );
  }
  const searchChangeHandler = (input) => {
    const filterInput = input.toLowerCase();
    if (filterInput.length < 1) {
      setFilteredData(data);
    } else {
      const tempData = data.filter((item) => {
        const temp =
          "" + item.kategori.toLowerCase() + "-" + item.nama.toLowerCase();
        return temp.includes(filterInput);
      });
      setFilteredData(tempData);
    }
  };

  return (
    <>
      <HomeCard title="Kalkulator Pengeluaran">
        <div className="space-y-2">
          {isOpen && (
            <div className="">
              <FormModal callback={onModalClickHandler}>
                <ModalCreateCard
                  item={data[0]}
                  callback={onModalClickHandler}
                  addDataCallback={addDataHandler}
                  listKategori={[...new Set(data.map((item) => item.kategori))]}
                />
              </FormModal>
            </div>
          )}
          <SearchForm callback={searchChangeHandler} />
          {pengeluaranComp}
          <div
            className={`flex space-x-2 p-2 text-gray-600 rounded-lg duration-200 ease-in-out text-center`}
          >
            <div className="flex m-auto w-full justify-between items-center">
              {selectedData.length > 0 ? (
                <div
                  className="border rounded-lg border-gray-200 px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-100 duration-200 ease-in-out hover:cursor-pointer"
                  onClick={resetSelection}
                >
                  reset pilihan
                </div>
              ) : (
                <div
                  className="border rounded-lg border-gray-200 px-4 py-2 text-xs sm:text-sm text-gray-400 cursor-not-allowed"
                  // onClick={resetSelection}
                >
                  reset pilihan
                </div>
              )}

              <div
                onClick={onModalClickHandler}
                className="hover:cursor-pointer hover:text-green-500 text-gray-400 duration-200 ease-in-out"
              >
                <IconCirclePlus size={30} stroke={2} />
              </div>
            </div>
          </div>
        </div>
      </HomeCard>
      <HomeCard
        title={
          <div className="flex justify-between">
            <span>Pengeluaran</span>
            <div className="flex space-x-4 relative">
              Total-
              <div
                className="flex space-x-2 items-center w-fit text-blue-500 hover:cursor-pointer hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText(total);
                  setShowTooltip(true);
                  setTimeout(() => setShowTooltip(false), 2500);
                }}
              >
                <span>{formatter.format(total)}</span>

                <IconCopy size={20} />
              </div>
              <span
                className="absolute -bottom-6 right-2 bg-gray-100 px-2 py-1 rounded text-xs duration-1000 text-black shadow-md z-20"
                style={{
                  display: showTooltip ? "block" : "none",
                }}
              >
                Nilai disalin !
              </span>
            </div>
          </div>
        }
      >
        {selectedData.length > 0 ? (
          <ListSelectedItem
            data={selectedData}
            updateDataCallback={updateDataHandler}
            deleteDataCallback={pengeluaranClickHandler}
          />
        ) : (
          <div className="m-auto text-center text-gray-400">
            Belum ada Pengeluaran
          </div>
        )}
      </HomeCard>
    </>
  );
  // // <main className="bg-gray-50 min-h-screen space-y-4 relative pb-48">
  //   <nav className="p-4 bg-gray-100 shadow">
  //     <div>
  //       <h1 className="text-gray-700 text-xl text-center font-medium">
  //         {TITLE}
  //       </h1>
  //     </div>
  //   </nav>
  {
    /* <div className="w-11/12 md:w-8/12 lg:w-6/12 bg-white m-auto rounded-xl h-fit p-4 space-y-2 shadow">
        <div className="flex justify-between ">
          <h1 className="text-lg font-medium text-gray-600">Provinsi Jambi</h1>
          <Link
            className="py-1 px-4 rounded-md bg-blue-500 duration-200 ease-in-out hover:bg-blue-400 hover:cursor-pointer shadow-blue-100"
            href="/admin/login"
          >
            <IconLogin size={24} color="white" />
          </Link>
        </div>
      </div> */
  }

  {
    /* <footer className="h-24 p-4 bg-gray-100 font-medium text-center m-auto text-sm md:text-base text-gray-600 absolute bottom-0 inset-x-0">
        Made by{" "}
        <a href="https://github.com/fikrianggara" className="text-blue-500">
          Fikri Septrian A.
        </a>
        , in collaboration with{" "}
        <a href="https://tanjabtimkab.bps.go.id/" className="text-blue-500">
          BPS Tanjung Jabung Timur
        </a>
      </footer> */
  }
  {
    /* </main> */
  }
}

