import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { ymKey } from "../utils/money";

const STORAGE_KEY = "moneyux:v1";

export type TxType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  icon: string; // Ionicons name
  color: string; // hex
  type: TxType;
};

export type Tx = {
  id: string;
  type: TxType;
  categoryId: string;
  amount: number;
  note?: string;
  dateISO: string;
};

type Data = {
  categories: Category[];
  txs: Tx[];
};

const seed: Data = {
  categories: [
    { id: "c_food", name: "Еда", icon: "fast-food", color: "#FF6B6B", type: "expense" },
    { id: "c_transport", name: "Транспорт", icon: "car", color: "#4D96FF", type: "expense" },
    { id: "c_house", name: "Дом", icon: "home", color: "#34D399", type: "expense" },
    { id: "c_fun", name: "Развлечения", icon: "game-controller", color: "#A78BFA", type: "expense" },
    { id: "c_salary", name: "Зарплата", icon: "cash", color: "#FF7A00", type: "income" },
    { id: "c_freelance", name: "Фриланс", icon: "briefcase", color: "#F59E0B", type: "income" },
  ],
  txs: [],
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function useFinanceStore() {
  const [data, setData] = useState<Data>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setData(JSON.parse(raw));
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const api = useMemo(() => {
    function addCategory(c: Omit<Category, "id">) {
      setData((d) => ({ ...d, categories: [{ ...c, id: uid("cat") }, ...d.categories] }));
    }

    function removeCategory(categoryId: string) {
      setData((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== categoryId),
        txs: d.txs.filter((t) => t.categoryId !== categoryId),
      }));
    }

    function addTx(tx: Omit<Tx, "id">) {
      setData((d) => ({ ...d, txs: [{ ...tx, id: uid("tx") }, ...d.txs] }));
    }

    function months(): string[] {
      const set = new Set<string>();
      for (const t of data.txs) set.add(ymKey(new Date(t.dateISO)));
      if (set.size === 0) set.add(ymKey(new Date()));
      return Array.from(set).sort().reverse();
    }

    function summary(monthKey: string) {
      const monthTx = data.txs.filter((t) => ymKey(new Date(t.dateISO)) === monthKey);
      let income = 0;
      let expense = 0;
      for (const t of monthTx) {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
      }
      return { income, expense, total: income - expense, monthTx };
    }

    function topByAmount(monthKey: string, type: TxType, limit = 10) {
      const { monthTx } = summary(monthKey);
      return monthTx
        .filter((t) => t.type === type)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit);
    }

    return { ready, data, addCategory, removeCategory, addTx, months, summary, topByAmount };
  }, [data, ready]);

  return api;
}
