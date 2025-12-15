import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Todo,
  addTodo,
  deleteTodo,
  getTodos,
  initDB,
  updateTodo,
} from "../services/todoService";

/** Simple checkbox component (no extra libs) */
function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.checkboxContainer}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkboxTick}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        await reload(filter);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function reload(selected: "all" | "done" | "undone" = "all") {
    setLoading(true);
    try {
      const data = await getTodos(selected);
      setTodos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddOrUpdate() {
    if (!text.trim()) return;
    try {
      if (editingId !== null) {
        await updateTodo(editingId, { text: text.trim() });
        setEditingId(null);
      } else {
        await addTodo(text.trim());
      }
      setText("");
      await reload(filter);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleToggle(item: Todo) {
    if (item.id == null) return;
    try {
      await updateTodo(item.id, { done: item.done ? 0 : 1 });
      await reload(filter);
    } catch (e) {
      console.error(e);
    }
  }

  function startEdit(item: Todo) {
    setEditingId(item.id ?? null);
    setText(item.text);
  }

  function confirmDelete(item: Todo) {
    if (item.id == null) return;
    Alert.alert("Hapus Todo", "Yakin ingin menghapus?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(item.id!);
            await reload(filter);
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  }

  function renderItem({ item }: { item: Todo }) {
    return (
      <View style={styles.itemRow}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Checkbox checked={item.done === 1} onToggle={() => handleToggle(item)} />

          <View style={{ marginLeft: 10, flexShrink: 1 }}>
            <Text style={[styles.itemText, item.done ? styles.doneText : null]} numberOfLines={2}>
              {item.text}
            </Text>

            {item.finished_at ? (
              <Text style={styles.smallText}>Selesai: {item.finished_at}</Text>
            ) : null}
          </View>
        </View>

        <Button title="Edit" onPress={() => startEdit(item)} />
        <View style={{ width: 8 }} />
        <Button color="#d9534f" title="Del" onPress={() => confirmDelete(item)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo (SQLite)</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Tulis todo..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button title={editingId !== null ? "Simpan" : "Tambah"} onPress={handleAddOrUpdate} />
      </View>

      {/* FILTERS: dipindah di bawah input */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.filterActive]}
          onPress={async () => {
            setFilter("all");
            await reload("all");
          }}
        >
          <Text style={filter === "all" ? styles.filterTextActive : styles.filterText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === "done" && styles.filterActive]}
          onPress={async () => {
            setFilter("done");
            await reload("done");
          }}
        >
          <Text style={filter === "done" ? styles.filterTextActive : styles.filterText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === "undone" && styles.filterActive]}
          onPress={async () => {
            setFilter("undone");
            await reload("undone");
          }}
        >
          <Text style={filter === "undone" ? styles.filterTextActive : styles.filterText}>Undone</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(i, idx) => (i.id != null ? String(i.id) : String(idx))}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center" }}>{loading ? "Memuat..." : "Belum ada todo."}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 8, marginRight: 8, borderRadius: 6 },

  filterRow: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "flex-start",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  filterActive: {
    backgroundColor: "#007bff",
  },
  filterText: { color: "#333" },
  filterTextActive: { color: "white" },

  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemText: { fontSize: 16 },
  doneText: { textDecorationLine: "line-through", color: "#999" },
  smallText: { fontSize: 12, color: "#666" },

  /* checkbox styles */
  checkboxContainer: {
    padding: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkboxTick: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});