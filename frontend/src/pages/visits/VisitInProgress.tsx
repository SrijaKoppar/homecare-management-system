import { useState } from "react";

export default function VisitInProgress() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Morning hygiene", done: false },
    { id: 2, name: "Medication - 9AM", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Visit - Mary Smith</h2>

      {tasks.map(task => (
        <div key={task.id} className="flex justify-between border p-3 rounded mb-2">
          <span className={task.done ? "line-through" : ""}>
            {task.name}
          </span>
          <button
            onClick={() => toggleTask(task.id)}
            className="text-blue-600"
          >
            {task.done ? "Undo" : "Complete"}
          </button>
        </div>
      ))}

      <textarea
        className="w-full border p-2 rounded mt-4"
        placeholder="Visit summary..."
      />

      <button className="bg-red-600 text-white px-4 py-2 rounded mt-4">
        End Visit
      </button>
    </div>
  );
}