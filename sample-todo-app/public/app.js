const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

async function fetchTodos() {
  const res = await fetch("/api/todos");
  return res.json();
}

function renderTodos(todos) {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", async () => {
      await fetch(`/api/todos/${todo._id}`, { method: "PATCH" });
      renderTodos(await fetchTodos());
    });

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      await fetch(`/api/todos/${todo._id}`, { method: "DELETE" });
      renderTodos(await fetchTodos());
    });

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  renderTodos(await fetchTodos());
});

fetchTodos().then(renderTodos);
