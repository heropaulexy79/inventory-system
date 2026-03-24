import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "./config";
import { Product, InventoryEntry, ElectricityLog, DailyReport } from "../lib/types";

// Collection references
const productsCol = collection(db, "products");
const inventoryEntriesCol = collection(db, "inventory_entries");
const electricityLogsCol = collection(db, "electricity_logs");
const reportsCol = collection(db, "reports");

// Products
export const getProducts = async () => {
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const updateProductStock = async (id: string, newStock: number) => {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, { currentStock: newStock });
};

// Inventory Entries
export const addInventoryEntry = async (entry: Omit<InventoryEntry, 'id' | 'timestamp'>) => {
  await addDoc(inventoryEntriesCol, {
    ...entry,
    timestamp: Timestamp.now()
  });
};

export const getInventoryEntriesByDate = async (date: string) => {
  const q = query(inventoryEntriesCol, where("date", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryEntry));
};

// Electricity
export const addElectricityLog = async (log: Omit<ElectricityLog, 'id' | 'timestamp'>) => {
  await addDoc(electricityLogsCol, {
    ...log,
    timestamp: Timestamp.now()
  });
};

// Reports
export const addReport = async (report: Omit<DailyReport, 'id' | 'timestamp'>) => {
  await addDoc(reportsCol, {
    ...report,
    timestamp: Timestamp.now()
  });
};
