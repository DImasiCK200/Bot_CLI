# Bot_CLI
# CS2_CLI Demo

Это демонстрация консольного приложения на Node.js с архитектурой, готовой к расширению (аккаунты, задачи, трейды, работа с маркетом CS:GO API и т.д.).

---

## Архитектура

- **Application** — управляет жизненным циклом приложения
- **Context** — хранит состояние и ссылки на менеджеры
- **AccountManager** — управляет аккаунтами
- **TaskManager** — управляет фоновыми задачами
- **Menu** — хранит пункты меню и динамическое описание
- **Command** — отдельные действия, которые меняют состояние через `Context`

---

## Пример структуры

Application
└─ run loop
Context
├─ accountManager
├─ taskManager
└─ menuStack
AccountManager
├─ accounts[]
└─ current
TaskManager
└─ start()/status()/stop()
Menu
├─ title
├─ items [{ label, command }]
└─ descriptionFn(ctx)
Commands
├─ SelectAccountCommand
├─ StartTaskCommand
├─ ExitCommand
└─ BackCommand

---

## Пример использования

```javascript
import { Application } from "./src/Application.js";
import { Context } from "./src/Context.js";
import { ConsoleView } from "./src/ConsoleView.js";
import { Menu } from "./src/menu/Menu.js";
import { AccountManager } from "./src/managers/AccountManager.js";
import { TaskManager } from "./src/managers/TaskManager.js";
import { SelectAccountCommand, ExitCommand } from "./src/commands/index.js";

// Инициализация менеджеров
const accounts = [
  { id: 1, name: "Account_1" },
  { id: 2, name: "Account_2" }
];
const accountManager = new AccountManager(accounts);
const taskManager = new TaskManager();

// Инициализация контекста
const context = new Context({ accountManager, taskManager });

// Главное меню
const mainMenu = new Menu(
  "Main Menu",
  (ctx) => {
    const acc = ctx.accountManager.getCurrent();
    return acc ? `Current account: ${acc.name}` : "No account selected";
  },
  [
    { label: "Choose Account", command: new SelectAccountCommand() },
  ]
);

// Стартовое меню
context.pushMenu(mainMenu);

// View и Application
const view = new ConsoleView();
const app = new Application(context, view);

// Запуск приложения
await app.run();
Особенности
Динамическое описание меню — всегда показывает актуальный аккаунт

Автоматические пункты навигации: «Back» и «Exit»

Менеджеры в Context — легко масштабировать (TaskManager, TradeManager, MarketAPI и т.д.)

Команды отделены от меню и контекста, реализуют конкретные действия

Планы на расширение
Работа с трейдами CS:GO

Фоновые задачи (TaskManager)

Поддержка нескольких аккаунтов

Интеграция с маркет API

Динамическое отображение прогресса и состояния

Как запускать
bash
Копировать код
node index.js
Приложение выведет меню с динамическим описанием и автоматически добавленными пунктами «Back» и «Exit».
