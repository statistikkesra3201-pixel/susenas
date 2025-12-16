// utilize local storage
import komoditasDefault from "@/data/konversi_satuan.json";
import { uuid } from "uuidv4";

/**
 * Retrieves the local komoditas data from localStorage.
 *
 * @returns {Object} The parsed JSON komoditas data stored in localStorage.
 */
export const getLocalKomoditas = () => {
  return JSON.parse(localStorage.getItem("komoditas"));
};

/**
 * Returns a copy of the default komoditas data from the
 * konversi_satuan.json file, adding an is_created_by_user
 * property to each komoditas object set to false to indicate
 * it is a default value.
 */
export const getDefaultKomoditas = () => {
  return komoditasDefault.map((k) => {
    return {
      ...k,
      is_created_by_user: false,
    };
  });
};

/**
 * Retrieves the komoditas data, merging any custom user
 * komoditas from localStorage with the default komoditas.
 *
 * Gets the custom komoditas saved in localStorage, and the
 * default komoditas from the JSON file. If localStorage
 * contains custom komoditas, it merges the localStorage
 * komoditas with the default komoditas, preferring the
 * localStorage values. If no custom komoditas exist in localStorage,
 * it returns just the default komoditas array.
 *
 * @returns {Array} The komoditas array, merging localStorage and defaults.
 */
export const getKomoditas = () => {
  const localKomoditas = getLocalKomoditas();
  const defaultKomoditas = getDefaultKomoditas();

  return localKomoditas
    ? [...localKomoditas, ...defaultKomoditas]
    : defaultKomoditas;
};

/**
 * Retrieves a komoditas object by its ID from the komoditas data.
 *
 * @param {string} id - The ID of the komoditas object to retrieve.
 * @returns {Object} The komoditas object with the matching ID.
 */
export const getKomoditasById = (id) => {
  return getKomoditas().komoditas.filter((item) => item.index == id);
};

/**
 * Adds a new komoditas object to local storage.
 *
 * @param {string} kategori - The komoditas category
 * @param {string} nama_komoditas - The komoditas name
 * @param {object} satuan_subsatuan - The komoditas subunits and conversion factors
 * @param {number} faktor_pengali - The komoditas conversion factor to standard unit
 * @param {string} satuan_standar - The komoditas standard unit
 *
 * @returns {object} The new komoditas object
 */
export const addKomoditas = (
  kategori,
  nama_komoditas,
  satuan_subsatuan,
  faktor_pengali,
  satuan_standar
) => {
  const newkomoditas = {
    index: uuid(),
    kategori,
    nama_komoditas,
    satuan_subsatuan,
    faktor_pengali,
    satuan_standar,
    id_komoditas: kategori + "_" + nama_komoditas,
    is_created_by_user: true,
  };

  let res = [newkomoditas];

  if (typeof Storage !== "undefined") {
    try {
      const customkomoditas = getKomoditas().filter(
        (k) => k.is_created_by_user
      );
      if (customkomoditas && customkomoditas.length > 0) {
        res = [...res, ...customkomoditas];
      }
      localStorage.setItem("komoditas", JSON.stringify(res));
    } catch (e) {
      console.log(e);
    }
  }
  return {
    ...newkomoditas,
    is_checked: true,
    is_filtered: false,
    amount: 1,
  };
};

/**
 * Updates a komoditas by ID.
 *
 * @param {string} id - The ID of the komoditas to update.
 * @param {string} kategori - The updated kategori.
 * @param {string} nama_komoditas - The updated nama_komoditas.
 * @param {string} satuan_subsatuan - The updated satuan_subsatuan.
 * @param {number} faktor_pengali - The updated faktor_pengali.
 * @param {string} satuan_standar - The updated satuan_standar.
 * @returns {Object} The updated komoditas object.
 */
export const updateKomoditasById = (
  id,
  kategori,
  nama_komoditas,
  satuan_subsatuan,
  faktor_pengali,
  satuan_standar
) => {
  let allKomoditas = getKomoditas();
  let komoditas = allKomoditas.filter((item) => item.index == id)[0];

  if (!allKomoditas) {
    return new Error("empty komoditas");
  }

  if (!komoditas) {
    return new Error("not found");
  }

  const updatedKomoditas = {
    ...komoditas,
    kategori,
    nama_komoditas,
    satuan_subsatuan,
    faktor_pengali,
    satuan_standar,
  };

  const res = allKomoditas.map((item) => {
    if (item.index === id) {
      return updatedKomoditas;
    }
    return item;
  });

  if (typeof Storage !== "undefined" && komoditas.is_created_by_user) {
    try {
      localStorage.setItem(
        "komoditas",
        JSON.stringify(res.filter((k) => k.is_created_by_user))
      );
    } catch (e) {
      console.log(e);
    }
  }
  return updatedKomoditas;
};

/**
 * Deletes a komoditas by id.
 *
 * @param {number} id_komoditas - The id of the komoditas to delete.
 * @returns {boolean} - True if the delete was successful, false otherwise.
 */
export const deleteKomoditas = (id_komoditas) => {
  console.log(id_komoditas);
  const komoditas = getKomoditas();
  const res = komoditas.filter(
    (item) => item.id_komoditas != id_komoditas && item.is_created_by_user
  );
  if (typeof Storage !== "undefined") {
    try {
      localStorage.setItem("komoditas", JSON.stringify(res));
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};

/**
 * Remaps an array of komoditas objects to have unique id_komoditas values.
 *
 * For komoditas with the same id_komoditas, combines them into a single object
 * with properties like is_checked merged.
 *
 * This allows displaying a list of komoditas with checkboxes, while preserving
 * the underlying komoditas data structure.
 *
 * @param {Array} komoditas - Array of komoditas objects
 * @returns {Array} Remapped array of komoditas objects
 */
export const remapUniqueKomoditas = (komoditas) => {
  return [...new Set(komoditas.map((item) => item.id_komoditas))].map(
    (id_komoditas, id) => {
      let tempData = komoditas.filter((item) =>
        item.id_komoditas.includes(id_komoditas)
      );

      return {
        id,
        id_komoditas,
        is_checked: tempData.some((k) => k.is_checked),
        is_filtered: tempData.some((k) => k.is_filtered),
        selected_satuan_standar: tempData[0].satuan_standar,
        selected_satuan: tempData[0].satuan_subsatuan,
        is_created_by_user: tempData.some((k) => k.is_created_by_user),
        konversi: tempData.map((item) => {
          return {
            satuan_standar: item.satuan_standar,
            satuan_subsatuan: item.satuan_subsatuan,
            faktor_pengali: item.faktor_pengali,
          };
        }),
        amount: 1,
      };
    }
  );
};
